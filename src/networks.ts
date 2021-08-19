import { NETWORK } from './data/networks'

/**
 * Returns the chain id that maps to a provided network alias
 * @param networkAlias alias that maps to a chain id
 * @returns
 */
export const getChainIdByAlias = (networkAlias: string): number | undefined => {
  return NETWORK?.[networkAlias]
}

/**
 * Returns the network alias that maps to a provided chain id
 * @param chainId chain id that maps to a network alias
 * @returns
 */
export const getNetworkNameAliasByChainId = (chainId: number): string | undefined => {
  const networkKeys = Object.keys(NETWORK)
  const networkAlias = networkKeys.find((networkKey) => NETWORK[networkKey] === chainId)

  if (typeof networkAlias === 'undefined') {
    return undefined
  }

  return networkAlias
}

/**
 * Returns a formatted name to display in the UI based on the chain id provided
 * @param chainId
 * @returns
 */
export const getNetworkNiceNameByChainId = (chainId: number): string => {
  switch (Number(chainId)) {
    case NETWORK.mainnet: {
      return 'Ethereum'
    }
    case NETWORK.matic: {
      return 'Polygon'
    }
    case NETWORK.bsc: {
      return 'Binance Smart Chain'
    }
    case NETWORK.xdai: {
      return 'xDai'
    }
    default: {
      const niceName = getNetworkNameAliasByChainId(chainId)
      return niceName ? niceName.charAt(0).toUpperCase() + niceName.slice(1) : '--'
    }
  }
}

/**
 * Returns the alias with any special cases for renamed networks, etc
 * @param {Number} chainId
 * @returns {String} network name alias
 */
export const chainIdToNetworkName = (chainId) => {
  if (chainId === 137) {
    return 'polygon'
  }

  return getNetworkNameAliasByChainId(chainId)
}
