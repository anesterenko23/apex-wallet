const DECIMAL_PATTERN = /^\d+(?:\.\d+)?$/;

export function parseUnits(input: string, decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError("decimals must be a non-negative integer");
  }

  const normalized = input.trim();
  if (!DECIMAL_PATTERN.test(normalized)) {
    throw new Error("amount must be a positive decimal value");
  }

  const [whole = "0", fraction = ""] = normalized.split(".");
  if (fraction.length > decimals) {
    throw new Error(`amount exceeds ${decimals} decimal places`);
  }

  const paddedFraction = fraction.padEnd(decimals, "0");
  const base = 10n ** BigInt(decimals);
  return BigInt(whole) * base + BigInt(paddedFraction || "0");
}

export function formatUnits(value: bigint, decimals: number): string {
  if (value < 0n) throw new RangeError("value must be non-negative");
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError("decimals must be a non-negative integer");
  }

  if (decimals === 0) return value.toString();

  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = (value % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
