"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEstimatedPrizeWithYieldUnformatted = exports.calculateUsersOdds = exports.addBigNumbers = exports.amountMultByUsd = void 0;
const ethers_1 = require("ethers");
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
 * @param poolReserveRate ex. "0.5"
 * @returns BigNumber
 */
const calculateEstimatedPrizeWithYieldUnformatted = (existingPrizeUnformatted, poolDepositsTotalSupplyUnformatted, supplyRatePerBlockUnformatted, decimals, prizePeriodRemainingBlocks, poolReserveRate) => {
    // Format to same decimal places, so we keep accuracy for floats
    const poolReserveRateUnformatted = poolReserveRate && parseFloat(poolReserveRate) !== 0
        ? ethers_1.ethers.utils.parseUnits(parseFloat(poolReserveRate).toFixed(Number(decimals)), decimals)
        : ethers_1.ethers.constants.Zero;
    // Additional divison to handle decimal placements
    const prizeYield = poolReserveRateUnformatted.isZero()
        ? ethers_1.ethers.constants.Zero
        : poolDepositsTotalSupplyUnformatted
            .mul(supplyRatePerBlockUnformatted)
            .mul(Math.round(parseFloat(prizePeriodRemainingBlocks)))
            .mul(poolReserveRateUnformatted)
            .div(ethers_1.ethers.utils.parseUnits('1', 18)) // Format for supplyRatePerBlockUnformatted
            .div(ethers_1.ethers.utils.parseUnits('1', decimals));
    return prizeYield.add(existingPrizeUnformatted);
};
exports.calculateEstimatedPrizeWithYieldUnformatted = calculateEstimatedPrizeWithYieldUnformatted;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUErQjtBQUcvQjs7Ozs7R0FLRztBQUNJLE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBd0IsRUFBRSxHQUFXLEVBQUUsRUFBRSxDQUN2RSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBRC9CLFFBQUEsZUFBZSxtQkFDZ0I7QUFFNUM7Ozs7R0FJRztBQUNJLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFLENBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUF1QixFQUFFLEVBQW9CLEVBQUUsRUFBRTtJQUM1RCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdEIsQ0FBQyxFQUFFLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7QUFIZCxRQUFBLGFBQWEsaUJBR0M7QUFFM0I7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0ksTUFBTSxrQkFBa0IsR0FBRyxDQUNoQyxrQkFBb0MsRUFDcEMsV0FBNkIsRUFDN0IsUUFBZ0IsRUFDaEIsZUFBdUIsRUFDdkIsRUFBRTtJQUNGLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsZUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUN2RixPQUFPLENBQUMsQ0FBQTtLQUNUO0lBQ0QsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNsRCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2hHLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDcEcsQ0FBQyxDQUFBO0FBYlksUUFBQSxrQkFBa0Isc0JBYTlCO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSSxNQUFNLDJDQUEyQyxHQUFHLENBQ3pELHdCQUEwQyxFQUMxQyxrQ0FBb0QsRUFDcEQsNkJBQStDLEVBQy9DLFFBQWdCLEVBQ2hCLDBCQUFrQyxFQUNsQyxlQUF1QixFQUNMLEVBQUU7SUFDcEIsZ0VBQWdFO0lBQ2hFLE1BQU0sMEJBQTBCLEdBQzlCLGVBQWUsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztRQUNsRCxDQUFDLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7UUFDMUYsQ0FBQyxDQUFDLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFBO0lBRTNCLGtEQUFrRDtJQUNsRCxNQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FBQyxNQUFNLEVBQUU7UUFDcEQsQ0FBQyxDQUFDLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSTtRQUN2QixDQUFDLENBQUMsa0NBQWtDO2FBQy9CLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQzthQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO2FBQ3ZELEdBQUcsQ0FBQywwQkFBMEIsQ0FBQzthQUMvQixHQUFHLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsMkNBQTJDO2FBQ2pGLEdBQUcsQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUVsRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtBQUNqRCxDQUFDLENBQUE7QUF6QlksUUFBQSwyQ0FBMkMsK0NBeUJ2RCJ9