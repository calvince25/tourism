export function formatTourPrice(
  priceUsd: number | null | undefined,
  priceKes: number | null | undefined
): string | null {
  if (typeof priceUsd === "number" && Number.isFinite(priceUsd) && priceUsd > 0) {
    return `$${priceUsd.toLocaleString("en-US")}`;
  }

  if (typeof priceKes === "number" && Number.isFinite(priceKes) && priceKes > 0) {
    return `KES ${priceKes.toLocaleString("en-US")}`;
  }

  return null;
}
