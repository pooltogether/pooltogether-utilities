import { BigNumber, ethers } from 'ethers'
import { calculatePercentageOfBigNumber } from '../src/utils/math'

describe('calculatePercentageOfBigNumber', () => {
  it('Handles 0 cases gracefully', () => {
    const a = calculatePercentageOfBigNumber(ethers.constants.Zero, 0)
    const b = calculatePercentageOfBigNumber(ethers.constants.Zero, 1)
    const c = calculatePercentageOfBigNumber(ethers.constants.One, 0)

    expect(a).toEqual(BigNumber.from(0))
    expect(b).toEqual(BigNumber.from(0))
    expect(c).toEqual(BigNumber.from(0))
  })

  it('Handles happy path', () => {
    const a = calculatePercentageOfBigNumber(BigNumber.from(100), 0.5)
    const b = calculatePercentageOfBigNumber(BigNumber.from(100), 1)
    const c = calculatePercentageOfBigNumber(BigNumber.from(100), 0.333)
    const d = calculatePercentageOfBigNumber(BigNumber.from(100), 2)
    const e = calculatePercentageOfBigNumber(BigNumber.from(100), 0.333, 8)
    const f = calculatePercentageOfBigNumber(BigNumber.from(100), 0.666, 8)

    expect(a).toEqual(BigNumber.from(50))
    expect(b).toEqual(BigNumber.from(100))
    expect(c).toEqual(BigNumber.from(33))
    expect(d).toEqual(BigNumber.from(200))
    expect(e).toEqual(BigNumber.from(33))
    expect(f).toEqual(BigNumber.from(66))
  })
})
