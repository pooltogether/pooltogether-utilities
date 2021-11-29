// Functions
import * as Address from './address'
import * as FormatData from './formatData'
import * as FormatNumber from './formatNumber'
import * as Keys from './keys'
import * as Network from './networks'
import * as Pods from './pods'
import * as Providers from './providers'
import * as PTMath from './math'
import * as Time from './time'
import * as Tokens from './tokens'
import * as Odds from './odds'

// Data
import * as NetworkData from './data/networks'

// Export for use as a npm package
const exports = {
  // Functions
  ...Address,
  ...Odds,
  ...FormatData,
  ...FormatNumber,
  ...Keys,
  ...Network,
  ...Pods,
  ...Providers,
  ...PTMath,
  ...Time,
  ...Tokens,
  // Data
  ...NetworkData
}

export default exports
