import React, { useState } from "react";
import { useThirdwebConfig } from "@/lib/web3Config";
import {
  AddGuardians,
  recovery,
} from "@/lib/recoveryModule";
import { RelayMetaTxToSafe } from "@/lib/relayMetaTxToSafe";
import "@/styles/componentsStyle.css"; 

export default function SocialRecoverySystem() {
  const { rawprovider, provider, signer} = useThirdwebConfig();
  const [safeAddress, setSafeAddress] = useState("");
  const [ownerThreshold, setOwnerThreshold] = useState(1);
  const [guardianAddress, setGuardianAddress] =useState("");
  const [addGuardianStatus, setAddGuardianStatus] =useState("");

  const [recoverySafeAddress, setRecoverySafeAddress] =useState("");
  const [recoveryNewOwner, setRecoveryNewOwner] =useState("");
  const [recoveryThreshold, setRecoveryThreshold] =useState(1);
  const [recoveryStatus, setRecoveryStatus] = useState("");
  const [recoveryStartTs, setRecoveryStartTs] = useState<number | null>(null);

  // Section 1: Add Guardian as Safe owner
  const handleAddGuardian = async () => {

    setAddGuardianStatus("");
    if (!safeAddress || !guardianAddress) {
      setAddGuardianStatus(
        "Safe address and guardian address are required.",
      );
      return;
    }
    try {
      setAddGuardianStatus(
        "Submitting onchain transaction...",
      );
      await AddGuardians(
        safeAddress,
        BigInt(ownerThreshold),
        guardianAddress,
        rawprovider,
      );
      setAddGuardianStatus(
        "Guardian successfully added to Safe.",
      );
    } catch (e: any) {
      setAddGuardianStatus("Error: " + (e?.message || e));
    }
  };

  // Section 2: Social Recovery (by guardian)
  const handleInitiateRecovery = async () => {
    setRecoveryStatus("");
    if (!recoverySafeAddress || !recoveryNewOwner) {
      setRecoveryStatus(
        "Safe address and new owner address are required.",
      );
      return;
    }
    try {
      setRecoveryStatus("Initiating recovery process...");
      await recovery(
        recoverySafeAddress,
        [recoveryNewOwner],
        recoveryThreshold,
        rawprovider,
      );
      setRecoveryStatus(
        "Recovery initiated. Wait 7 days, then finalize.",
      );
      setRecoveryStartTs(Date.now());
    } catch (e: any) {
      setRecoveryStatus("Error: " + (e?.message || e));
    }
  };

  const handleFinalizeRecovery = async () => {
    try {
      setRecoveryStatus("Finalizing recovery...");
      const srm = new (
        await import("abstractionkit")
      ).SocialRecoveryModule();
      const finalizeMetaTx =
        srm.createFinalizeRecoveryMetaTransaction(
          recoverySafeAddress,
        );
      await RelayMetaTxToSafe(
        recoverySafeAddress,
        finalizeMetaTx,
        rawprovider,
      );
      setRecoveryStatus(
        "Recovery finalized. Ownership transferred to the new owner.",
      );
    } catch (e: any) {
      setRecoveryStatus(
        "Finalize error: " + (e?.message || e),
      );
    }
  };

  // Timelock calculation (for 7 days after initiation)
  let remainingDays = 0;
  if (recoveryStartTs) {
    const now = Date.now();
    const msPassed = now - recoveryStartTs;
    const msLeft = Math.max(
      0,
      7 * 24 * 60 * 60 * 1000 - msPassed,
    );
    remainingDays = Math.ceil(
      msLeft / (24 * 60 * 60 * 1000),
    );
  }

 return (
    <div className="container">
      <h2 className="title">Social Recovery System</h2>

      <div className="section">
        <h3 className="section-title">Add Guardian</h3>
        <div className="input-group">
          <label className="label">Safe Wallet Address</label>
          <input
            className="input"
            value={safeAddress}
            onChange={(e) => setSafeAddress(e.target.value)}
            placeholder="e.g. 0x..."
          />
        </div>
        <div className="input-group">
          <label className="label">Owner Signature Threshold</label>
          <input
            type="number"
            min={1}
            step={1}
            value={ownerThreshold}
            onChange={(e) => setOwnerThreshold(Number(e.target.value))}
            className="input"
          />
        </div>
        <div className="input-group">
          <label className="label">Guardian Address to Add</label>
          <input
            className="input"
            value={guardianAddress}
            onChange={(e) => setGuardianAddress(e.target.value)}
            placeholder="e.g. 0x..."
          />
        </div>
        <button
          onClick={handleAddGuardian}
          className="primary-button"
        >
          Add Guardian
        </button>
        <div className={`status ${addGuardianStatus.includes("success") ? "status-success" : "status-info"}`}>
          {addGuardianStatus}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Recovery Wallet</h3>
        <div className="input-group">
          <label className="label">Safe Wallet Address for Recovery</label>
          <input
            className="input"
            value={recoverySafeAddress}
            onChange={(e) => setRecoverySafeAddress(e.target.value)}
            placeholder="e.g. 0x..."
          />
        </div>
        <div className="input-group">
          <label className="label">New Owner Address (to receive control)</label>
          <input
            className="input"
            value={recoveryNewOwner}
            onChange={(e) => setRecoveryNewOwner(e.target.value)}
            placeholder="e.g. 0x..."
          />
        </div>
        <div className="input-group">
          <label className="label">New Signature Threshold after Recovery</label>
          <input
            type="number"
            min={1}
            step={1}
            value={recoveryThreshold}
            onChange={(e) => setRecoveryThreshold(Number(e.target.value))}
            className="input"
          />
        </div>
        <button
          onClick={handleInitiateRecovery}
          className="primary-button"
        >
          Initiate Recovery
        </button>
        <div className="status status-info">
          {recoveryStatus}
        </div>
        {recoveryStartTs && (
          <div className="info-text">
            {remainingDays > 0 ? (
              `Approximately ${remainingDays} days remaining before finalize is possible.`
            ) : (
              <button 
                onClick={handleFinalizeRecovery}
                className="button"
              >
                Finalize Recovery (after 7 days)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="info-text">
        <strong>Info:</strong>
        <br />
        – All sensitive parameters (Safe address, guardian, new owner, threshold) are user-provided.
        <br />
        – The 7 day finalize process must be triggered manually; this UI just provides guidance.
        <br />
        – You can verify all transaction history and Safe state changes from the Safe web interface.
      </div>
    </div>
  );
}
