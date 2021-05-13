import { getKnownYieldSourceContract } from '../yieldSources'

describe('getKnownYieldSourceContract', () => {
  it('returns a KnownYieldSourceContract if matches', () => {
    const knownContract = getKnownYieldSourceContract('0xface')

    expect(knownContract).toEqual('0')
  })
})
