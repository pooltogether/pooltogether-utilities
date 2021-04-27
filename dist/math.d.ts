import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
/**
 * Need to mult & div by 100 since BigNumber doesn't support decimals
 * @param {ethers.BigNumber} amount as a BigNumber
 * @param {number} usd as a Number
 * @returns a BigNumber
 */
export declare const amountMultByUsd: (amount: ethers.BigNumber, usd: number) => BigNumber;
/**
 * Adds a list of BigNumbers
 * @param {ethers.BigNumber[]} nums an array of scaled BigNumbers
 * @returns
 */
export declare const addBigNumbers: (nums: BigNumber[]) => ethers.BigNumber;
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
export declare const calculateUsersOdds: (usersTicketBalance: ethers.BigNumber, totalSupply: ethers.BigNumber, decimals: string, numberOfWinners: string) => number;
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
export declare const calculateEstimatedCompoundPrizeWithYieldUnformatted: (existingPrizeUnformatted: ethers.BigNumber, poolDepositsTotalSupplyUnformatted: ethers.BigNumber, supplyRatePerBlockUnformatted: ethers.BigNumber, decimals: string, prizePeriodRemainingBlocks: string, poolReserveRate: string) => ethers.BigNumber;
/**
 * Estimates the value of the COMP that will be earned from supplying to Compound
 * @param compApy
 * @param poolDepositsTotalSupplyUnformatted
 * @param prizePeriodRemainingSeconds
 * @returns
 */
export declare const calculatedEstimatedAccruedCompValueUnformatted: (compApy: string, poolDepositsTotalSupplyUnformatted: ethers.BigNumber, prizePeriodRemainingSeconds: string) => BigNumber;
