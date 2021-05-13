import { KNOWN_YIELD_SOURCE_CONTRACT_ADDRESSES } from './data/knownYieldSourceContractsAddresses'

import { KnownYieldSourceContract } from './types'

/**
 * Returns info about known Yield Source contract addresses based on a provided address
 * @param address
 * @returns KnownYieldSourceContract
 */
export const getKnownYieldSourceContract = (address: string): KnownYieldSourceContract => {
  let knownContract: KnownYieldSourceContract

  KNOWN_YIELD_SOURCE_CONTRACT_ADDRESSES
  // compoundYieldSourceAddresses,
  //   aaveAsGenericYieldSourceAddresses,
  //   rariFuseYieldSourceAddresses,
  //   creamYieldSourceAddresses,
  //   groupedOptions

  return knownContract
}
