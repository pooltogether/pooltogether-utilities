"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayPercentage = exports.toScaledUsdBigNumber = exports.stringWithPrecision = void 0;
const units_1 = require("@ethersproject/units");
/**
 * Slices a number string to the requested precision
 * @param {string} val a number string ex. "1005.2924"
 * @param {FormatNumberOptions} options
 * @returns
 */
function stringWithPrecision(val, options = { precision: 2 }) {
    const { precision } = options;
    if (val && typeof val.indexOf === 'function') {
        const extraChars = precision ? precision + 1 : 0;
        return val.substr(0, val.indexOf('.') + extraChars);
    }
    else {
        return val;
    }
}
exports.stringWithPrecision = stringWithPrecision;
/**
 * Converts a USD string to a scaled up big number to account for cents
 * @param {string} usd a String ex. "100.23"
 * @returns a BigNumber ex. 10023
 */
const toScaledUsdBigNumber = (usd) => units_1.parseUnits(stringWithPrecision(usd, { precision: 2 }), 2);
exports.toScaledUsdBigNumber = toScaledUsdBigNumber;
/**
 * Returns a formatted string for a percentage
 * @param percentage
 * @returns
 */
function displayPercentage(percentage) {
    percentage = parseFloat(percentage).toFixed(2);
    return percentage.toString().replace(/(\.0+$)|(0+$)/, '');
}
exports.displayPercentage = displayPercentage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0TnVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Zvcm1hdE51bWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnREFBaUQ7QUFJakQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxHQUFXLEVBQUUsVUFBK0IsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0lBQzlGLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUE7SUFDN0IsSUFBSSxHQUFHLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtRQUM1QyxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUE7S0FDcEQ7U0FBTTtRQUNMLE9BQU8sR0FBRyxDQUFBO0tBQ1g7QUFDSCxDQUFDO0FBUkQsa0RBUUM7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEdBQVcsRUFBYSxFQUFFLENBQzdELGtCQUFVLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFEOUMsUUFBQSxvQkFBb0Isd0JBQzBCO0FBRTNEOzs7O0dBSUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxVQUFrQjtJQUNsRCxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QyxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzNELENBQUM7QUFIRCw4Q0FHQyJ9