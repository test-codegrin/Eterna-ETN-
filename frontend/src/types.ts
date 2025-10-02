export interface WalletState {
  address: string | null;
  balance: string;
  tokenBalance: string;
  isConnected: boolean;
  chainId: number | null;
}

export interface TransactionStatus {
  hash: string;
  status: "pending" | "success" | "failed";
  message: string;
}

export interface TransferEvent {
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  transactionHash: string;
  timestamp?: number;
}

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}
