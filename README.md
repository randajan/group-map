# @randajan/group-map

[![NPM](https://img.shields.io/npm/v/@randajan/group-map.svg)](https://www.npmjs.com/package/@randajan/group-map) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# GroupMap

> Lightweight two‑level `Map` — **group → key → value** — with a tiny, chainable API.

## Features
- Constant‑time lookup using `[groupId, keyId]`.
- Automatically creates and removes group sub‑maps.
- Chainable `.set()` just like native `Map`.
- Iterator over every `[groupId, keyId, value]` triple.
- Works in Node.js (CJS & ESM) **and** the browser.
- Zero dependencies, ~0.4 kB min + gzip.

## Installation

```bash
npm i super-map
# or
yarn add super-map
```

## Quick Start

### ESM

```js
import { GroupMap } from 'super-map';

const sm = new GroupMap();
sm.set('users', 1,  { name: 'Alice' })
  .set('users', 2,  { name: 'Bob'   })
  .set('orders', 'A42', { total: 99 });

console.log(sm.get('users', 1)); // → { name: 'Alice' }
```

### CommonJS

```js
const { GroupMap } = require('super-map');

const sm = new GroupMap();
sm.set('posts', 101, { title: 'Hello' });
```

## API

| Method | Description |
| ------ | ----------- |
| `keysOf(groupId)` | Iterator of `keyId` values within the group. |
| `valuesOf(groupId)` | Iterator of stored values within the group. |
| `getAll(groupId)` | Returns the inner `Map<keyId, value>` or `undefined`. |
| `get(groupId, keyId)` | Returns a single value or `undefined`. |
| `has(groupId, keyId)` | `true` if the pair exists. |
| `set(groupId, keyId, value)` | Stores a value, returns `this`. |
| `delete(groupId, keyId)` | Removes the entry; deletes the group when empty. |
| `[Symbol.iterator]()` | Yields `[groupId, keyId, value]` for every entry. |

_All other native **`Map`** methods (`size`, `forEach`, `entries`, ...) still work._

### Iteration Example

```js
for (const [g, k, v] of sm) {
  console.log(g, k, v);
}
```

## TypeScript

The JSDoc annotations give you intellisense out‑of‑the‑box.  
For strict generics use the alternative definition in the docs:

```ts
class GroupMap<G, K, V> extends Map<G, Map<K, V>> { /* … */ }
```

## Build Notes

This package ships both **ESM** and **CJS** builds with preserved
`@preserve` comments (`esbuild --legal-comments=inline`).

## License

MIT © [randajan](https://github.com/randajan)
