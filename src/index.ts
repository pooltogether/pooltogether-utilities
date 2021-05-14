import * as Address from './address'
import * as FormatData from './formatData'
import * as FormatNumber from './formatNumber'
import * as Time from './time'
import * as Keys from './keys'
import * as PTMath from './math'
import * as YieldSources from './yieldSources'

// Export for use as a npm package
module.exports = {
  ...Address,
  ...FormatData,
  ...FormatNumber,
  ...Keys,
  ...PTMath,
  ...Time,
  ...YieldSources
}

console.log({
  ...Address,
  ...FormatData,
  ...FormatNumber,
  ...Keys,
  ...PTMath,
  ...Time,
  ...YieldSources
})
