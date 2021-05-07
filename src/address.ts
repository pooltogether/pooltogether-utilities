import { ethers } from 'ethers'

/**
 * isValidAddress tests an address to see if it's a valid ETH address, but doesn't
 * care if it's checksummed or not
 * @param {string} address
 * @returns a Boolean
 */
export const isValidAddress = (address) => {
  if (!address) return

  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    console.error(e)

    if (e.message.match('invalid address')) {
      return false
    }
  }
  return true
}
