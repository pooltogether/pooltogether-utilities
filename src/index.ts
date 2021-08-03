// Functions
import * as Address from './address'
import * as FormatData from './formatData'
import * as FormatNumber from './formatNumber'
import * as Keys from './keys'
import * as Network from './networks'
import * as PTMath from './math'
import * as QueryParams from './queryParams'
import * as Time from './time'
import * as Tokens from './tokens'
import * as YieldSources from './yieldSources'
// Data
import * as NetworkData from './data/networks'
import * as YieldSourcesData from './data/knownYieldSources'

// Export for use as a npm package
export = {
  // Functions
  ...Address,
  ...FormatData,
  ...FormatNumber,
  ...Keys,
  ...Network,
  ...PTMath,
  ...QueryParams,
  ...Time,
  ...Tokens,
  ...YieldSources,
  // Data
  ...NetworkData,
  ...YieldSourcesData
}
