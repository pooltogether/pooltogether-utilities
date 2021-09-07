import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

const CONSTANT_ROUNDING = parseUnits('1', 18)

/**
 * Since pod shares don't map 1:1 to the underlying tokens, we need to calculate
 * the amount of pod shares based on the amount of underlying tokens requested
 * and the current conversion rate.
 *
 * Ex. Withdrawing pod tokens. We show the user has 101 underlying tokens,
 * but they really have 100 shares which is worth 101 underlying tokens. If
 * the user wants to withdraw 101 underlying tokens, we need to convert that
 * amount into shares.
 *
 * @param underlyingTokenAmount the amount to convert to shares
 * @param usersTicketBalance the users pod balance
 * @param usersTicketUnderlyingBalance the amount of underlying tokens
 * usersTicketBalance is worth
 * @returns share amount
 */
export const calculateShareAmountFromUnderlyingTokenAmount = (
  underlyingTokenAmount: BigNumber,
  usersTicketBalance: BigNumber,
  usersTicketUnderlyingBalance: BigNumber
): BigNumber => {
  const userSharesToUnderlyingPercentage = usersTicketBalance
    .mul(CONSTANT_ROUNDING)
    .div(usersTicketUnderlyingBalance)
  const shareAmount = underlyingTokenAmount
    .mul(userSharesToUnderlyingPercentage)
    .div(CONSTANT_ROUNDING)
  return shareAmount
}
