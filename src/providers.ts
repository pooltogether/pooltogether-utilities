import {
  AlchemyProvider,
  EtherscanProvider,
  InfuraProvider,
  JsonRpcProvider,
  Provider
} from '@ethersproject/providers'
import { getChain } from '@pooltogether/evm-chains-extended'

const ALCHEMY_CHAIN_IDS = Object.freeze([
  // Ethereum
  1,
  3,
  4,
  5,
  42,
  // Polygon
  137,
  80001,
  // Optimism
  10,
  69,
  // Arbitrum
  42161,
  421611
])
const ETHERSCAN_CHAIN_IDS = Object.freeze([
  // Ethereum
  1,
  3,
  4,
  5,
  42
])
const INFURA_CHAIN_IDS = Object.freeze([
  // Ethereum
  1,
  3,
  4,
  5,
  42,
  // Polygon
  137,
  80001,
  // Optimism
  10,
  69,
  // Arbitrum
  42161,
  421611
])

export interface ApiKeys {
  alchemy: string
  etherscan: string
  infura: string | { projectId: string; projectSecret: string }
}

const API_KEYS: ApiKeys = {
  alchemy: undefined,
  etherscan: undefined,
  infura: undefined
}

/**
 * Initializes the store of API keys for different providers.
 * @param apiKeys
 */
export const initProviderApiKeys = (apiKeys: ApiKeys) => {
  API_KEYS.alchemy = apiKeys.alchemy
  API_KEYS.etherscan = apiKeys.etherscan
  API_KEYS.infura = apiKeys.infura
}

/**
 * Creates a provider for the given chain id if available.
 * Attempts to use any initialized api keys for RPC providers first.
 * @param chainId
 * @returns
 */
export const getReadProvider = (chainId: number): Provider => {
  const chainData = getChain(chainId)
  let provider: Provider
  try {
    if (API_KEYS.alchemy && ALCHEMY_CHAIN_IDS.includes(chainId)) {
      provider = new AlchemyProvider(chainId, API_KEYS.alchemy)
    } else if (API_KEYS.infura && INFURA_CHAIN_IDS.includes(chainId)) {
      provider = new InfuraProvider(chainId, API_KEYS.infura)
    } else if (API_KEYS.etherscan && ETHERSCAN_CHAIN_IDS.includes(chainId)) {
      provider = new EtherscanProvider(chainId, API_KEYS.etherscan)
    } else if (!!chainData && !!chainData.rpc[0]) {
      provider = new JsonRpcProvider(chainData.rpc[0], chainId)
    } else {
      console.warn(`Chain id ${chainId} not supported.`)
    }
  } catch (e) {
    console.error(e)
  }
  return provider
}
