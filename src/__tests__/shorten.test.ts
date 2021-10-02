import { shorten } from '../address'

describe('shorten', () => {
  it('should work', () => {
    expect(shorten({ hash: '0x1234567890' })).toEqual('0x1234...7890')
  })
  it('accepts short', () => {
    expect(shorten({ hash: '0x1234567890', short: true })).toEqual('0x1234')
  })
})
