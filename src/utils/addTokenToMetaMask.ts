import { POOL_ADDRESSES } from '../data/governance'

export const addTokenToMetaMask = async (token: {
  address: string
  symbol: string
  decimals: number
  image: string
}) => {
  try {
    // @ts-ignore
    if (!ethereum || !token || !token.address || !token.symbol || !token.decimals || !token.image) {
      throw new Error()
    }

    // @ts-ignore
    return await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: token
      }
    })
  } catch (error) {
    console.log('Token not added')
    console.log(error)
  }
}

export const addPoolTokenToMetaMask = async (chainId: number) => {
  const poolTokenAddress = POOL_ADDRESSES[chainId]?.pool
  return addTokenToMetaMask({
    address: poolTokenAddress,
    symbol: 'POOL',
    decimals: 18,
    image: 'https://app.pooltogether.com/pooltogether-token-logo@2x.png'
  })
}

export const addUsdcTicketTokenToMetaMask = async (token: { address: string; symbol: string }) =>
  addTokenToMetaMask({
    ...token,
    decimals: 6,
    image: 'https://app.pooltogether.com/ptausdc.png'
  })
