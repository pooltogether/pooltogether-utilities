/**
 * Constant for chain ids
 */
export const NETWORK = Object.freeze({
  'mainnet': 1,
  'homestead': 1,
  'ropsten': 3,
  'rinkeby': 4,
  'goerli': 5,
  'kovan': 42,
  'bsc': 56,
  'poa-sokol': 77,
  'bsc-testnet': 97,
  'poa': 99,
  'xdai': 100,
  'matic': 137,
  'polygon': 137,
  'mumbai': 80001
})

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
    default: {
      const niceName = getNetworkNameAliasByChainId(chainId)
      return niceName ? niceName.charAt(0).toUpperCase() + niceName.slice(1) : '--'
    }
  }
}
