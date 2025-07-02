import Safe from "@safe-global/protocol-kit";
import { ethers } from "ethers";



export async function RelayMetaTxToSafe(
  safeAddress: string,
  metaTx: any,
  provider: any,
) {

  const safeSdk = await Safe.init({
    provider,
    safeAddress,
  });

  const txData = {
    to: metaTx.to,
    data: metaTx.data,
   value: (typeof metaTx.value === "bigint" || typeof metaTx.value === "number")
  ? metaTx.value.toString()
  : "0",
    operation: typeof metaTx.operation === "number" && [0, 1].includes(metaTx.operation)
        ? metaTx.operation : 0,
  };
 console.log("txData:",txData);

  const safeTx = await safeSdk.createTransaction({
    transactions: [txData],
  });
 
  await safeSdk.signTransaction(safeTx);

  await safeSdk.executeTransaction(safeTx);

  return safeTx;
}
