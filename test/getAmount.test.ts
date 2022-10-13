import { ethers } from 'ethers'
import { getAmount, getAmountFromUnformatted } from '../src/utils/formatNumber'

const bn = ethers.BigNumber.from

describe('getAmount', () => {
  // Simple
  it('Formats Numbers', () => {
    expect(getAmount(3500, '6')).toEqual({
      amount: '3500',
      amountUnformatted: bn('3500000000'),
      amountPretty: '3,500',
      decimals: '6'
    })
  })
  it('Formats Strings', () => {
    expect(getAmount('3500', '6')).toEqual({
      amount: '3500',
      amountUnformatted: bn('3500000000'),
      amountPretty: '3,500',
      decimals: '6'
    })
  })
  it('Formats BigNumbers', () => {
    expect(getAmount(bn('3500'), '6')).toEqual({
      amount: '3500',
      amountUnformatted: bn('3500000000'),
      amountPretty: '3,500',
      decimals: '6'
    })
  })
  // Options passthrough
  it('Currency passthrough', () => {
    expect(
      getAmount(3500, '6', {
        currency: 'usd',
        style: 'currency'
      })
    ).toEqual({
      amount: '3500',
      amountUnformatted: bn('3500000000'),
      amountPretty: '$3,500.00',
      decimals: '6'
    })
  })
  it('Significant Digits', () => {
    expect(
      getAmount('0.000042', '6', {
        currency: 'usd',
        style: 'currency'
      })
    ).toEqual({
      amount: '0.000042',
      amountUnformatted: bn('42'),
      amountPretty: '$0.00',
      decimals: '6'
    })
    expect(getAmount('0.000042', '6')).toEqual({
      amount: '0.000042',
      amountUnformatted: bn('42'),
      amountPretty: '0',
      decimals: '6'
    })
    expect(getAmount('0.000042', '6', { minimumFractionDigits: 2 })).toEqual({
      amount: '0.000042',
      amountUnformatted: bn('42'),
      amountPretty: '0.00',
      decimals: '6'
    })
    expect(getAmount('0.000042', '6', { minimumSignificantDigits: 2 })).toEqual({
      amount: '0.000042',
      amountUnformatted: bn('42'),
      amountPretty: '0.000042',
      decimals: '6'
    })
    expect(getAmount('0.000042', '6', { maximumSignificantDigits: 1 })).toEqual({
      amount: '0.000042',
      amountUnformatted: bn('42'),
      amountPretty: '0.00004',
      decimals: '6'
    })
  })
})

describe('getAmountFromUnformatted', () => {
  // Simple
  it('Formats Strings', () => {
    expect(getAmountFromUnformatted('3500000', '3')).toEqual({
      amount: '3500.0',
      amountUnformatted: bn('3500000'),
      amountPretty: '3,500',
      decimals: '3'
    })
  })
  it('Formats BigNumbers', () => {
    expect(getAmountFromUnformatted(bn('350000'), '2')).toEqual({
      amount: '3500.0',
      amountUnformatted: bn('350000'),
      amountPretty: '3,500',
      decimals: '2'
    })
  })
})
