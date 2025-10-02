import type { WalletState } from "../types";
import { formatAddress, formatBalance } from "../utils/formatters";

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

export function WalletConnect({ wallet, onConnect, onDisconnect, isLoading }: WalletConnectProps) {
  if (!wallet.isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-600"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Connect Your Wallet</h3>
            <p className="text-sm text-gray-600">
              Connect your MetaMask wallet to interact with Eterna tokens
            </p>
          </div>
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Connected Wallet</h3>
            <p className="text-base font-mono font-semibold text-gray-900">
              {formatAddress(wallet.address || "")}
            </p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">BNB Balance</p>
          <p className="text-lg font-semibold text-gray-900">{formatBalance(wallet.balance)} BNB</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">ETN Balance</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatBalance(wallet.tokenBalance)} ETN
          </p>
        </div>
      </div>

      {wallet.chainId !== 97 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠ Please switch to BSC Testnet to interact with the token
          </p>
        </div>
      )}
    </div>
  );
}
