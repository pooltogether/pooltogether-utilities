// Functions
import * as Address from './address'
import * as FormatData from './formatData'
import * as FormatNumber from './formatNumber'
import * as Time from './time'
import * as Keys from './keys'
import * as PTMath from './math'
import * as YieldSources from './yieldSources'
import * as Network from './networks'
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
  ...Time,
  ...YieldSources,
  // Data
  ...NetworkData,
  ...YieldSourcesData
}
