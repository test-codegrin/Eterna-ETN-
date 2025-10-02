import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, formatEther } from "ethers";
import type { WalletState } from "../types";
import { config } from "../config";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: "0",
    tokenBalance: "0",
    isConnected: false,
    chainId: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to use this app.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        setWallet({
          address,
          balance: formatEther(balance),
          tokenBalance: "0",
          isConnected: true,
          chainId: Number(network.chainId),
        });
      }
    } catch (err: any) {
      console.error("Error checking wallet connection:", err);
      setError(err.message);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to use this app.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please check MetaMask.");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      const chainId = Number(network.chainId);

      if (chainId !== config.chainId) {
        await switchNetwork();
      }

      setWallet({
        address,
        balance: formatEther(balance),
        tokenBalance: "0",
        isConnected: true,
        chainId,
      });
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: "0",
      tokenBalance: "0",
      isConnected: false,
      chainId: null,
    });
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${config.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${config.chainId.toString(16)}`,
                chainName: config.networkName,
                nativeCurrency: config.nativeCurrency,
                rpcUrls: [config.rpcUrl],
                blockExplorerUrls: [config.explorerUrl],
              },
            ],
          });
        } catch (addError: any) {
          throw new Error("Failed to add network to MetaMask");
        }
      } else {
        throw switchError;
      }
    }
  };

  const updateBalance = async () => {
    if (!wallet.address || !window.ethereum) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(wallet.address);

      setWallet((prev) => ({
        ...prev,
        balance: formatEther(balance),
      }));
    } catch (err: any) {
      console.error("Error updating balance:", err);
    }
  };

  const updateTokenBalance = useCallback((tokenBalance: string) => {
    setWallet((prev) => ({
      ...prev,
      tokenBalance,
    }));
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        checkIfWalletIsConnected();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [checkIfWalletIsConnected]);

  return {
    wallet,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    updateBalance,
    updateTokenBalance,
    switchNetwork,
  };
}
