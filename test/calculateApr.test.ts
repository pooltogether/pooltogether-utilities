import { BigNumber, ethers } from 'ethers'
import { calculateApr } from '../src/utils/math'

describe('calculateApr', () => {
  it('Handles 0 cases gracefully', () => {
    const a = calculateApr(ethers.constants.Zero, ethers.constants.Zero)
    const b = calculateApr(ethers.constants.Zero, ethers.constants.One)
    const c = calculateApr(ethers.constants.One, ethers.constants.Zero)

    expect(a).toEqual(0)
    expect(b).toEqual(0)
    expect(c).toEqual(0)
  })

  it('Handles happy path', () => {
    const totalSupplyAmountUnformatted = BigNumber.from(100)
    const dailyPrizeAmountUnformatted = BigNumber.from(10)

    const a = calculateApr(totalSupplyAmountUnformatted, dailyPrizeAmountUnformatted)

    expect(a).toEqual(3650)
  })

  it('Handles live case', () => {
    const totalSupplyAmountUnformatted = BigNumber.from(30000000)
    const dailyPrizeAmountUnformatted = BigNumber.from(7000)

    const a = calculateApr(totalSupplyAmountUnformatted, dailyPrizeAmountUnformatted)

    expect(a).toEqual(8.51)
  })
})
