import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { config, TOKEN_ABI } from "../config";
import type { TransferEvent } from "../types";

export function useToken(walletAddress: string | null) {
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [tokenSymbol, setTokenSymbol] = useState<string>("ETN");
  const [transfers, setTransfers] = useState<TransferEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTokenContract = useCallback(async () => {
    if (!window.ethereum) return null;

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(config.contractAddress, TOKEN_ABI, signer);
  }, []);

  const fetchTokenBalance = useCallback(async () => {
    if (!walletAddress || !window.ethereum) {
      setTokenBalance("0");
      return;
    }

    try {
      const contract = await getTokenContract();
      if (!contract) return;

      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      setTokenBalance(formatUnits(balance, decimals));
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setTokenBalance("0");
    }
  }, [walletAddress, getTokenContract]);

  const fetchTokenSymbol = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const contract = await getTokenContract();
      if (!contract) return;

      const symbol = await contract.symbol();
      setTokenSymbol(symbol);
    } catch (error) {
      console.error("Error fetching token symbol:", error);
    }
  }, [getTokenContract]);

  const fetchTransfers = useCallback(async () => {
    if (!walletAddress || !window.ethereum) {
      setTransfers([]);
      return;
    }

    setIsLoading(true);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(config.contractAddress, TOKEN_ABI, provider);

      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000);

      const filter = contract.filters.Transfer(walletAddress, null);
      const events = await contract.queryFilter(filter, fromBlock, currentBlock);

      const transferEvents: TransferEvent[] = await Promise.all(
        events.slice(-10).map(async (event: any) => {
          let timestamp: number | undefined;
          try {
            const block = await provider.getBlock(event.blockNumber);
            timestamp = block?.timestamp;
          } catch (error) {
            console.error("Error fetching block timestamp:", error);
          }

          return {
            from: event.args[0],
            to: event.args[1],
            value: formatUnits(event.args[2], 18),
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            timestamp,
          };
        })
      );

      setTransfers(transferEvents.reverse());
    } catch (error) {
      console.error("Error fetching transfers:", error);
      setTransfers([]);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchTokenSymbol();
  }, [fetchTokenSymbol]);

  useEffect(() => {
    fetchTokenBalance();
    fetchTransfers();
  }, [walletAddress, fetchTokenBalance, fetchTransfers]);

  return {
    tokenBalance,
    tokenSymbol,
    transfers,
    isLoading,
    refetchBalance: fetchTokenBalance,
    refetchTransfers: fetchTransfers,
    getTokenContract,
  };
}
