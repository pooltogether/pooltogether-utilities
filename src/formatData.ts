import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import { toScaledUsdBigNumber } from './formatNumber'
import { amountMultByUsd } from './math'

/**
 * Recursively looks through an object, converting all big numbers into actual BigNumbers
 * @param {any} data json blob
 * @returns
 */
export const deserializeBigNumbers = (data: any) => {
  try {
    if (Array.isArray(data)) {
      data.forEach(deserializeBigNumbers)
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(deserializeBigNumbers)
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          if (data[key]?.type === 'BigNumber') {
            data[key] = ethers.BigNumber.from(data[key])
          } else {
            deserializeBigNumbers(data[key])
          }
        }
      })
    }
    return data
  } catch (e) {
    return data
  }
}

/**
 * Mutates a token adding token USD value if we have the USD price per token
 * @param {*} token
 */
export const addTokenTotalUsdValue = (token, tokenPriceData) => {
  const priceData = tokenPriceData[token.address]
  if (priceData) {
    token.usd = priceData.usd || 0
    token.derivedETH = priceData.derivedETH || '0'
    if (token.amountUnformatted) {
      const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, token.usd)
      token.totalValueUsd = formatUnits(usdValueUnformatted, token.decimals)
      token.totalValueUsdScaled = toScaledUsdBigNumber(token.totalValueUsd)
    }
  } else {
    token.usd = 0
    token.derivedETH = '0'
  }
}
