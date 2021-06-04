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

const expression = /^(\w{6})\w*(\w{4})$/
/**
 * Shortens a hash into something a little more user friendly
 * @param hash
 * @returns
 */
export const shorten = (hash) => {
  let result

  if (!hash) {
    return null
  }

  result = expression.exec(hash)

  return `${result[1]}...${result[2]}`
}
