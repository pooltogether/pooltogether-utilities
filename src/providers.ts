import {
  AlchemyProvider,
  EtherscanProvider,
  InfuraProvider,
  JsonRpcProvider,
  Provider
} from '@ethersproject/providers'
import { getNetwork } from '@ethersproject/networks'
import { getChain } from '@pooltogether/evm-chains-extended'
import { NETWORK } from './data/networks'

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

/**
 * Creates several providers for the given chain ids if available.
 * Attempts to use any initialized api keys for RPC providers first.
 * @param chainIds
 * @returns an object of providers keyed by chain id
 */
export const getReadProviders = (chainIds: number[]): { [chainId: number]: Provider } => {
  const readProviders: { [chainId: number]: Provider } = {}
  chainIds.forEach((chainId) => {
    const provider = getReadProvider(chainId)
    if (provider) {
      readProviders[chainId] = provider
    }
  })
  return readProviders
}

/**
 * Returns an RPC URL using configured API keys if possible.
 * @param chainId
 */
export const getRpcUrl = (chainId: number, apiKeys?: ApiKeys): string => {
  const alchemyApiKey = API_KEYS.alchemy || apiKeys?.alchemy
  const infuraApiKey = API_KEYS.infura || apiKeys?.infura

  try {
    if (!!alchemyApiKey && ALCHEMY_CHAIN_IDS.includes(chainId)) {
      const connectionInfo = AlchemyProvider.getUrl(getNetwork(chainId), alchemyApiKey)
      return connectionInfo.url
    } else if (!!infuraApiKey && INFURA_CHAIN_IDS.includes(chainId)) {
      const connectionInfo = InfuraProvider.getUrl(
        getNetwork(chainId),
        typeof infuraApiKey === 'string' ? { projectId: infuraApiKey } : infuraApiKey
      )
      return connectionInfo.url
    }

    const chainData = getChain(chainId)
    const rpcUrl = chainData?.rpc?.[0]

    if (!!rpcUrl) {
      return rpcUrl
    } else {
      console.warn(`getRpcUrl | Chain id ${chainId} not supported.`)
      const chainData = getChain(NETWORK.mainnet)
      return chainData.rpc[0]
    }
  } catch (e) {
    console.error(e)
    const chainData = getChain(NETWORK.mainnet)
    return chainData.rpc[0]
  }
}

/**
 * Returns multiple RPC URLS using configured API keys if possible.
 * @param chainIds
 * @returns
 */
export const getRpcUrls = (
  chainIds: number[],
  apiKeys?: ApiKeys
): { [chainId: number]: string } => {
  return chainIds.reduce((rpcUrls, chainId) => {
    rpcUrls[chainId] = getRpcUrl(chainId, apiKeys)
    return rpcUrls
  }, {})
}
