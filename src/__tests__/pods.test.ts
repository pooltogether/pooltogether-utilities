import { parseUnits } from '@ethersproject/units'
import { underlyingAmountToSharesAmount, sharesAmountToUnderlyingAmount } from '../pods'

describe('underlyingAmountToSharesAmount', () => {
  it('1:1', () => {
    const decimals = '2'
    const value = parseUnits('1', decimals)
    expect(underlyingAmountToSharesAmount(value, value, decimals)).toEqual(value)
  })

  it('Basic conversion', () => {
    const decimals = '2'
    const underlyingAmount = parseUnits('10', decimals)
    const conversionRate = parseUnits('1.5', decimals)
    const expectedAmount = parseUnits('6.66', decimals)

    console.log(
      `Result: ${underlyingAmountToSharesAmount(
        underlyingAmount,
        conversionRate,
        decimals
      ).toString()}, expected: ${expectedAmount.toString()}`
    )

    expect(underlyingAmountToSharesAmount(underlyingAmount, conversionRate, decimals)).toEqual(
      expectedAmount
    )
  })
})

describe('sharesAmountToUnderlyingAmount', () => {
  it('1:1', () => {
    const decimals = '2'
    const value = parseUnits('1', decimals)
    expect(sharesAmountToUnderlyingAmount(value, value, decimals)).toEqual(value)
  })

  it('Basic conversion', () => {
    const decimals = '2'
    const sharesAmount = parseUnits('10', decimals)
    const conversionRate = parseUnits('1.5', decimals)
    const expectedAmount = parseUnits('15', decimals)

    console.log(
      `Result: ${sharesAmountToUnderlyingAmount(
        sharesAmount,
        conversionRate,
        decimals
      ).toString()}, expected: ${expectedAmount.toString()}`
    )

    expect(sharesAmountToUnderlyingAmount(sharesAmount, conversionRate, decimals)).toEqual(
      expectedAmount
    )
  })
})
