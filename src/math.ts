import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { SECONDS_PER_YEAR } from './constants'

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
export const addBigNumbers = (nums: BigNumber[]): ethers.BigNumber =>
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
 * @param prizePeriodRemainingSeconds ex. "322003"
 * @param poolReserveRate ex. "0.5"
 * @param compApy ex "2.39234 "
 * @returns BigNumber
 */
export const calculateEstimatedCompoundPrizeWithYieldUnformatted = (
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
  let prizeYield = poolReserveRateUnformatted.isZero()
    ? ethers.constants.Zero
    : poolDepositsTotalSupplyUnformatted
        .mul(supplyRatePerBlockUnformatted)
        .mul(Math.round(parseFloat(prizePeriodRemainingBlocks)))
        .mul(poolReserveRateUnformatted)
        .div(ethers.utils.parseUnits('1', 18)) // Format for supplyRatePerBlockUnformatted
        .div(ethers.utils.parseUnits('1', decimals))

  return prizeYield.add(existingPrizeUnformatted)
}

/**
 * Estimates the value of the COMP that will be earned from supplying to Compound
 * @param compApy
 * @param poolDepositsTotalValueUsdScaled
 * @param prizePeriodRemainingSeconds
 * @returns BigNumber
 */
export const calculatedEstimatedAccruedCompTotalValueUsdScaled = (
  compApy: string,
  poolDepositsTotalValueUsdScaled: BigNumber,
  prizePeriodRemainingSeconds: string
): BigNumber => {
  // Estimate accrued comp that will be
  if (compApy) {
    const compYearlyEarningsUnformatted = poolDepositsTotalValueUsdScaled
      .mul(Math.round(parseFloat(compApy) * 100))
      .div(10000)
    const compEarningsPerSecondUnformatted = compYearlyEarningsUnformatted
      .mul(100)
      .div(SECONDS_PER_YEAR)
    return compEarningsPerSecondUnformatted.mul(prizePeriodRemainingSeconds).div(100)
  } else {
    return ethers.constants.Zero
  }
}

/**
 * Calculates the APR of provided values
 * Make sure the BigNumbers are formatted with the same decimals
 * @param totalDailyValue
 * @param totalValue
 * @returns
 */
export const calculateAPR = (totalDailyValue: BigNumber, totalValue: BigNumber) => {
  if (totalValue.isZero() || totalDailyValue.isZero()) return '0'
  return formatUnits(
    totalDailyValue
      .mul(10000)
      .mul(365)
      .div(totalValue),
    2
  )
}

/**
 * Calculates the value of an LP token for the 2 provided tokens
 * Make sure the BigNumbers are formatted with the same decimals
 * @param totalValueOfLPPool
 * @param totalSupplyOfLPTokens
 * @returns
 */
export const calculateLPTokenPrice = (
  token1Amount: string,
  token2Amount: string,
  token1ValueUsd: number,
  token2ValueUsd: number,
  totalSupplyOfLPTokens: string
) => {
  const normalizedTotalValue = addBigNumbers([
    amountMultByUsd(parseUnits(token1Amount, 18), token1ValueUsd),
    amountMultByUsd(parseUnits(token2Amount, 18), token2ValueUsd)
  ])
  const normalizedTotalSupply = parseUnits(totalSupplyOfLPTokens, 18)
  return normalizedTotalValue.div(normalizedTotalSupply)
}

/**
 * Calculate Cream borrow APY with values from crToken & interest rate model contracts
 * @param baseUnformatted
 * @param multiplierUnformatted
 * @param utilizationRateUnformatted
 * @param kink1Unformatted
 * @param kink2Unformatted
 * @param jumpMultiplierUnformatted
 * @param blocksPerYearBN
 * @returns
 */
export const calculateCreamBorrowApy = (
  baseUnformatted: BigNumber,
  multiplierUnformatted: BigNumber,
  utilizationRateUnformatted: BigNumber,
  kink1Unformatted: BigNumber,
  kink2Unformatted: BigNumber,
  jumpMultiplierUnformatted: BigNumber,
  blocksPerYearBN: BigNumber
) => {
  const base = Number(formatUnits(baseUnformatted, 18))
  const multiplier = Number(formatUnits(multiplierUnformatted, 18))
  const utilizationRate = Number(formatUnits(utilizationRateUnformatted, 18))
  const kink1 = Number(formatUnits(kink1Unformatted, 18))
  const kink2 = Number(formatUnits(kink2Unformatted, 18))
  const jumpMultiplier = Number(formatUnits(jumpMultiplierUnformatted, 18))
  const blocksPerYear = blocksPerYearBN.toNumber()

  return (
    (1 +
      base +
      multiplier * Math.min(utilizationRate, kink1) +
      Math.max(jumpMultiplier * utilizationRate - kink2, 0)) **
      blocksPerYear -
    1
  )
}

/**
 * Calculate Cream supply APY with values from crToken & interest rate model contracts
 * @param borrowApy
 * @param reserveFactorUnformatted
 * @param utilizationRateUnformatted
 * @param blocksPerYearBN
 * @returns
 */
export const calculateCreamSupplyApy = (
  borrowApy: number,
  reserveFactorUnformatted: BigNumber,
  utilizationRateUnformatted: BigNumber,
  blocksPerYearBN: BigNumber
) => {
  const reserveFactor = Number(formatUnits(reserveFactorUnformatted, 18))
  const utilizationRate = Number(formatUnits(utilizationRateUnformatted, 18))
  const blocksPerYear = blocksPerYearBN.toNumber()
  return (
    (1 + ((1 + borrowApy) ** (1 / blocksPerYear) - 1) * (1 - reserveFactor) * utilizationRate) **
      blocksPerYear -
    1
  )
}
