import { BigNumber, ethers } from 'ethers'

/**
 * Calculates the odds of winning at least 1 prize
 * odds of winning at least 1 prize = 1 - the odds of not winning any prizes
 * @param balance
 * @param totalSupply
 * @param decimals
 * @param numberOfPrizes
 * @returns
 */
export const calculateOdds = (
  balance: BigNumber,
  totalSupply: BigNumber,
  decimals: string,
  numberOfPrizes: number = 1
) => {
  if (
    !balance ||
    balance.isZero() ||
    !totalSupply ||
    totalSupply.isZero() ||
    !decimals ||
    numberOfPrizes === 0
  ) {
    return 0
  }

  const usersBalanceFloat = Number(ethers.utils.formatUnits(balance, decimals))
  const totalSupplyFloat = Number(ethers.utils.formatUnits(totalSupply, decimals))
  return 1 - Math.pow((totalSupplyFloat - usersBalanceFloat) / totalSupplyFloat, numberOfPrizes)
}
