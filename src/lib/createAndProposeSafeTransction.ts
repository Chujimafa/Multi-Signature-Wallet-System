"use client";

import SafeApiKit from '@safe-global/api-kit'
import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData, OperationType } from "@safe-global/types-kit";
import { useThirdwebConfig } from "./web3Config";
import { ethers } from "ethers";
import {getSafeTxServiceUrl} from "@/utils/getTxServiceUrl"

export function CreateAndProposeSafeTransaction(safeAddress: string) {
 const {
    account,
    chain,
    rawprovider,
    provider,
    signer
  } = useThirdwebConfig();

  const deploySafe = async (safeAddress: string) => {
      if (!chain || !account)
        throw new Error("Wallet not connected or missing chain info");
  
     
      const protocolKit = await Safe.init({
        provider:rawprovider!,
        signer:account.address,
        safeAddress,
      });
  
      return protocolKit;
    };
  

  const createProposedTransaction = async (to: string, amountEth: number) => {
    const safe = await deploySafe(safeAddress);
        if (!chain?.id)
      throw new Error(
        "Chain is not ready yet, please connect wallet/network first.",
      );

    
    const txServiceUrl = getSafeTxServiceUrl(chain.id);

    const apiKit = new SafeApiKit({
     chainId: BigInt(chain.id),
     txServiceUrl
    })

    const transactions: MetaTransactionData[] = [
      {
        to,
        value: ethers.utils
        .parseEther(amountEth.toString())
        .toString(),
        data: "0x",
        operation: OperationType.Call,
      },
    ];



    const safeTransaction = await safe.createTransaction({
      transactions,
    });

     const safeTxHash = await safe.getTransactionHash(safeTransaction);

     const signature = await signer!.signMessage(safeTxHash);

await apiKit.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: account!.address,
    senderSignature: signature,
})  

return { safeTransaction, safeTxHash };
  };

 return { createProposedTransaction };
}


// // 2. Genehmigen (durch andere Owner)
// await approveTransaction({
//   transactionId: tx.id,
//   approver: ownerAddress,
// });

// // 3. Ausführen (wenn genug Genehmigungen)
// if (tx.approvals.length >= tx.threshold) {
//   await executeTransaction({
//     transactionId: tx.id,
//   });
// }