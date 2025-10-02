export const config = {
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || "97"),
  rpcUrl: import.meta.env.VITE_BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/",
  explorerUrl: import.meta.env.VITE_EXPLORER_URL || "https://testnet.bscscan.com",
  networkName: "BSC Testnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
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
