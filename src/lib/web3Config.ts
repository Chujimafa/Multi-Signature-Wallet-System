import {
  useActiveWallet,
  useActiveAccount,
  useActiveWalletChain,
} from "thirdweb/react";
import { createThirdwebClient} from "thirdweb";
import { EIP1193 } from "thirdweb/wallets";
import { ethers } from "ethers";


export function useThirdwebConfig() {
  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  });

  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const wallet = useActiveWallet();

  const rawprovider = wallet && chain
    ? EIP1193.toProvider({ wallet, chain, client })
    : undefined;

  const provider = rawprovider
    ? new ethers.providers.Web3Provider(rawprovider)
    : undefined;

const signer = provider?.getSigner();


  return {
    account,
    chain,
    wallet,
    client,
    rawprovider,
    provider,
    signer
  };
}