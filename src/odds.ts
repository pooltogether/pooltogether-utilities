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

/**
 * Compute the union of several probability distributions
 * p(a | b) = p(a) + p(b) - p(a & b)
 * @param args ex. 0.2, 1, 0.5, 0.33
 * @returns
 */
export const unionProbabilities = (...args: number[]) => {
  let returnValue = args[0]
  for (let i = 1; i < args.length; i++) {
    returnValue = returnValue + args[i] - returnValue * args[i]
  }
  return returnValue
}
