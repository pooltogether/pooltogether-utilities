import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

/**
 * All values are unformatted (contain decimal padding)
 * @param underlyingAmount the amount to convert to shares
 * @param pricePerShare the conversion rate
 * @param decimals the decimals used for the pod
 * @returns share amount
 */
export const underlyingAmountToSharesAmount = (
  underlyingAmount: BigNumber,
  pricePerShare: BigNumber,
  decimals: string = '18'
): BigNumber => {
  return underlyingAmount.mul(parseUnits('1', decimals)).div(pricePerShare)
}

/**
 * All values are unformatted (contain decimal padding)
 * @param sharesAmount the amount to convert to underlying tokens
 * @param pricePerShare the conversion rate
 * @param decimals the decimals used for the pod
 * @returns underlying amount
 */
export const sharesAmountToUnderlyingAmount = (
  sharesAmount: BigNumber,
  pricePerShare: BigNumber,
  decimals: string = '18'
): BigNumber => {
  return sharesAmount.mul(pricePerShare).div(parseUnits('1', decimals))
}
