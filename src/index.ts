import * as FormatData from './formatData'
import * as FormatNumber from './formatNumber'
import * as Keys from './keys'
import * as PTMath from './math'

// Export for use as a npm package
module.exports = {
  ...FormatData,
  ...FormatNumber,
  ...Keys,
  ...PTMath
}
