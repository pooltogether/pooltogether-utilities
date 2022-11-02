import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { ethers } from 'ethers'
import { FormatNumberOptions } from '../types'

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

/**
 * Convert a string and decimals/unit to a BigNumber using a guarded try/catch
 * @param {String} valueString string number represtation to format
 * @param {Number|String} decimalsOrUnitName number of decimal places in parent ERC20 contract or ETH unit name
 * @returns {BigNumber|undefined} The parsed BigNumber or undefined if failed to parse
 */
export const safeParseUnits = (valueString, decimalsOrUnitName) => {
  try {
    return parseUnits(valueString, decimalsOrUnitName)
  } catch (e) {
    console.warn('could not run parseUnits on values:', valueString, decimalsOrUnitName)
    return undefined
  }
}

/**
 * Formats a number to make it legible
 * @param _amount
 * @param options
 * @returns
 */
export const formatNumberForDisplay = (
  _amount: BigNumber | string | number,
  options: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  } = { locale: 'en' }
) => {
  const { locale, hideZeroes, round, ...formatOptions } = options
  let amount: number

  if (typeof _amount === 'number') {
    amount = _amount
  } else if (typeof _amount === 'string') {
    amount = Number(_amount)
  } else if (!!_amount._isBigNumber) {
    amount = _amount.toNumber()
  }

  if (!!round) {
    amount = Math.round(amount)
  }

  return amount.toLocaleString(locale || 'en', {
    ...formatOptions,
    maximumFractionDigits: !!hideZeroes
      ? amount <= 1
        ? formatOptions.maximumFractionDigits
        : 0
      : formatOptions.maximumFractionDigits
  })
}

/**
 * Wraps formatNumberForDisplay and handles shifting decimals of a BigNumber
 * @param _amount
 * @param decimals
 * @param options
 * @returns
 */
export const formatUnformattedBigNumberForDisplay = (
  _amount: BigNumber,
  decimals: string,
  options: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  } = { locale: 'en' }
) => formatNumberForDisplay(formatUnits(_amount, decimals), options)

export enum CURRENCIES {
  USD = 'USD',
  CAD = 'CAD',
  EUR = 'EUR'
}

/**
 * Wraps formatNumberForDisplay and handles shifting decimals of a BigNumber
 * @param _amount
 * @param decimals
 * @param options
 * @returns
 */
export const formatCurrencyNumberForDisplay = (
  _amount: string | BigNumber | number,
  currency: string = 'USD',
  options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  } = { locale: 'en' }
) => formatNumberForDisplay(_amount, { ...options, style: 'currency', currency })

const EMPTY_AMOUNT = {
  amount: '',
  amountUnformatted: undefined,
  amountPretty: '',
  decimals: ''
}

/**
 * Accepts a number and returns several useful variations of that number
 * TODO: Remove the empty amount and return null. It's a hacky fallback so you don't need to check if data has been fetched when formatting.
 * @param amount
 * @param decimals
 * @param options
 * @returns
 */
export const getAmount = (
  _amount: number | string | BigNumber,
  decimals: string,
  options: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  } = { locale: 'en' }
): {
  amount: string
  amountUnformatted: BigNumber
  amountPretty: string
  decimals: string
} => {
  try {
    if (!_amount || _amount === undefined || !decimals || decimals === undefined) {
      return EMPTY_AMOUNT
    }

    if (typeof _amount === 'string') {
      return {
        amount: _amount,
        amountUnformatted: ethers.utils.parseUnits(_amount, decimals),
        amountPretty: formatNumberForDisplay(_amount, options),
        decimals
      }
    } else if (typeof _amount === 'number') {
      return {
        amount: _amount.toString(),
        amountUnformatted: ethers.utils.parseUnits(_amount.toString(), decimals),
        amountPretty: formatNumberForDisplay(_amount, options),
        decimals
      }
    } else if (!!_amount._isBigNumber) {
      return {
        amountUnformatted: _amount.mul(
          ethers.BigNumber.from(10).pow(ethers.BigNumber.from(decimals))
        ),
        amount: _amount.toString(),
        amountPretty: formatNumberForDisplay(_amount, options),
        decimals
      }
    } else {
      return EMPTY_AMOUNT
    }
  } catch (e) {
    console.error(e.message)
    return EMPTY_AMOUNT
  }
}

/**
 * Accepts a decimal shifted number and returns several useful variations of that number
 * @param amount
 * @param decimals
 * @param options
 * @returns
 */
export const getAmountFromUnformatted = (
  _unformattedAmount: string | BigNumber,
  decimals: string,
  options: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  } = { locale: 'en' }
): {
  amount: string
  amountUnformatted: BigNumber
  amountPretty: string
  decimals: string
} => {
  if (typeof _unformattedAmount === 'string') {
    return getAmount(
      ethers.utils.formatUnits(BigNumber.from(_unformattedAmount), decimals),
      decimals,
      options
    )
  } else if (!!_unformattedAmount._isBigNumber) {
    return getAmount(ethers.utils.formatUnits(_unformattedAmount, decimals), decimals, options)
  } else {
    return EMPTY_AMOUNT
  }
}

/**
 * Pretty up a BigNumber using it's corresponding ERC20 decimals value with the proper amount of
 * trailing decimal precision
 * @param {BigNumber|String|Number} amount number to format
 * @param {Object} options
 * @param {Number} options.decimals  precision to use when converting from BigNumber to string
 * @param {Number} options.precision ignore determining how many decimals to display and use the num passed in
 * example: a BigNumber value of 123456 for WBTC which has 8 decimals of precision
 *          would be formatted as: 0.00123456
 */
export const numberWithCommas = (
  amount,
  options: {
    decimals?: string | number
    precision?: number
    currentLang?: string
    removeTrailingZeros?: boolean
  } = {}
) => {
  if (!options.decimals) {
    options.decimals = 18
  }

  if (amount === undefined || amount === null) {
    return undefined
  }

  const amountFormatted = amount._isBigNumber
    ? ethers.utils.formatUnits(amount, options.decimals)
    : amount

  if (!options.precision && options.precision !== 0 && amountFormatted) {
    options.precision = getPrecision(amountFormatted)
  }

  return _formatCommas(amountFormatted, options)
}

function _formatCommas(
  str,
  options: {
    precision?: number
    currentLang?: string
    removeTrailingZeros?: boolean
  } = {}
) {
  let precision = 2
  if (options.precision !== undefined) {
    precision = options.precision
  }

  let localeString = 'en-GB'
  if (options.currentLang && options.currentLang === 'es') {
    localeString = 'es-ES'
  }

  // auto-round to the nearest whole number
  if (precision === 0) {
    str = Math.floor(Number(str))
  }

  if (precision === 2) {
    // Properly round
    // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    str = Math.round((parseFloat(str) + Number.EPSILON) * 100) / 100
  }

  // handle exponents
  if (str.toString().match('e')) {
    str = Number.parseFloat(str).toFixed(0)
  }

  let parts = str.toString().split('.')
  parts[0] = parts[0].replace(',', '')

  let numberStr = ''

  if (parts.length > 1 && precision > 0) {
    numberStr = stringWithPrecision(parts.join('.'), { precision })
  } else {
    numberStr = parts[0]
  }

  if (options.removeTrailingZeros) {
    numberStr = numberStr.replace(/(\.0+|0+)$/, '')
  }

  return Number(numberStr).toLocaleString(localeString, {
    minimumFractionDigits: options.removeTrailingZeros ? 0 : precision
  })
}

/**
 * Returns a standardized decimal precision depending on the number
 * @param {*} num number to check
 */
export const getPrecision = (num) => {
  num = parseFloat(num)

  if (num > 10000) {
    return 0
  } else if (num >= 0.1) {
    return 2
  } else {
    return getMinPrecision(num)
  }
}

/**
 * Returns the number of digits after a decimal place
 * @param {*} num number to check
 */
export const getMaxPrecision = (num) => {
  return String(num).split('.')[1]?.length || 0
}

/**
 * Counts the number of 0's past a decimal in a number and returns how many significant digits to keep
 * plus additional digits so we always show a non-zero number.
 * @param {*} num number to check
 * @param {*} options
 *    additionalDigits: Optional additional digits to keep past the first non-zero number
 */
export const getMinPrecision = (num, options = { additionalDigits: 2 }) => {
  const { additionalDigits } = options
  const decimals = String(num).split('.')[1]

  if (decimals === '0') return 0
  if (!decimals) return additionalDigits
  return decimals.match(/^0*/)[0].length + additionalDigits
}

/**
 * Returns a human readable version of a BigNumber w/ decimals
 * @param BigNumber amount
 * @param string decimals
 */
export const prettyNumber = (amount: BigNumber, decimals: string): string =>
  numberWithCommas(amount, { decimals }) as string
