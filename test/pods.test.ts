import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { underlyingAmountToSharesAmount, sharesAmountToUnderlyingAmount } from '../src/pods'

describe('underlyingAmountToSharesAmount', () => {
  it('1:1', () => {
    const decimals = '2'
    const value = parseUnits('1', decimals)
    expect(underlyingAmountToSharesAmount(value, value, value)).toEqual(value)
  })

  it('Basic conversion', () => {
    const decimals = '2'
    const underlyingAmount = parseUnits('10', decimals)
    const sharesTotalSupply = parseUnits('6.66', decimals)
    const podUnderlyingTokenTotalBalance = parseUnits('10', decimals)
    const expectedAmount = parseUnits('6.66', decimals)

    console.log(
      `Result: ${underlyingAmountToSharesAmount(
        underlyingAmount,
        sharesTotalSupply,
        podUnderlyingTokenTotalBalance
      ).toString()}, expected: ${expectedAmount.toString()}`
    )

    expect(
      underlyingAmountToSharesAmount(
        underlyingAmount,
        sharesTotalSupply,
        podUnderlyingTokenTotalBalance
      )
    ).toEqual(expectedAmount)
  })

  it('Real example', () => {
    const decimals = '18'
    const underlyingAmount = BigNumber.from('10000000000000000000001')
    const sharesTotalSupply = BigNumber.from('21233595596753931222690')
    const podUnderlyingTokenTotalBalance = BigNumber.from('11261083921989257612879').add(
      BigNumber.from('10000000000000000000004')
    )
    const expectedAmountUnformatted = BigNumber.from('9987071061223319562909')
    const expectedAmountString = formatUnits(expectedAmountUnformatted, decimals)
    const expectedAmountNumber = Number(expectedAmountString)

    const sharesAmountUnformatted = underlyingAmountToSharesAmount(
      underlyingAmount,
      sharesTotalSupply,
      podUnderlyingTokenTotalBalance
    )
    const sharesAmountString = formatUnits(sharesAmountUnformatted, decimals)
    const sharesAmountNumber = Number(sharesAmountString)
    // There's some rounding uglyness.
    // We can end up off by 0.000000000000000001
    expect(sharesAmountNumber).toEqual(expectedAmountNumber)
  })
})

describe('sharesAmountToUnderlyingAmount', () => {
  it('1:1', () => {
    const decimals = '2'
    const value = parseUnits('1', decimals)
    expect(sharesAmountToUnderlyingAmount(value, value, value)).toEqual(value)
  })

  it('Basic conversion', () => {
    const decimals = '2'
    const sharesAmount = parseUnits('10', decimals)
    const sharesTotalSupply = parseUnits('10', decimals)
    const podUnderlyingTokenTotalBalance = parseUnits('15', decimals)
    const expectedAmount = parseUnits('15', decimals)

    expect(
      sharesAmountToUnderlyingAmount(
        sharesAmount,
        sharesTotalSupply,
        podUnderlyingTokenTotalBalance
      )
    ).toEqual(expectedAmount)
  })

  it('Real example', () => {
    const sharesAmount = BigNumber.from('9987071061223319562909')
    const sharesTotalSupply = BigNumber.from('21233595596753931222690')
    const podUnderlyingTokenTotalBalance = BigNumber.from('11261083921989257612879').add(
      BigNumber.from('10000000000000000000004')
    )
    const expectedAmount = BigNumber.from('10000000000000000000001')

    expect(
      sharesAmountToUnderlyingAmount(
        sharesAmount,
        sharesTotalSupply,
        podUnderlyingTokenTotalBalance
      )
    ).toEqual(expectedAmount)
  })
})
