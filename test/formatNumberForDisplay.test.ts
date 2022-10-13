import { ethers } from 'ethers'
import { formatCurrencyNumberForDisplay, formatNumberForDisplay } from '../src/utils/formatNumber'

const bn = ethers.BigNumber.from

describe('formatNumberForDisplay', () => {
  // Simple
  it('Formats BigNumbers', () => {
    expect(formatNumberForDisplay(bn('3500'))).toEqual('3,500')
  })
  it('Formats Strings', () => {
    expect(formatNumberForDisplay('3500')).toEqual('3,500')
  })
  it('Formats Numbers', () => {
    expect(formatNumberForDisplay(3500)).toEqual('3,500')
  })
  // Rounding
  it('Rounds up', () => {
    expect(formatNumberForDisplay('3500.9', { round: true })).toEqual('3,501')
  })
  it('Rounds down', () => {
    expect(formatNumberForDisplay('3500.1', { round: true })).toEqual('3,500')
  })
  // Significant Digits
  it('Handles significant digits', () => {
    expect(formatNumberForDisplay('3500.123123', { maximumSignificantDigits: 1 })).toEqual('4,000')
  })
  it('Handles significant digits', () => {
    expect(
      formatNumberForDisplay('0.000123', {
        maximumSignificantDigits: 2
      })
    ).toEqual('0.00012')
    expect(
      formatNumberForDisplay('0.000129', {
        maximumSignificantDigits: 2
      })
    ).toEqual('0.00013')
  })
  // Fraction Digits
  it('Handles fraction digits', () => {
    expect(
      formatNumberForDisplay('3500.123123', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    ).toEqual('3,500.12')
  })
  it('Handles fraction digits', () => {
    expect(
      formatNumberForDisplay('3500.899', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    ).toEqual('3,500.90')
  })
  // Currency
  it('Formats currencies', () => {
    expect(formatNumberForDisplay('3500', { style: 'currency', currency: 'usd' })).toEqual(
      '$3,500.00'
    )
    expect(formatNumberForDisplay('3500', { style: 'currency', currency: 'jpy' })).toEqual('¥3,500')
  })
  // Locales
  it('Handles Locales', () => {
    expect(formatNumberForDisplay('3500', { locale: 'fr' })).toEqual('3 500')
    expect(formatNumberForDisplay('3500', { locale: 'jp' })).toEqual('3,500')
    expect(formatNumberForDisplay('3500', { locale: 'es' })).toEqual('3500')
  })
})

describe('formatCurrencyNumberForDisplay', () => {
  // Locales
  it('Handles Locales', () => {
    expect(formatCurrencyNumberForDisplay('3500', 'USD')).toEqual('$3,500.00')
    expect(formatCurrencyNumberForDisplay('3500', 'JPY')).toEqual('¥3,500')
    expect(formatCurrencyNumberForDisplay('3500', 'EUR')).toEqual('€3,500.00')
    expect(formatCurrencyNumberForDisplay('3500', 'EUR', { locale: 'fr' })).toEqual('3 500,00 €')
  })
})
