export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: string, decimals: number = 4): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return "0";
  return num.toFixed(decimals);
}

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    const value = BigInt(amount);
    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;

    const fractionalString = fractionalPart.toString().padStart(decimals, "0");
    const trimmedFractional = fractionalString.replace(/0+$/, "").slice(0, 4);

    if (trimmedFractional === "") {
      return integerPart.toString();
    }

    return `${integerPart}.${trimmedFractional}`;
  } catch (error) {
    return "0";
  }
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  try {
    const parts = amount.split(".");
    const integerPart = parts[0] || "0";
    const fractionalPart = (parts[1] || "").padEnd(decimals, "0").slice(0, decimals);

    const fullAmount = integerPart + fractionalPart;
    return BigInt(fullAmount);
  } catch (error) {
    return BigInt(0);
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidAmount(amount: string): boolean {
  if (!amount || amount === "") return false;
  const regex = /^\d*\.?\d+$/;
  return regex.test(amount) && parseFloat(amount) > 0;
}
