/**
 * Provides a hex color to match tokens
 * @param tokenAddress
 * @param isDarkMode
 * @returns
 */
export const getTokenColour = (tokenAddress, isDarkMode = false) => {
  if (isDarkMode) {
    return TOKEN_COLORS_DARK[tokenAddress]
  }

  return TOKEN_COLORS[tokenAddress]
}

const TOKEN_COLORS = Object.freeze({})
const TOKEN_COLORS_DARK = Object.freeze({})
