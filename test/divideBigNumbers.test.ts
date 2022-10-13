import { BigNumber, ethers } from 'ethers'
import { divideBigNumbers } from '../src/utils/math'

describe('divideBigNumbers', () => {
  it('Handles 0 cases gracefully', () => {
    const a = divideBigNumbers(ethers.constants.Zero, ethers.constants.Zero)
    const b = divideBigNumbers(ethers.constants.Zero, ethers.constants.One)
    const c = divideBigNumbers(ethers.constants.One, ethers.constants.Zero)

    expect(a).toEqual(0)
    expect(b).toEqual(0)
    expect(c).toEqual(0)
  })

  it('Handles 1 cases gracefully', () => {
    const a = divideBigNumbers(ethers.constants.One, ethers.constants.One)
    const b = divideBigNumbers(ethers.constants.Two, ethers.constants.One)
    const c = divideBigNumbers(ethers.constants.One, ethers.constants.Two)

    expect(a).toEqual(1)
    expect(b).toEqual(2)
    expect(c).toEqual(0.5)
  })

  it('Handles happy path', () => {
    const a = divideBigNumbers(BigNumber.from(100), BigNumber.from(100))
    const b = divideBigNumbers(BigNumber.from(100), BigNumber.from(2))
    const c = divideBigNumbers(BigNumber.from(2), BigNumber.from(100))

    expect(a).toEqual(1)
    expect(b).toEqual(50)
    expect(c).toEqual(0.02)
  })
})
