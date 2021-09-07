import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

/**
 *
 * @param underlyingAmount
 * @param sharesTotalSupply
 * @param podUnderlyingTokenTotalBalance
 * @returns
 */
export const underlyingAmountToSharesAmount = (
  underlyingAmount: BigNumber,
  sharesTotalSupply: BigNumber,
  podUnderlyingTokenTotalBalance: BigNumber
): BigNumber => {
  if (podUnderlyingTokenTotalBalance.isZero()) {
    return undefined
  }
  return underlyingAmount.mul(sharesTotalSupply).div(podUnderlyingTokenTotalBalance)
}

/**
 *
 * @param sharesAmount
 * @param sharesTotalSupply
 * @param podUnderlyingTokenTotalBalance
 * @returns
 */
export const sharesAmountToUnderlyingAmount = (
  sharesAmount: BigNumber,
  sharesTotalSupply: BigNumber,
  podUnderlyingTokenTotalBalance: BigNumber
): BigNumber => {
  if (sharesTotalSupply.isZero()) {
    return undefined
  }
  return sharesAmount.mul(podUnderlyingTokenTotalBalance).div(sharesTotalSupply)
}
