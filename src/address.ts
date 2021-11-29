export interface ShortenParams {
  hash: string
  short?: boolean
}

const expression = /^(\w{6})\w*(\w{4})$/
/**
 * Shortens a hash into something a little more user friendly
 * @param hash
 * @returns
 */
export const shorten = (params: ShortenParams) => {
  let result

  if (!params.hash) {
    return null
  }

  result = expression.exec(params.hash)

  return params.short ? `${result[1]}...` : `${result[1]}...${result[2]}`
}

/**
 * Returns the string used for urls
 * @param {string} tokenSymbol string
 * @param {string} address string
 * @returns
 */
export const getPrizePoolSymbol = (tokenSymbol, address) => {
  return `${tokenSymbol.toUpperCase()}-${address.slice(0, 8)}`
}
