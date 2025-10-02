export const config = {
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || "0xe15c27466253bc066f60e4f97bbb3dae995cc66f",
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || "11155111"),
  rpcUrl: import.meta.env.VITE_RPC_URL || "https://rpc.sepolia.org",
  explorerUrl: import.meta.env.VITE_EXPLORER_URL || "https://sepolia.etherscan.io",
  explorerName: import.meta.env.VITE_EXPLORER_NAME || "Etherscan",
  networkName: import.meta.env.VITE_NETWORK_NAME || "Sepolia Testnet",
  nativeCurrency: {
    name: import.meta.env.VITE_NATIVE_CURRENCY_NAME || "ETH",
    symbol: import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL || "ETH",
    decimals: 18,
  },
};

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];
