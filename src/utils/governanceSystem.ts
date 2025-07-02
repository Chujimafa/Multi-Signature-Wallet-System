
export type TxType = "routine" | "large" | "critical";


export function getTxType(
  amountEth: number,
  isOwnerChange: boolean = false,
): TxType {
  if (isOwnerChange || amountEth > 100) return "critical";
  if (amountEth >= 10) return "large";
  return "routine";
}


export function getThreshold(type: TxType): number {
  if (type === "routine") return 2;
  if (type === "large") return 3;
  return 4; // "critical"
}


export function getThresholdForTx(
  amountEth: number,
  isOwnerChange = false,
): number {
  const type = getTxType(amountEth, isOwnerChange);
  return getThreshold(type);
}