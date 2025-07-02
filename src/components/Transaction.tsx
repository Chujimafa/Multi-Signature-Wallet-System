import { useState } from "react";
import {
  getTxType,
  getThresholdForTx,
} from "../utils/governanceSystem";
import { GetSafeOwnersAndThreshold } from "@/lib/getOwnerSafe";
//import { CreateSafeTransaction } from "@/lib/createSafeTransaction";
import {CreateAndProposeSafeTransaction} from "@/lib/createAndProposeSafeTransction";
import "@/styles/componentsStyle.css"; 

export default function CreateTransaction() {
  const [safeAddress, setSafeAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amountEth, setAmountEth] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const isValidSafe = /^0x[a-fA-F0-9]{40}$/.test(
    safeAddress,
  );
  const isValidTo = /^0x[a-fA-F0-9]{40}$/.test(toAddress);

  const { owners = [], threshold: currentThreshold } =
    GetSafeOwnersAndThreshold(safeAddress);
  const ownerCount = owners.length;

  const txType = getTxType(parseFloat(amountEth) || 0);
  const requiredThreshold = getThresholdForTx(parseFloat(amountEth) || 0);
  const needAllSignatures = ownerCount < requiredThreshold;

  const { createProposedTransaction  } =
    CreateAndProposeSafeTransaction(safeAddress);

  const handleCreateTx = async () => {
    setTxStatus("Creating transaction...");
    try {
      const tx = await createProposedTransaction(
        toAddress,
        parseFloat(amountEth),
      );
      setTxStatus(
        "Transaction created! SafeTxHash: " +
          (tx?.safeTxHash || JSON.stringify(tx)),
      );
    } catch (err: any) {
      setTxStatus(
        "Error creating transaction: " + err.message,
      );
    }
  };

   return (
    <div className="container">
      <h3 className="title">Safe Transaction Threshold Checker</h3>
      
      <div className="section">
        <div className="input-group">
          <label className="label">Safe Wallet Address</label>
          <input
            type="text"
            className="input"
            value={safeAddress}
            onChange={(e) => setSafeAddress(e.target.value)}
            placeholder="0x..."
          />
          {!isValidSafe && safeAddress && (
            <div className="status status-error">
              Please provide a valid Safe address.
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="label">To Address</label>
          <input
            type="text"
            className="input"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Recipient 0x..."
          />
          {!isValidTo && toAddress && (
            <div className="status status-error">
              Please provide a valid recipient address.
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="label">Transfer Amount (ETH)</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d*$"
            className="input"
            value={amountEth}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d*$/.test(val)) {
                setAmountEth(val);
              }
            }}
            placeholder="e.g. 5"
          />
        </div>

        {isValidSafe && (
          <>
            <div className="info-text">
              Number of Safe owners: {ownerCount}
              <br />
              Safe contract threshold (on-chain):{" "}
              {currentThreshold !== undefined
                ? currentThreshold
                : "Loading..."}
            </div>
            <div className="info-text">
              Transaction type (by amount): {txType}
              <br />
              Governance-required signatures:{" "}
              {requiredThreshold}
            </div>
            {needAllSignatures && (
              <div className="status status-info">
                You have only {ownerCount} owners. All owners
                must sign for this transaction.
              </div>
            )}
          </>
        )}

        <button
           className="primary-button"
          disabled={
            !isValidSafe ||
            !isValidTo ||
            parseFloat(amountEth) <= 0 ||
            needAllSignatures
          }
          onClick={handleCreateTx}
        >
          Create Safe Transaction
        </button>
        <div className={`status ${txStatus.includes("Error") ? "status-error" : "status-info"}`}>
          {txStatus}
        </div>
      </div>
    </div>
  );
}
