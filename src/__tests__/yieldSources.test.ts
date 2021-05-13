import { YIELD_SOURCE_NAMES } from '../data/knownYieldSources'
import { getKnownYieldSourceContract } from '../yieldSources'

describe('getKnownYieldSourceContract', () => {
  it('returns a KnownYieldSourceContract if matches', () => {
    const knownContract = getKnownYieldSourceContract(
      1,
      '0x39AA39c021dfbaE8faC545936693aC917d5E7563'
    )
    expect(knownContract).toEqual({
      type: 'compound',
      yieldSourceName: YIELD_SOURCE_NAMES.compound
    })
  })

  it('supports any case sensitivity', () => {
    const knownContract = getKnownYieldSourceContract(
      1,
      '0XF8445C529D363CE114148662387EBA5E62016E20'
    )
    expect(knownContract).toEqual({ type: 'compound', yieldSourceName: YIELD_SOURCE_NAMES.cream })
  })

  it('supports other networks', () => {
    const knownContract = getKnownYieldSourceContract(
      56,
      '0XC17C8C5B8BB9456C624F8534FDE6CBDA2451488C'
    )
    expect(knownContract).toEqual({ type: 'compound', yieldSourceName: YIELD_SOURCE_NAMES.cream })
  })

  it('returns undefined if no matches', () => {
    const knownContract = getKnownYieldSourceContract(1, '0xface')
    expect(knownContract).toEqual(undefined)
  })
})
