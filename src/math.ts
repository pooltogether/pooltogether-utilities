import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { bn } from './_utils'

/**
 * Need to mult & div by 100 since BigNumber doesn't support decimals
 * @param {ethers.BigNumber} amount as a BigNumber
 * @param {number} usd as a Number
 * @returns a BigNumber
 */
export const amountMultByUsd = (amount: ethers.BigNumber, usd: number) =>
  amount.mul(Math.round(usd * 100)).div(100)

/**
 * Adds a list of BigNumbers
 * @param {ethers.BigNumber[]} nums an array of scaled BigNumbers
 * @returns
 */
export const addBigNumbers = (nums: BigNumber[]) =>
  nums.reduce((total: ethers.BigNumber, bn: ethers.BigNumber) => {
    return bn.add(total)
  }, ethers.constants.Zero)

/**
 * Calculate odds of winning at least 1 of the possible scenarios.
 * 1/N, 2/N ... N-1/N, N/N
 * Then we always display "1 in ____" so 1 / X.
 *
 * `usersTicketBalance` and `totalSupply` must be formatted with the same `decimals`
 *
 * @param usersTicketBalance
 * @param totalSupply
 * @param decimals
 * @param numberOfWinners
 * @returns
 */
export const calculateUsersOdds = (
  usersTicketBalance: ethers.BigNumber,
  totalSupply: ethers.BigNumber,
  decimals: string,
  numberOfWinners: string
) => {
  if (!usersTicketBalance || usersTicketBalance.eq(ethers.BigNumber.from(0)) || !decimals) {
    return 0
  }
  const numOfWinners = parseInt(numberOfWinners, 10)
  const usersBalanceFloat = Number(ethers.utils.formatUnits(usersTicketBalance, Number(decimals)))
  const totalSupplyFloat = Number(ethers.utils.formatUnits(totalSupply, Number(decimals)))
  return 1 / (1 - Math.pow((totalSupplyFloat - usersBalanceFloat) / totalSupplyFloat, numOfWinners))
}

/**
 * Calculates the estimated yield for a prize pool
 * Yield = total supply * supply rate per block * blocks * reserve percentage
 *
 * @param existingPrizeUnformatted BigNumber - same decimals as poolDepositsTotalSupplyUnformatted, supplyRatePerBlockUnformatted
 * @param poolDepositsTotalSupplyUnformatted BigNumber - same decimals as existingPrizeUnformatted, supplyRatePerBlockUnformatted
 * @param supplyRatePerBlockUnformatted BigNumber - Shifted 18 decimals
 * @param decimals decimals used to format the above parameters
 * @param prizePeriodRemainingBlocks ex. "23034.23"
 * @param poolReserveRate ex. "0.5"
 * @returns BigNumber
 */
export const calculateEstimatedPrizeWithYieldUnformatted = (
  existingPrizeUnformatted: ethers.BigNumber,
  poolDepositsTotalSupplyUnformatted: ethers.BigNumber,
  supplyRatePerBlockUnformatted: ethers.BigNumber,
  decimals: string,
  prizePeriodRemainingBlocks: string,
  poolReserveRate: string
): ethers.BigNumber => {
  // Format to same decimal places, so we keep accuracy for floats
  const poolReserveRateUnformatted =
    poolReserveRate && parseFloat(poolReserveRate) !== 0
      ? ethers.utils.parseUnits(parseFloat(poolReserveRate).toFixed(Number(decimals)), decimals)
      : ethers.constants.Zero

  // Additional divison to handle decimal placements
  const prizeYield = poolReserveRateUnformatted.isZero()
    ? ethers.constants.Zero
    : poolDepositsTotalSupplyUnformatted
        .mul(supplyRatePerBlockUnformatted)
        .mul(Math.round(parseFloat(prizePeriodRemainingBlocks)))
        .mul(poolReserveRateUnformatted)
        .div(ethers.utils.parseUnits('1', 18)) // Format for supplyRatePerBlockUnformatted
        .div(ethers.utils.parseUnits('1', decimals))

  return prizeYield.add(existingPrizeUnformatted)
}
