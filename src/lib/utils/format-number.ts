
export const formatCompactNumber = (
  value: number | string,
  options?: {
    decimals?: number;
    currency?: string;
  }
): string => {
  const { decimals = 1, currency = "" } = options || {};

  const number =
    typeof value === "string"
      ? Number(value.replace(/,/g, ""))
      : value;

  if (!Number.isFinite(number)) {
    return `${currency}0`;
  }

  const abs = Math.abs(number);

  const units = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const formatted = (number / unit.value)
        .toFixed(decimals)
        .replace(/\.0$/, "");

      return `${currency}${formatted}${unit.suffix}`;
    }
  }

  return `${currency}${number}`;
};