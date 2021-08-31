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
  'polygon': 137,
  'matic': 137,
  'celo': 42220,
  'celo-testnet': 44787,
  'mumbai': 80001
})

/**
 * Ethereum networks
 */
export const ETHEREUM_NETWORKS = Object.freeze([
  NETWORK.mainnet,
  NETWORK.ropsten,
  NETWORK.rinkeby,
  NETWORK.goerli,
  NETWORK.kovan
])

/**
 * Polygon networks
 */
export const POLYGON_NETWORKS = Object.freeze([NETWORK.polygon, NETWORK.mumbai])
