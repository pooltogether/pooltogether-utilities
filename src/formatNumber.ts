import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { FormatNumberOptions } from './types'

/**
 * Slices a number string to the requested precision
 * @param {string} val a number string ex. "1005.2924"
 * @param {FormatNumberOptions} options
 * @returns
 */
export function stringWithPrecision(val: string, options: FormatNumberOptions = { precision: 2 }) {
  const { precision } = options
  if (val && typeof val.indexOf === 'function') {
    const extraChars = precision ? precision + 1 : 0
    return val.substr(0, val.indexOf('.') + extraChars)
  } else {
    return val
  }
}

/**
 * Converts a USD string to a scaled up big number to account for cents
 * @param {string} usd a String ex. "100.23"
 * @returns a BigNumber ex. 10023
 */
export const toScaledUsdBigNumber = (usd: string): BigNumber =>
  parseUnits(stringWithPrecision(usd, { precision: 2 }), 2)

/**
 * Converts a scaled USD BigNumber to a string
 * @param {string} usdScaled a scaled BigNumber ex. ethers.BigNumber.from("10023") (Which would be $100.23)
 * @returns a string ex. "100.23"
 */
export const toNonScaledUsdString = (usdScaled: BigNumber): string => formatUnits(usdScaled, 2)

/**
 * Returns a formatted string for a percentage
 * @param percentage
 * @returns
 */
export function displayPercentage(percentage: string) {
  percentage = parseFloat(percentage).toFixed(2)
  return percentage.toString().replace(/(\.0+$)|(0+$)/, '')
}
