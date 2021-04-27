"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPoolGraphData = exports.calculateTokenValues = exports.combineTokenPricesData = exports.combineLootBoxDataWithPool = exports.addTokenTotalUsdValue = exports.getAllErc20AddressesFromPools = exports.getAllErc20AddressesFromPool = exports.formatLootBox = exports.deserializeBigNumbers = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const formatNumber_1 = require("./formatNumber");
const math_1 = require("./math");
const _utils_1 = require("./_utils");
const current_pool_data_1 = require("@pooltogether/current-pool-data");
/**
 * Recursively looks through an object, converting all big numbers into actual BigNumbers
 * @param {any} data json blob
 * @returns
 */
const deserializeBigNumbers = (data) => {
    try {
        if (Array.isArray(data)) {
            data.forEach(exports.deserializeBigNumbers);
        }
        else if (typeof data === 'object' && data !== null) {
            Object.keys(data).forEach((key) => {
                var _a;
                if (Array.isArray(data[key])) {
                    data[key].forEach(exports.deserializeBigNumbers);
                }
                else if (typeof data[key] === 'object' && data[key] !== null) {
                    if (((_a = data[key]) === null || _a === void 0 ? void 0 : _a.type) === 'BigNumber') {
                        data[key] = ethers_1.ethers.BigNumber.from(data[key]);
                    }
                    else {
                        exports.deserializeBigNumbers(data[key]);
                    }
                }
            });
        }
        return data;
    }
    catch (e) {
        return data;
    }
};
exports.deserializeBigNumbers = deserializeBigNumbers;
/**
 * Formats the data returned from the graph for a lootBox
 * @param {*} lootBoxGraphData
 * @returns
 */
const formatLootBox = (lootBoxGraphData) => ({
    erc1155Tokens: lootBoxGraphData.erc1155Balances,
    erc721Tokens: lootBoxGraphData.erc721Tokens,
    erc20Tokens: lootBoxGraphData.erc20Balances
        .filter((erc20) => !current_pool_data_1.tokenBlockList.includes(erc20.id))
        .map((erc20) => (Object.assign(Object.assign({}, erc20.erc20Entity), { address: erc20.erc20Entity.id, lootBoxAddress: erc20.erc20Entity.id, amountUnformatted: _utils_1.bn(erc20.balance), amount: utils_1.formatUnits(erc20.balance, erc20.erc20Entity.decimals) })))
});
exports.formatLootBox = formatLootBox;
/**
 * Gets all erc20 addresses related to a pool
 * @param {*} pools
 * @returns Array of addresses
 */
const getAllErc20AddressesFromPool = (pool) => {
    var _a;
    const addresses = new Set();
    // Get external erc20s
    pool.prize.externalErc20Awards.forEach((erc20) => addresses.add(erc20.address));
    // Get lootbox erc20s
    (_a = pool.prize.lootBox) === null || _a === void 0 ? void 0 : _a.erc20Tokens.forEach((erc20) => addresses.add(erc20.address));
    // Get known tokens
    Object.values(pool.tokens).forEach((erc20) => addresses.add(erc20.address));
    return addresses;
};
exports.getAllErc20AddressesFromPool = getAllErc20AddressesFromPool;
/**
 * Gets all erc20 addresses related to several pools
 * @param {*} pools
 * @returns Array of addresses
 */
const getAllErc20AddressesFromPools = (pools) => {
    let allAddresses = new Set();
    pools.forEach((pool) => {
        const poolAddresses = exports.getAllErc20AddressesFromPool(pool);
        allAddresses = new Set([...allAddresses, ...poolAddresses]);
    });
    return [...allAddresses];
};
exports.getAllErc20AddressesFromPools = getAllErc20AddressesFromPools;
/**
 * Mutates a token adding token USD value if we have the USD price per token
 * @param {*} token
 */
const addTokenTotalUsdValue = (token, tokenPriceData) => {
    const priceData = tokenPriceData[token.address];
    if (priceData) {
        token.usd = tokenPriceData[token.address].usd || 0;
        token.derivedETH = tokenPriceData[token.address].derivedETH || '0';
        if (token.amountUnformatted) {
            const usdValueUnformatted = math_1.amountMultByUsd(token.amountUnformatted, token.usd);
            token.totalValueUsd = utils_1.formatUnits(usdValueUnformatted, token.decimals);
            token.totalValueUsdScaled = formatNumber_1.toScaledUsdBigNumber(token.totalValueUsd);
        }
    }
    else {
        token.usd = 0;
        token.derivedETH = '0';
    }
};
exports.addTokenTotalUsdValue = addTokenTotalUsdValue;
/**
 *
 * @param {*} pool
 * @param {*} lootBoxData
 * @returns
 */
const combineLootBoxDataWithPool = (pool, lootBoxData) => {
    var _a;
    if (((_a = lootBoxData.lootBoxes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        if (!pool.prize.lootBox)
            return;
        const lootBoxGraphData = lootBoxData.lootBoxes.find((lootBox) => lootBox.tokenId === pool.prize.lootBox.id);
        if (!lootBoxGraphData)
            return;
        const formattedLootBox = exports.formatLootBox(lootBoxGraphData);
        pool.prize.lootBox = Object.assign(Object.assign({}, pool.prize.lootBox), formattedLootBox);
    }
};
exports.combineLootBoxDataWithPool = combineLootBoxDataWithPool;
/**
 * Adds token price data to pools
 * @param {*} _pools
 * @param {*} tokenPriceData
 */
const combineTokenPricesData = (_pools, tokenPriceData) => {
    const pools = lodash_clonedeep_1.default(_pools);
    pools.forEach((pool) => {
        var _a;
        // Add to all known tokens
        Object.values(pool.tokens).forEach((token) => exports.addTokenTotalUsdValue(token, tokenPriceData));
        // Add to all external erc20 tokens
        Object.values(pool.prize.externalErc20Awards).forEach((token) => exports.addTokenTotalUsdValue(token, tokenPriceData));
        // Add to all lootBox tokens
        (_a = pool.prize.lootBox) === null || _a === void 0 ? void 0 : _a.erc20Tokens.forEach((token) => exports.addTokenTotalUsdValue(token, tokenPriceData));
        // Add total values for controlled tokens
        const underlyingToken = pool.tokens.underlyingToken;
        addTotalValueForControlledTokens(pool.tokens.ticket, underlyingToken);
        addTotalValueForControlledTokens(pool.tokens.sponsorship, underlyingToken);
        // Add total values for reserves
        addTotalValueForReserve(pool);
    });
    return pools;
};
exports.combineTokenPricesData = combineTokenPricesData;
/**
 * Format controlled tokens to look like all other tokens
 * Calculates total usd values
 * @param {*} token
 * @param {*} underlyingToken
 */
const addTotalValueForControlledTokens = (token, underlyingToken) => {
    if (token.totalSupplyUnformatted) {
        const totalValueUsdUnformatted = math_1.amountMultByUsd(token.totalSupplyUnformatted, underlyingToken.usd);
        token.usd = underlyingToken.usd;
        token.derivedETH = underlyingToken.derivedETH;
        token.totalValueUsd = utils_1.formatUnits(totalValueUsdUnformatted, token.decimals);
        token.totalValueUsdScaled = formatNumber_1.toScaledUsdBigNumber(token.totalValueUsd);
    }
};
/**
 * Mutates and calculates the total value for the reserve
 * @param {*} pool
 */
const addTotalValueForReserve = (pool) => {
    const underlyingToken = pool.tokens.underlyingToken;
    const amountUnformatted = pool.reserve.amountUnformatted;
    if (amountUnformatted) {
        const totalValueUsdUnformatted = math_1.amountMultByUsd(amountUnformatted, underlyingToken.usd);
        pool.reserve.totalValueUsd = utils_1.formatUnits(totalValueUsdUnformatted, underlyingToken.decimals);
        pool.reserve.totalValueUsdScaled = formatNumber_1.toScaledUsdBigNumber(pool.reserve.totalValueUsd);
    }
};
/**
 * Standardizes calculated total values
 * @param {*} amountUnformatted Ex. 1000000000000000000
 * @param {*} usdValue Ex. 1.23
 * @param {*} decimals Ex. 6
 */
const calculateTokenValues = (amountUnformatted, usdValue, decimals) => {
    const amount = utils_1.formatUnits(amountUnformatted, decimals);
    const totalValueUsdUnformatted = math_1.amountMultByUsd(amountUnformatted, usdValue);
    const totalValueUsd = utils_1.formatUnits(totalValueUsdUnformatted, decimals);
    const totalValueUsdScaled = formatNumber_1.toScaledUsdBigNumber(totalValueUsd);
    return {
        amount,
        amountUnformatted,
        totalValueUsd,
        totalValueUsdScaled,
        totalValueUsdUnformatted
    };
};
exports.calculateTokenValues = calculateTokenValues;
/**
 * Formats prize pool data from The Graph
 * @param {*} prizePool
 * @param {*} chainId
 * @returns
 */
const formatPoolGraphData = (prizePool, chainId) => {
    var _a;
    const prizeStrategy = prizePool.prizeStrategy.multipleWinners
        ? prizePool.prizeStrategy.multipleWinners
        : prizePool.prizeStrategy.singleRandomWinner;
    const ticket = prizeStrategy.ticket;
    const sponsorship = prizeStrategy.sponsorship;
    // Filter out our PTLootBox erc721
    const externalErc20Awards = prizeStrategy.externalErc20Awards.filter((award) => {
        var _a, _b;
        const lootboxAddress = (_b = (_a = current_pool_data_1.contractAddresses[chainId]) === null || _a === void 0 ? void 0 : _a.lootBox) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (lootboxAddress) {
            return award.address !== lootboxAddress;
        }
        return true;
    });
    const formattedData = {
        config: {
            liquidityCap: prizePool.liquidityCap,
            maxExitFeeMantissa: prizePool.maxExitFeeMantissa,
            maxTimelockDurationSeconds: prizePool.maxTimelockDuration,
            timelockTotalSupply: prizePool.timelockTotalSupply,
            numberOfWinners: (prizeStrategy === null || prizeStrategy === void 0 ? void 0 : prizeStrategy.numberOfWinners) || '1',
            prizePeriodSeconds: prizeStrategy.prizePeriodSeconds,
            tokenCreditRates: prizePool.tokenCreditRates
        },
        prizePool: {
            address: prizePool.id
        },
        prizeStrategy: {
            address: prizePool.prizeStrategy.id
        },
        tokens: {
            ticket: {
                address: ticket.id,
                decimals: ticket.decimals,
                name: ticket.name,
                symbol: ticket.symbol,
                totalSupply: utils_1.formatUnits(ticket.totalSupply, ticket.decimals),
                totalSupplyUnformatted: ethers_1.ethers.BigNumber.from(ticket.totalSupply),
                numberOfHolders: ticket.numberOfHolders
            },
            sponsorship: {
                address: sponsorship.id,
                decimals: sponsorship.decimals,
                name: sponsorship.name,
                symbol: sponsorship.symbol,
                totalSupply: utils_1.formatUnits(sponsorship.totalSupply, sponsorship.decimals),
                totalSupplyUnformatted: ethers_1.ethers.BigNumber.from(sponsorship.totalSupply),
                numberOfHolders: sponsorship.numberOfHolders
            },
            underlyingToken: {
                address: prizePool.underlyingCollateralToken,
                decimals: prizePool.underlyingCollateralDecimals,
                name: prizePool.underlyingCollateralName,
                symbol: prizePool.underlyingCollateralSymbol
            }
        },
        prize: {
            cumulativePrizeNet: prizePool.cumulativePrizeNet,
            currentPrizeId: prizePool.currentPrizeId,
            currentState: prizePool.currentState,
            externalErc20Awards,
            externalErc721Awards: prizeStrategy.externalErc721Awards,
            sablierStream: {
                id: (_a = prizePool.sablierStream) === null || _a === void 0 ? void 0 : _a.id
            },
            lootBox: undefined
        },
        reserve: {
            registry: {
                // TODO: Remove. Hardcoded for a bug in the subgraph.
                address: prizePool.reserveRegistry === ethers_1.ethers.constants.Zero
                    ? '0x3e8b9901dbfe766d3fe44b36c180a1bca2b9a295'
                    : prizePool.reserveRegistry
            }
        },
        tokenListener: {
            address: prizeStrategy.tokenListener
        }
    };
    // Add lootbox items to Pool
    prizeStrategy.externalErc721Awards.forEach((erc721) => {
        var _a, _b;
        const lootBoxAddress = (_b = (_a = current_pool_data_1.contractAddresses[chainId]) === null || _a === void 0 ? void 0 : _a.lootBox) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (erc721.address === lootBoxAddress) {
            if (erc721.tokenIds.length > 1) {
                console.error('Multiple lootboxes in prize');
            }
            const lootBoxId = erc721.tokenIds[0];
            formattedData.prize.lootBox = {
                id: lootBoxId
            };
        }
    });
    if (prizePool.compoundPrizePool) {
        formatCompoundPrizePoolData(prizePool, formattedData);
    }
    else if (prizePool.yieldSourcePrizePool) {
        formatGenericYieldPrizePoolData(prizePool, formattedData);
    }
    else {
        formatStakePrizePoolData(prizePool, formattedData);
    }
    return formattedData;
};
exports.formatPoolGraphData = formatPoolGraphData;
const formatCompoundPrizePoolData = (prizePool, formattedData) => {
    formattedData.prizePool.type = current_pool_data_1.PRIZE_POOL_TYPES.compound;
    formattedData.tokens.cToken = {
        address: prizePool.compoundPrizePool.cToken
    };
};
const formatGenericYieldPrizePoolData = (prizePool, formattedData) => {
    formattedData.prizePool.type = current_pool_data_1.PRIZE_POOL_TYPES.genericYield;
    formattedData.prizePool.yieldSource = { address: prizePool.yieldSourcePrizePool.yieldSource };
};
const formatStakePrizePoolData = (prizePool, formattedData) => {
    formattedData.prizePool.type = current_pool_data_1.PRIZE_POOL_TYPES.stake;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtYXREYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1DQUErQjtBQUMvQiw0Q0FBOEM7QUFDOUMsd0VBQXdDO0FBQ3hDLGlEQUFxRDtBQUNyRCxpQ0FBd0M7QUFDeEMscUNBQTZCO0FBQzdCLHVFQUl3QztBQUV4Qzs7OztHQUlHO0FBQ0ksTUFBTSxxQkFBcUIsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO0lBQ2pELElBQUk7UUFDRixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyw2QkFBcUIsQ0FBQyxDQUFBO1NBQ3BDO2FBQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtZQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFOztnQkFDaEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDZCQUFxQixDQUFDLENBQUE7aUJBQ3pDO3FCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQzlELElBQUksQ0FBQSxNQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsMENBQUUsSUFBSSxNQUFLLFdBQVcsRUFBRTt3QkFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO3FCQUM3Qzt5QkFBTTt3QkFDTCw2QkFBcUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtxQkFDakM7aUJBQ0Y7WUFDSCxDQUFDLENBQUMsQ0FBQTtTQUNIO1FBQ0QsT0FBTyxJQUFJLENBQUE7S0FDWjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxJQUFJLENBQUE7S0FDWjtBQUNILENBQUMsQ0FBQTtBQXJCWSxRQUFBLHFCQUFxQix5QkFxQmpDO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sYUFBYSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEQsYUFBYSxFQUFFLGdCQUFnQixDQUFDLGVBQWU7SUFDL0MsWUFBWSxFQUFFLGdCQUFnQixDQUFDLFlBQVk7SUFDM0MsV0FBVyxFQUFFLGdCQUFnQixDQUFDLGFBQWE7U0FDeEMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLGtDQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyRCxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLGlDQUNYLEtBQUssQ0FBQyxXQUFXLEtBQ3BCLE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFDN0IsY0FBYyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUNwQyxpQkFBaUIsRUFBRSxXQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUNwQyxNQUFNLEVBQUUsbUJBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQzlELENBQUM7Q0FDTixDQUFDLENBQUE7QUFaVyxRQUFBLGFBQWEsaUJBWXhCO0FBRUY7Ozs7R0FJRztBQUNJLE1BQU0sNEJBQTRCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTs7SUFDbkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQTtJQUNuQyxzQkFBc0I7SUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUEwQixFQUFFLEVBQUUsQ0FDcEUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQzdCLENBQUE7SUFDRCxxQkFBcUI7SUFDckIsTUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sMENBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQTBCLEVBQUUsRUFBRSxDQUNyRSxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FDN0IsQ0FBQTtJQUNELG1CQUFtQjtJQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUEwQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ2hHLE9BQU8sU0FBUyxDQUFBO0FBQ2xCLENBQUMsQ0FBQTtBQWJZLFFBQUEsNEJBQTRCLGdDQWF4QztBQUVEOzs7O0dBSUc7QUFDSSxNQUFNLDZCQUE2QixHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDckQsSUFBSSxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQTtJQUNwQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDckIsTUFBTSxhQUFhLEdBQUcsb0NBQTRCLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDeEQsWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxZQUFZLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBQzdELENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUE7QUFDMUIsQ0FBQyxDQUFBO0FBUFksUUFBQSw2QkFBNkIsaUNBT3pDO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxxQkFBcUIsR0FBRyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRTtJQUM3RCxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQy9DLElBQUksU0FBUyxFQUFFO1FBQ2IsS0FBSyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFDbEQsS0FBSyxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUE7UUFDbEUsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsTUFBTSxtQkFBbUIsR0FBRyxzQkFBZSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDL0UsS0FBSyxDQUFDLGFBQWEsR0FBRyxtQkFBVyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN0RSxLQUFLLENBQUMsbUJBQW1CLEdBQUcsbUNBQW9CLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQ3RFO0tBQ0Y7U0FBTTtRQUNMLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ2IsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7S0FDdkI7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLHFCQUFxQix5QkFjakM7QUFFRDs7Ozs7R0FLRztBQUNJLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUU7O0lBQzlELElBQUksQ0FBQSxNQUFBLFdBQVcsQ0FBQyxTQUFTLDBDQUFFLE1BQU0sSUFBRyxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztZQUFFLE9BQU07UUFDL0IsTUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDakQsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUN2RCxDQUFBO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQjtZQUFFLE9BQU07UUFDN0IsTUFBTSxnQkFBZ0IsR0FBRyxxQkFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLG1DQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUNsQixnQkFBZ0IsQ0FDcEIsQ0FBQTtLQUNGO0FBQ0gsQ0FBQyxDQUFBO0FBYlksUUFBQSwwQkFBMEIsOEJBYXRDO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDL0QsTUFBTSxLQUFLLEdBQUcsMEJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUUvQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7O1FBQ3JCLDBCQUEwQjtRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLDZCQUFxQixDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO1FBQzNGLG1DQUFtQztRQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUM5RCw2QkFBcUIsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQzdDLENBQUE7UUFDRCw0QkFBNEI7UUFDNUIsTUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sMENBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsNkJBQXFCLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUE7UUFDaEcseUNBQXlDO1FBQ3pDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFBO1FBQ25ELGdDQUFnQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBQ3JFLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBQzFFLGdDQUFnQztRQUNoQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMvQixDQUFDLENBQUMsQ0FBQTtJQUVGLE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQyxDQUFBO0FBckJZLFFBQUEsc0JBQXNCLDBCQXFCbEM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sZ0NBQWdDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUU7SUFDbEUsSUFBSSxLQUFLLENBQUMsc0JBQXNCLEVBQUU7UUFDaEMsTUFBTSx3QkFBd0IsR0FBRyxzQkFBZSxDQUM5QyxLQUFLLENBQUMsc0JBQXNCLEVBQzVCLGVBQWUsQ0FBQyxHQUFHLENBQ3BCLENBQUE7UUFDRCxLQUFLLENBQUMsR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUE7UUFDL0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFBO1FBQzdDLEtBQUssQ0FBQyxhQUFhLEdBQUcsbUJBQVcsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDM0UsS0FBSyxDQUFDLG1CQUFtQixHQUFHLG1DQUFvQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUN0RTtBQUNILENBQUMsQ0FBQTtBQUVEOzs7R0FHRztBQUNILE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtJQUN2QyxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQTtJQUNuRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUE7SUFDeEQsSUFBSSxpQkFBaUIsRUFBRTtRQUNyQixNQUFNLHdCQUF3QixHQUFHLHNCQUFlLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hGLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLG1CQUFXLENBQUMsd0JBQXdCLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzVGLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEdBQUcsbUNBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUNwRjtBQUNILENBQUMsQ0FBQTtBQUVEOzs7OztHQUtHO0FBQ0ksTUFBTSxvQkFBb0IsR0FBRyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUM1RSxNQUFNLE1BQU0sR0FBRyxtQkFBVyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3ZELE1BQU0sd0JBQXdCLEdBQUcsc0JBQWUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUM3RSxNQUFNLGFBQWEsR0FBRyxtQkFBVyxDQUFDLHdCQUF3QixFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3JFLE1BQU0sbUJBQW1CLEdBQUcsbUNBQW9CLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDL0QsT0FBTztRQUNMLE1BQU07UUFDTixpQkFBaUI7UUFDakIsYUFBYTtRQUNiLG1CQUFtQjtRQUNuQix3QkFBd0I7S0FDekIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVpZLFFBQUEsb0JBQW9CLHdCQVloQztBQUVEOzs7OztHQUtHO0FBQ0ksTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRTs7SUFDeEQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxlQUFlO1FBQzNELENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGVBQWU7UUFDekMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUE7SUFDOUMsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQTtJQUNuQyxNQUFNLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFBO0lBRTdDLGtDQUFrQztJQUNsQyxNQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTs7UUFDN0UsTUFBTSxjQUFjLEdBQUcsTUFBQSxNQUFBLHFDQUFpQixDQUFDLE9BQU8sQ0FBQywwQ0FBRSxPQUFPLDBDQUFFLFdBQVcsRUFBRSxDQUFBO1FBQ3pFLElBQUksY0FBYyxFQUFFO1lBQ2xCLE9BQU8sS0FBSyxDQUFDLE9BQU8sS0FBSyxjQUFjLENBQUE7U0FDeEM7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxhQUFhLEdBQUc7UUFDcEIsTUFBTSxFQUFFO1lBQ04sWUFBWSxFQUFFLFNBQVMsQ0FBQyxZQUFZO1lBQ3BDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxrQkFBa0I7WUFDaEQsMEJBQTBCLEVBQUUsU0FBUyxDQUFDLG1CQUFtQjtZQUN6RCxtQkFBbUIsRUFBRSxTQUFTLENBQUMsbUJBQW1CO1lBQ2xELGVBQWUsRUFBRSxDQUFBLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxlQUFlLEtBQUksR0FBRztZQUN0RCxrQkFBa0IsRUFBRSxhQUFhLENBQUMsa0JBQWtCO1lBQ3BELGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxnQkFBZ0I7U0FDN0M7UUFDRCxTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUU7U0FDdEI7UUFDRCxhQUFhLEVBQUU7WUFDYixPQUFPLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1NBQ3BDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO2dCQUN6QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtnQkFDckIsV0FBVyxFQUFFLG1CQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUM3RCxzQkFBc0IsRUFBRSxlQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUNqRSxlQUFlLEVBQUUsTUFBTSxDQUFDLGVBQWU7YUFDeEM7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFO2dCQUN2QixRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVE7Z0JBQzlCLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSTtnQkFDdEIsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNO2dCQUMxQixXQUFXLEVBQUUsbUJBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUM7Z0JBQ3ZFLHNCQUFzQixFQUFFLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7Z0JBQ3RFLGVBQWUsRUFBRSxXQUFXLENBQUMsZUFBZTthQUM3QztZQUNELGVBQWUsRUFBRTtnQkFDZixPQUFPLEVBQUUsU0FBUyxDQUFDLHlCQUF5QjtnQkFDNUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyw0QkFBNEI7Z0JBQ2hELElBQUksRUFBRSxTQUFTLENBQUMsd0JBQXdCO2dCQUN4QyxNQUFNLEVBQUUsU0FBUyxDQUFDLDBCQUEwQjthQUM3QztTQUNGO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLGtCQUFrQjtZQUNoRCxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWM7WUFDeEMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxZQUFZO1lBQ3BDLG1CQUFtQjtZQUNuQixvQkFBb0IsRUFBRSxhQUFhLENBQUMsb0JBQW9CO1lBQ3hELGFBQWEsRUFBRTtnQkFDYixFQUFFLEVBQUUsTUFBQSxTQUFTLENBQUMsYUFBYSwwQ0FBRSxFQUFFO2FBQ2hDO1lBQ0QsT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxPQUFPLEVBQUU7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IscURBQXFEO2dCQUNyRCxPQUFPLEVBQ0wsU0FBUyxDQUFDLGVBQWUsS0FBSyxlQUFNLENBQUMsU0FBUyxDQUFDLElBQUk7b0JBQ2pELENBQUMsQ0FBQyw0Q0FBNEM7b0JBQzlDLENBQUMsQ0FBQyxTQUFTLENBQUMsZUFBZTthQUNoQztTQUNGO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsT0FBTyxFQUFFLGFBQWEsQ0FBQyxhQUFhO1NBQ3JDO0tBQ0YsQ0FBQTtJQUVELDRCQUE0QjtJQUM1QixhQUFhLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7O1FBQ3BELE1BQU0sY0FBYyxHQUFHLE1BQUEsTUFBQSxxQ0FBaUIsQ0FBQyxPQUFPLENBQUMsMENBQUUsT0FBTywwQ0FBRSxXQUFXLEVBQUUsQ0FBQTtRQUN6RSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssY0FBYyxFQUFFO1lBQ3JDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUE7YUFDN0M7WUFDRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHO2dCQUM1QixFQUFFLEVBQUUsU0FBUzthQUNkLENBQUE7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxTQUFTLENBQUMsaUJBQWlCLEVBQUU7UUFDL0IsMkJBQTJCLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0tBQ3REO1NBQU0sSUFBSSxTQUFTLENBQUMsb0JBQW9CLEVBQUU7UUFDekMsK0JBQStCLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0tBQzFEO1NBQU07UUFDTCx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUE7S0FDbkQ7SUFFRCxPQUFPLGFBQWEsQ0FBQTtBQUN0QixDQUFDLENBQUE7QUExR1ksUUFBQSxtQkFBbUIsdUJBMEcvQjtBQUVELE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEVBQUU7SUFDL0QsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsb0NBQWdCLENBQUMsUUFBUSxDQUFBO0lBQ3hELGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHO1FBQzVCLE9BQU8sRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsTUFBTTtLQUM1QyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsRUFBRTtJQUNuRSxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxvQ0FBZ0IsQ0FBQyxZQUFZLENBQUE7SUFDNUQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQy9GLENBQUMsQ0FBQTtBQUVELE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEVBQUU7SUFDNUQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsb0NBQWdCLENBQUMsS0FBSyxDQUFBO0FBQ3ZELENBQUMsQ0FBQSJ9