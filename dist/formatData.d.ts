import { ethers } from 'ethers';
/**
 * Recursively looks through an object, converting all big numbers into actual BigNumbers
 * @param {any} data json blob
 * @returns
 */
export declare const deserializeBigNumbers: (data: any) => any;
/**
 * Formats the data returned from the graph for a lootBox
 * @param {*} lootBoxGraphData
 * @returns
 */
export declare const formatLootBox: (lootBoxGraphData: any) => {
    erc1155Tokens: any;
    erc721Tokens: any;
    erc20Tokens: any;
};
/**
 * Gets all erc20 addresses related to a pool
 * @param {*} pools
 * @returns Array of addresses
 */
export declare const getAllErc20AddressesFromPool: (pool: any) => Set<string>;
/**
 * Gets all erc20 addresses related to several pools
 * @param {*} pools
 * @returns Array of addresses
 */
export declare const getAllErc20AddressesFromPools: (pools: any) => string[];
/**
 * Mutates a token adding token USD value if we have the USD price per token
 * @param {*} token
 */
export declare const addTokenTotalUsdValue: (token: any, tokenPriceData: any) => void;
/**
 *
 * @param {*} pool
 * @param {*} lootBoxData
 * @returns
 */
export declare const combineLootBoxDataWithPool: (pool: any, lootBoxData: any) => void;
/**
 * Adds token price data to pools
 * @param {*} _pools
 * @param {*} tokenPriceData
 */
export declare const combineTokenPricesData: (_pools: any, tokenPriceData: any) => any;
/**
 * Standardizes calculated total values
 * @param {*} amountUnformatted Ex. 1000000000000000000
 * @param {*} usdValue Ex. 1.23
 * @param {*} decimals Ex. 6
 */
export declare const calculateTokenValues: (amountUnformatted: any, usdValue: any, decimals: any) => {
    amount: string;
    amountUnformatted: any;
    totalValueUsd: string;
    totalValueUsdScaled: ethers.BigNumber;
    totalValueUsdUnformatted: ethers.BigNumber;
};
/**
 * Formats prize pool data from The Graph
 * @param {*} prizePool
 * @param {*} chainId
 * @returns
 */
export declare const formatPoolGraphData: (prizePool: any, chainId: any) => {
    config: {
        liquidityCap: any;
        maxExitFeeMantissa: any;
        maxTimelockDurationSeconds: any;
        timelockTotalSupply: any;
        numberOfWinners: any;
        prizePeriodSeconds: any;
        tokenCreditRates: any;
    };
    prizePool: {
        address: any;
    };
    prizeStrategy: {
        address: any;
    };
    tokens: {
        ticket: {
            address: any;
            decimals: any;
            name: any;
            symbol: any;
            totalSupply: string;
            totalSupplyUnformatted: ethers.BigNumber;
            numberOfHolders: any;
        };
        sponsorship: {
            address: any;
            decimals: any;
            name: any;
            symbol: any;
            totalSupply: string;
            totalSupplyUnformatted: ethers.BigNumber;
            numberOfHolders: any;
        };
        underlyingToken: {
            address: any;
            decimals: any;
            name: any;
            symbol: any;
        };
    };
    prize: {
        cumulativePrizeNet: any;
        currentPrizeId: any;
        currentState: any;
        externalErc20Awards: any;
        externalErc721Awards: any;
        sablierStream: {
            id: any;
        };
        lootBox: any;
    };
    reserve: {
        registry: {
            address: any;
        };
    };
    tokenListener: {
        address: any;
    };
};
