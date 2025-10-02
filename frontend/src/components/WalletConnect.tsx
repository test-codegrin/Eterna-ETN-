import type { WalletState } from "../types";
import { formatAddress, formatBalance } from "../utils/formatters";
import { config } from "../config";

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

export function WalletConnect({ wallet, onConnect, onDisconnect, isLoading }: WalletConnectProps) {
  if (!wallet.isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-ice-green-100 dark:bg-ice-green-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-ice-green-600 dark:text-ice-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Connect Your Wallet</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your MetaMask wallet to interact with Eterna tokens
            </p>
          </div>
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="bg-ice-green-600 hover:bg-ice-green-700 dark:bg-ice-green-500 dark:hover:bg-ice-green-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ice-green-100 dark:bg-ice-green-900/30 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-ice-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Connected Wallet</h3>
            <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">
              {formatAddress(wallet.address || "")}
            </p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{config.nativeCurrency.symbol} Balance</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatBalance(wallet.balance)} {config.nativeCurrency.symbol}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ETN Balance</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatBalance(wallet.tokenBalance)} ETN
          </p>
        </div>
      </div>

      {wallet.chainId !== config.chainId && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            ⚠ Please switch to {config.networkName} to interact with the token
          </p>
        </div>
      )}
    </div>
  );
}
