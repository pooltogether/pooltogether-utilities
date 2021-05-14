import { PRIZE_POOL_TYPES } from '@pooltogether/current-pool-data'

import {
  REACT_SELECT_GROUPED_OPTIONS,
  KNOWN_YIELD_SOURCE_CONTRACT_ADDRESSES,
  YIELD_SOURCE_NAMES,
  OPTIONS
} from './data/knownYieldSources'
import { KnownYieldSourceContract } from './types'
import { isValidAddress } from './address'

export const reactSelectGroupedOptions = REACT_SELECT_GROUPED_OPTIONS

/**
 * Returns info about known Yield Source contract addresses based on a provided address
 * @param chainId number
 * @param address string
 * @returns KnownYieldSourceContract
 */
export const getKnownYieldSourceContract = (
  chainId: number,
  address: string
): KnownYieldSourceContract | undefined => {
  if (!chainId || !address) {
    throw new Error('Must pass in both a chainId and contract address')
  }

  if (!isValidAddress(address)) {
    throw new Error('invalid Ethereum address')
  }

  const sanitizedAddress = address.toLowerCase()

  const contract: KnownYieldSourceContract = {
    yieldSourceName: getYieldSourceName(chainId, sanitizedAddress)
  }

  if (!contract.yieldSourceName) {
    return
  }

  contract.type =
    contract.yieldSourceName === YIELD_SOURCE_NAMES.aave
      ? PRIZE_POOL_TYPES.genericYield
      : PRIZE_POOL_TYPES.compound

  const yieldSourceName = contract.yieldSourceName.replace(' ', '').toLowerCase()
  contract.option = OPTIONS[yieldSourceName][chainId].find(
    (object) => object.value.toLowerCase() === sanitizedAddress
  )

  return contract
}

/**
 * Gets the name of the yield source if the chainId and address match
 * @param chainId number
 * @param address string
 * @returns string
 */
export const getYieldSourceName = (chainId: number, address: string): string => {
  let yieldSourceName

  const { compoundCTokens, aaveGeneric, rariFuseCTokens, creamCTokens } =
    KNOWN_YIELD_SOURCE_CONTRACT_ADDRESSES

  const isCompound = Boolean(compoundCTokens[chainId]?.find((value) => address === value))
  if (isCompound) {
    yieldSourceName = YIELD_SOURCE_NAMES.compound
  }

  const isAave = Boolean(aaveGeneric[chainId]?.find((value) => address === value))
  if (isAave) {
    yieldSourceName = YIELD_SOURCE_NAMES.aave
  }

  const isRariFuse = Boolean(rariFuseCTokens[chainId]?.find((value) => address === value))
  if (isRariFuse) {
    yieldSourceName = YIELD_SOURCE_NAMES.rariFuse
  }

  const isCream = Boolean(creamCTokens[chainId]?.find((value) => address === value))
  if (isCream) {
    yieldSourceName = YIELD_SOURCE_NAMES.cream
  }

  return yieldSourceName
}
