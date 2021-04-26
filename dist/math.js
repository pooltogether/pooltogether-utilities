"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatedEstimatedAccruedCompValueUnformatted = exports.calculateEstimatedCompoundPrizeWithYieldUnformatted = exports.calculateUsersOdds = exports.addBigNumbers = exports.amountMultByUsd = void 0;
const ethers_1 = require("ethers");
const current_pool_data_1 = require("@pooltogether/current-pool-data");
/**
 * Need to mult & div by 100 since BigNumber doesn't support decimals
 * @param {ethers.BigNumber} amount as a BigNumber
 * @param {number} usd as a Number
 * @returns a BigNumber
 */
const amountMultByUsd = (amount, usd) => amount.mul(Math.round(usd * 100)).div(100);
exports.amountMultByUsd = amountMultByUsd;
/**
 * Adds a list of BigNumbers
 * @param {ethers.BigNumber[]} nums an array of scaled BigNumbers
 * @returns
 */
const addBigNumbers = (nums) => nums.reduce((total, bn) => {
    return bn.add(total);
}, ethers_1.ethers.constants.Zero);
exports.addBigNumbers = addBigNumbers;
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
const calculateUsersOdds = (usersTicketBalance, totalSupply, decimals, numberOfWinners) => {
    if (!usersTicketBalance || usersTicketBalance.eq(ethers_1.ethers.BigNumber.from(0)) || !decimals) {
        return 0;
    }
    const numOfWinners = parseInt(numberOfWinners, 10);
    const usersBalanceFloat = Number(ethers_1.ethers.utils.formatUnits(usersTicketBalance, Number(decimals)));
    const totalSupplyFloat = Number(ethers_1.ethers.utils.formatUnits(totalSupply, Number(decimals)));
    return 1 / (1 - Math.pow((totalSupplyFloat - usersBalanceFloat) / totalSupplyFloat, numOfWinners));
};
exports.calculateUsersOdds = calculateUsersOdds;
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
const calculateEstimatedCompoundPrizeWithYieldUnformatted = (existingPrizeUnformatted, poolDepositsTotalSupplyUnformatted, supplyRatePerBlockUnformatted, decimals, prizePeriodRemainingBlocks, poolReserveRate) => {
    // Format to same decimal places, so we keep accuracy for floats
    const poolReserveRateUnformatted = poolReserveRate && parseFloat(poolReserveRate) !== 0
        ? ethers_1.ethers.utils.parseUnits(parseFloat(poolReserveRate).toFixed(Number(decimals)), decimals)
        : ethers_1.ethers.constants.Zero;
    // Additional divison to handle decimal placements
    let prizeYield = poolReserveRateUnformatted.isZero()
        ? ethers_1.ethers.constants.Zero
        : poolDepositsTotalSupplyUnformatted
            .mul(supplyRatePerBlockUnformatted)
            .mul(Math.round(parseFloat(prizePeriodRemainingBlocks)))
            .mul(poolReserveRateUnformatted)
            .div(ethers_1.ethers.utils.parseUnits('1', 18)) // Format for supplyRatePerBlockUnformatted
            .div(ethers_1.ethers.utils.parseUnits('1', decimals));
    return prizeYield.add(existingPrizeUnformatted);
};
exports.calculateEstimatedCompoundPrizeWithYieldUnformatted = calculateEstimatedCompoundPrizeWithYieldUnformatted;
/**
 * Estimates the value of the COMP that will be earned from supplying to Compound
 * @param compApy
 * @param poolDepositsTotalSupplyUnformatted
 * @param prizePeriodRemainingSeconds
 * @returns
 */
const calculatedEstimatedAccruedCompValueUnformatted = (compApy, poolDepositsTotalSupplyUnformatted, prizePeriodRemainingSeconds) => {
    // Estimate accrued comp that will be
    if (compApy) {
        const compYearlyEarningsUnformatted = poolDepositsTotalSupplyUnformatted
            .mul(Math.round(parseFloat(compApy) * 100))
            .div(10000);
        const compEarningsPerSecondUnformatted = compYearlyEarningsUnformatted.div(current_pool_data_1.SECONDS_PER_YEAR);
        return compEarningsPerSecondUnformatted.mul(prizePeriodRemainingSeconds);
    }
    else {
        return ethers_1.ethers.constants.Zero;
    }
};
exports.calculatedEstimatedAccruedCompValueUnformatted = calculatedEstimatedAccruedCompValueUnformatted;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUErQjtBQUMvQix1RUFBb0Y7QUFFcEY7Ozs7O0dBS0c7QUFDSSxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQXdCLEVBQUUsR0FBVyxFQUFFLEVBQUUsQ0FDdkUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUQvQixRQUFBLGVBQWUsbUJBQ2dCO0FBRTVDOzs7O0dBSUc7QUFDSSxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQWlCLEVBQW9CLEVBQUUsQ0FDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQXVCLEVBQUUsRUFBb0IsRUFBRSxFQUFFO0lBQzVELE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN0QixDQUFDLEVBQUUsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUhkLFFBQUEsYUFBYSxpQkFHQztBQUUzQjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSSxNQUFNLGtCQUFrQixHQUFHLENBQ2hDLGtCQUFvQyxFQUNwQyxXQUE2QixFQUM3QixRQUFnQixFQUNoQixlQUF1QixFQUN2QixFQUFFO0lBQ0YsSUFBSSxDQUFDLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxlQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ3ZGLE9BQU8sQ0FBQyxDQUFBO0tBQ1Q7SUFDRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ2xELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGVBQU0sQ0FBQyxLQUFLLENBQUMs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