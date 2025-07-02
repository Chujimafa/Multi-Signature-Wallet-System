"use client";
import { useState, useEffect } from "react";
import Safe from "@safe-global/protocol-kit";
import {useThirdwebConfig} from "@/lib/web3Config";
import "@/styles/componentsStyle.css"; 


export default function CreateWallet() {

    const {account,chain,rawprovider,provider,signer} = useThirdwebConfig();

  const [threshold, setThreshold] = useState(1);
  const [safeAddress, setSafeAddress] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owners, setOwners] = useState<string[]>([]);

  useEffect(() => {
    if (
      account?.address &&
      (owners.length === 0 || owners[0] !== account.address)
    ) {
      setOwners([account.address]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  const addOwner = () => setOwners([...owners, ""]);
  const updateOwner = (index: number, value: string) => {
    const updated = [...owners];
    updated[index] = value;
    setOwners(updated);
  };

  const handleCreateSafe = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!provider || !signer) {
        setError(
          "Wallet/provider not ready. Please connect your wallet.",
        );
        setLoading(false);
        return;
      }
      if (!owners.length || owners.some((o) => !o)) {
        setError("All owner addresses required");
        setLoading(false);
        return;
      }
      if (threshold < 1 || threshold > owners.length) {
        setError(
          "Threshold must be between 1 and owner count",
        );
        setLoading(false);
        return;
      }
      const safeAccountConfig = { owners, threshold };
      const predictedSafe = { safeAccountConfig };
      const safe = await Safe.init({
        provider:rawprovider!,
        predictedSafe,
      });
      const deploymentTx =
        await safe.createSafeDeploymentTransaction();
      const txResponse = await signer.sendTransaction({
        to: deploymentTx.to,
        value: deploymentTx.value ? deploymentTx.value : 0,
        data: deploymentTx.data,
      });
      await txResponse.wait();
      const address = await safe.getAddress();
      setSafeAddress(address);
    } catch (err: any) {
      setError(err?.message || "Safe creation error");
    }
    setLoading(false);
  };

   return (
    <div className="container">
      <h2 className="title">Create Multi-Signature Safe</h2>
      
      <div className="section">
        <div className="input-group">
          <label className="label">Threshold (required signatures)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[1-9][0-9]*"
            value={threshold > 0 ? threshold.toString() : ""}
            onChange={(e) => {
              let v = e.target.value.replace(/^0+/, "");
              if (v === "") {
                setThreshold(0);
              } else if (/^[1-9][0-9]*$/.test(v)) {
                setThreshold(parseInt(v, 10));
              }
            }}
            disabled={loading}
            placeholder="1"
            autoComplete="off"
            className="input"
          />
        </div>

        <div className="input-group">
          <h3 className="section-title">Owners</h3>
          {account?.address && (
            <input
              type="text"
              value={account.address}
              readOnly
              className="input"
              style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
            />
          )}
          {owners.slice(1).map((owner, idx) => (
            <input
              key={idx + 1}
              type="text"
              placeholder={`Owner ${idx + 2} address`}
              value={owner}
              onChange={(e) => updateOwner(idx + 1, e.target.value)}
              disabled={loading}
              className="input"
              style={{ marginBottom: "8px" }}
            />
          ))}
          <button 
            onClick={addOwner} 
            disabled={loading}
            className="secondary-button"
            style={{ marginTop: "8px" }}
          >
            + Add Owner
          </button>
        </div>

        <button
          onClick={handleCreateSafe}
          disabled={loading}
          className="primary-button"
        >
          {loading ? "Deploying..." : "Deploy Safe"}
        </button>

        {safeAddress && (
          <div className="status status-success">
            Safe deployed at: <strong>{safeAddress}</strong>
          </div>
        )}

        {error && (
          <div className="status status-error">{error}</div>
        )}
      </div>

      <div className="info-text">
        Network: {chain ? chain.name || `Chain ID: ${chain.id}` : "Not connected"}
      </div>
    </div>
  );
}
