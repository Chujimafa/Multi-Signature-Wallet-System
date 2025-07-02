export function getSafeTxServiceUrl(
  chainId: number,
): string {
  switch (chainId) {
    case 1:
      return "https://safe-transaction-mainnet.safe.global";
    case 5:
      return "https://safe-transaction-goerli.safe.global";
    case 11155111:
      return "https://safe-transaction-sepolia.safe.global";
    case 137:
      return "https://safe-transaction-polygon.safe.global";
    case 80001:
      return "https://safe-transaction-mumbai.safe.global";
    case 42161:
      return "https://safe-transaction-arbitrum.safe.global";
    case 421613:
      return "https://safe-transaction-arbitrum-goerli.safe.global";
    case 421614:
      return "https://safe-transaction-arbitrum-sepolia.safe.global";
    case 10:
      return "https://safe-transaction-optimism.safe.global";
    case 420:
      return "https://safe-transaction-optimism-goerli.safe.global";
    case 11155420:
      return "https://safe-transaction-optimism-sepolia.safe.global";
    case 8453:
      return "https://safe-transaction-base.safe.global";
    case 84531:
      return "https://safe-transaction-base-goerli.safe.global";
    case 100:
      return "https://safe-transaction-gnosis-chain.safe.global";
    case 10200:
      return "https://safe-transaction-chiado.safe.global";
    case 43114:
      return "https://safe-transaction-avalanche.safe.global";
    case 43113:
      return "https://safe-transaction-fuji.safe.global";
    case 56:
      return "https://safe-transaction-bnb.smartchain.safe.global";
    case 97:
      return "https://safe-transaction-bnb.smartchain-testnet.safe.global";
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
