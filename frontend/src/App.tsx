import { useEffect } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { TransferForm } from "./components/TransferForm";
import { TransferHistory } from "./components/TransferHistory";
import { ToastContainer } from "./components/Toast";
import { useWallet } from "./hooks/useWallet";
import { useToken } from "./hooks/useToken";
import { useToast } from "./hooks/useToast";
import { config } from "./config";

function App() {
  const { wallet, isLoading, error, connectWallet, disconnectWallet, updateBalance } = useWallet();
  const { tokenBalance, tokenSymbol, transfers, isLoading: isLoadingTransfers, refetchBalance, refetchTransfers, getTokenContract } = useToken(wallet.address);
  const { toasts, success, error: showError, removeToast } = useToast();

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleTransfer = async (to: string, amount: bigint) => {
    try {
      const contract = await getTokenContract();
      if (!contract) {
        throw new Error("Failed to get token contract");
      }

      const tx = await contract.transfer(to, amount);
      success(`Transaction submitted! Hash: ${tx.hash.slice(0, 10)}...`);

      await tx.wait();

      success("Transfer successful!");
      await refetchBalance();
      await refetchTransfers();
      await updateBalance();
    } catch (err: any) {
      console.error("Transfer error:", err);

      let errorMessage = "Transfer failed";

      if (err.code === "ACTION_REJECTED") {
        errorMessage = "Transaction rejected by user";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (err.message.includes("insufficient balance")) {
        errorMessage = "Insufficient token balance";
      } else if (err.reason) {
        errorMessage = err.reason;
      } else if (err.message) {
        errorMessage = err.message;
      }

      showError(errorMessage);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Eterna Token</h1>
                <p className="text-sm text-gray-600">CodeGrin Technologies</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Network</p>
                <p className="text-sm font-medium text-gray-900">{config.networkName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {config.contractAddress === "0x0000000000000000000000000000000000000000" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Contract Not Configured</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Please deploy the contract and update the <code className="bg-yellow-100 px-1 py-0.5 rounded">VITE_CONTRACT_ADDRESS</code> in{" "}
                  <code className="bg-yellow-100 px-1 py-0.5 rounded">frontend/.env</code>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WalletConnect
            wallet={{
              ...wallet,
              tokenBalance,
            }}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            isLoading={isLoading}
          />

          <TransferForm
            onTransfer={handleTransfer}
            tokenSymbol={tokenSymbol}
            isDisabled={!wallet.isConnected || wallet.chainId !== config.chainId}
          />
        </div>

        {wallet.isConnected && (
          <TransferHistory
            transfers={transfers}
            isLoading={isLoadingTransfers}
            currentAddress={wallet.address || ""}
          />
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            View contract on{" "}
            <a
              href={`${config.explorerUrl}/address/${config.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              BSCScan
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
