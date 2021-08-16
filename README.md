# PoolTogether utilities

A collection of various utility functions used across the PoolTogether applications/

## NOTE

Make sure you keep `peerDependencies` and `devDependencies` versions in sync!

## How to use

1. `yarn add @pooltogether/utilities`
2. `import * as Utils from '@pooltogether/utilities'` OR `import { functionYouWantToUse } from '@pooltogether/utilities'`

## Local development

Local development works best with yalc
`yarn global add yalc`

In pooltogether-utilities:
`yarn start`

In the app you're importing pooltogether-utilities:
`yalc link @pooltogether/utilities`

When you save changes inside the utilities `src` folder, the package will rebuild and be pushed to all other projects that have run `yalc link @pooltogether/utilities`.

## TODO:

- jest tests
