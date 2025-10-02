import { useState } from "react";
import type { FormEvent } from "react";
import { parseUnits } from "ethers";
import { isValidAddress, isValidAmount } from "../utils/formatters";

interface TransferFormProps {
  onTransfer: (to: string, amount: bigint) => Promise<void>;
  tokenSymbol: string;
  isDisabled: boolean;
}

export function TransferForm({ onTransfer, tokenSymbol, isDisabled }: TransferFormProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!isValidAddress(recipient)) {
      newErrors.recipient = "Invalid address format";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (!isValidAmount(amount)) {
      newErrors.amount = "Invalid amount";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const amountInWei = parseUnits(amount, 18);
      await onTransfer(recipient, amountInWei);

      setRecipient("");
      setAmount("");
      setErrors({});
    } catch (error: any) {
      console.error("Transfer error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send {tokenSymbol}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setErrors((prev) => ({ ...prev, recipient: undefined }));
            }}
            placeholder="0x..."
            disabled={isDisabled || isLoading}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-ice-green-500 focus:border-ice-green-500 outline-none transition-all font-mono text-sm dark:bg-gray-700 dark:text-white ${
              errors.recipient
                ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            } disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed`}
            aria-invalid={!!errors.recipient}
            aria-describedby={errors.recipient ? "recipient-error" : undefined}
          />
          {errors.recipient && (
            <p id="recipient-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.recipient}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount ({tokenSymbol})
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            placeholder="0.0"
            disabled={isDisabled || isLoading}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-ice-green-500 focus:border-ice-green-500 outline-none transition-all dark:bg-gray-700 dark:text-white ${
              errors.amount
                ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            } disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed`}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.amount}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled || isLoading}
          className="w-full bg-ice-green-600 hover:bg-ice-green-700 dark:bg-ice-green-500 dark:hover:bg-ice-green-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              Sending...
            </span>
          ) : (
            "Send Tokens"
          )}
        </button>
      </form>

      {isDisabled && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Please connect your wallet to send tokens
        </p>
      )}
    </div>
  );
}
