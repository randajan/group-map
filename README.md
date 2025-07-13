# @randajan/group-map

[![NPM](https://img.shields.io/npm/v/@randajan/group-map.svg)](https://www.npmjs.com/package/@randajan/group-map) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Tiny grouped data structures for Node.js **and** the browser –
> **MapMap** `group → key → value` & **MapSet** `group → value`

---

## Why?

When you find yourself building composite keys (e.g. `"${group}:${key}"`) or manually nesting objects just to keep related items together, **MapMap** & **MapSet** give you a *proper* data structure:

* **Constant-time** lookup
* Familiar, chainable API that mirrors native `Map`/`Set`
* Automatic creation & pruning of empty groups – no housekeeping required

All that in **\~0.6 kB** (min + gzip) with **zero dependencies**.

---

## Features at a glance

|                       | MapMap (two-level `Map`)  | MapSet (grouped `Set`) |
| --------------------- | ------------------------- | ---------------------- |
| Core mapping          | `groupId → keyId → value` | `groupId → value`      |
| Lookup speed          | O(1) via `[g, k]`         | O(1) via `[g, v]`      |
| Chainable `.set()`    | ✔︎                        | ✔︎                     |
| Iterator output       | `[g, k, v]`               | `[g, v]`               |
| Auto-create groups    | ✔︎                        | ✔︎                     |
| Auto-delete empty grp | ✔︎                        | ✔︎                     |
| Native methods kept   | All `Map` helpers         | All `Map` helpers      |

---

## Installation

```bash
npm i @randajan/group-map
# or
yarn add @randajan/group-map
```

---

## Quick Start

```js
import { MapMap, MapSet } from '@randajan/group-map';

// 1. MapMap – two keys
const orders = new MapMap();
orders
  .set('pending',   101, { total: 49 })
  .set('pending',   102, { total: 99 })
  .set('completed', 103, { total: 79 });

console.log(orders.get('pending', 102)); // → { total: 99 }

// 2. MapSet – grouped unique values
const tags = new MapSet();
tags
  .set('post-42', 'javascript')
  .set('post-42', 'datastructures')
  .set('post-17', 'tutorial');

for (const [group, value] of tags) {
  console.log(group, value);
}
// → post-42 javascript
//   post-42 datastructures
//   post-17 tutorial
```

> **Tip:** In CommonJS just `const { MapMap, MapSet } = require('@randajan/group-map')` – the API is identical.

---

## API Reference

### MapMap methods

| Method                       | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `keysOf(groupId)`            | Iterator of **keyId** values within the group.        |
| `valuesOf(groupId)`          | Iterator of stored values within the group.           |
| `getAll(groupId)`            | Returns the inner `Map<keyId, value>` or `undefined`. |
| `get(groupId, keyId)`        | Returns a single value or `undefined`.                |
| `has(groupId, keyId)`        | `true` if the pair exists.                            |
| `set(groupId, keyId, value)` | Stores a value, returns `this`.                       |
| `delete(groupId, keyId)`     | Removes the entry; deletes the group when empty.      |
| `[Symbol.iterator]()`        | Yields `[groupId, keyId, value]` for every entry.     |

### MapSet methods

| Method                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `valuesOf(groupId)`      | Iterator of **values** within the group.         |
| `keysOf(groupId)`        | Alias for `valuesOf` – for API symmetry.         |
| `has(groupId, value)`    | `true` if the value exists in the group.         |
| `set(groupId, value)`    | Adds the value to the group, returns `this`.     |
| `delete(groupId, value)` | Removes the value; deletes the group when empty. |
| `[Symbol.iterator]()`    | Yields `[groupId, value]` for every entry.       |

> All other native **`Map`** methods (`size`, `forEach`, `entries`, …) still work on both classes.

---

## TypeScript

The bundled JSDoc gives you IntelliSense out of the box. For strict, generic typings you can copy these signatures into your code-base:

```ts
// Two-level Map
declare class MapMap<G, K, V> extends Map<G, Map<K, V>> {}

// Grouped Set
declare class MapSet<G, V> extends Map<G, Set<V>> {}
```

---

## Build Notes

This package ships both **ESM** and **CJS** bundles with preserved `@preserve` comments (`esbuild --legal-comments=inline`).

---

## License

MIT © [randajan](https://github.com/randajan)
