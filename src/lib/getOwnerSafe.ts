import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: process.env
    .NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});

export function GetSafeOwnersAndThreshold(
  safeAddress: string,
) {
  const chain = useActiveWalletChain();

  // Always provide a default address and default chain so all hooks always run!
  const address = /^0x[a-fA-F0-9]{40}$/.test(safeAddress)
    ? safeAddress
    : "0x0000000000000000000000000000000000000000";

  const fallbackChain = {
    id: 1,
    rpc: "https://mainnet.infura.io/v3/INVALID",
    slug: "fallback",
    name: "Fallback",
    nativeCurrency: {
      name: "Fake",
      symbol: "FAKE",
      decimals: 18,
    },
  };

  const contract = getContract({
    client,
    address,
    chain: chain || (fallbackChain as any),
  });

  const { data: owners } = useReadContract({
    contract,
    method:
      "function getOwners() external view returns (address[])",
  });

  const { data: threshold } = useReadContract({
    contract,
    method:
      "function getThreshold() external view returns (uint256)",
  });


  const isValid =/^0x[a-fA-F0-9]{40}$/.test(safeAddress) && !!chain;

  return isValid ? { owners, threshold } : { owners: [], threshold: undefined };
}
