import { BigNumber } from '@ethersproject/bignumber';
import { FormatNumberOptions } from './types';
/**
 * Slices a number string to the requested precision
 * @param {string} val a number string ex. "1005.2924"
 * @param {FormatNumberOptions} options
 * @returns
 */
export declare function stringWithPrecision(val: string, options?: FormatNumberOptions): string;
/**
 * Converts a USD string to a scaled up big number to account for cents
 * @param {string} usd a String ex. "100.23"
 * @returns a BigNumber ex. 10023
 */
export declare const toScaledUsdBigNumber: (usd: string) => BigNumber;
/**
 * Returns a formatted string for a percentage
 * @param percentage
 * @returns
 */
export declare function displayPercentage(percentage: string): string;
