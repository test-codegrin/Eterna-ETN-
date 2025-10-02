import type { TransferEvent } from "../types";
import { formatAddress, formatBalance } from "../utils/formatters";
import { config } from "../config";

interface TransferHistoryProps {
  transfers: TransferEvent[];
  isLoading: boolean;
  currentAddress: string;
}

export function TransferHistory({ transfers, isLoading }: TransferHistoryProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transfers</h3>
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-orange-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transfers</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600">No transfers found</p>
          <p className="text-sm text-gray-500 mt-1">Your sent transactions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transfers ({transfers.length})
      </h3>

      <div className="space-y-3">
        {transfers.map((transfer, index) => (
          <div
            key={`${transfer.transactionHash}-${index}`}
            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">To:</span>
                  <span className="text-sm font-mono font-medium text-gray-900">
                    {formatAddress(transfer.to)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Amount:</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {formatBalance(transfer.value, 4)} ETN
                  </span>
                </div>
              </div>

              <a
                href={`${config.explorerUrl}/tx/${transfer.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-orange-600 hover:text-orange-700 transition-colors"
                aria-label="View on explorer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Block: {transfer.blockNumber} • Hash: {formatAddress(transfer.transactionHash)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
