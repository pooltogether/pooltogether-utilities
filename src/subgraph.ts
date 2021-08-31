import { GraphQLClient } from 'graphql-request'
import {
  LOOTBOX_GRAPH_URIS,
  POOLTOGETHER_SUBGRAPH_URIS,
  UNISWAP_GRAPH_URIS
} from '@pooltogether/current-pool-data'

/**
 * Returns the subgraph client for the pooltogether subgraph for a specific version
 * @param {*} chainId
 * @returns
 */
export const getSubgraphClientFromChainIdAndVersion = (chainId, version) =>
  new GraphQLClient(POOLTOGETHER_SUBGRAPH_URIS[chainId][version], {
    fetch: theGraphCustomFetch
  })

/**
 * Returns the subgraph clients for multiple pooltogether subgraph versions
 * @param {*} chainId
 * @returns
 */
export const getSubgraphClientFromVersions = (chainId, versions) => {
  const clients = {}
  versions.forEach(
    (version) =>
      (clients[version] = new GraphQLClient(POOLTOGETHER_SUBGRAPH_URIS[chainId][version], {
        fetch: theGraphCustomFetch
      }))
  )
  return clients
}

/**
 * Returns the subgraph client for the uniswap (or a fork) subgraph
 * @param {*} chainId
 * @returns
 */
export const getUniswapSubgraphClient = (chainId) =>
  Boolean(UNISWAP_GRAPH_URIS[chainId])
    ? new GraphQLClient(UNISWAP_GRAPH_URIS[chainId], { fetch: theGraphCustomFetch })
    : null

/**
 * Returns the subgraph client for the loot box subgraph
 * @param {*} chainId
 * @returns
 */
export const getLootBoxSubgraphClient = (chainId) =>
  new GraphQLClient(LOOTBOX_GRAPH_URIS[chainId], {
    fetch: theGraphCustomFetch
  })

// Helpers

const retryCodes = [408, 500, 502, 503, 504, 522, 524]
const sleep = async (retry) => await new Promise((r) => setTimeout(r, 500 * retry))

/**
 * Custom fetch wrapper for the query clients so we can handle errors better and retry queries
 * NOTE: retries is starting at 3 so we don't actually retrys
 * @param {*} request
 * @param {*} options
 * @param {*} retry
 * @returns
 */
const theGraphCustomFetch = async (request, options, retry = 3) =>
  fetch(request, options)
    .then(async (response) => {
      if (response.ok) return response

      if (retry < 3 && retryCodes.includes(response.status)) {
        await sleep(retry)
        return theGraphCustomFetch(request, options, retry + 1)
      }

      throw new Error(JSON.stringify(response))
    })
    .catch((reason) => {
      console.log(reason)
      return reason
    })
