# @randajan/group-map

[![NPM](https://img.shields.io/npm/v/@randajan/group-map.svg)](https://www.npmjs.com/package/@randajan/group-map)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Lightweight two‑level **group → collection → value** data‑structures with a tiny, chainable API.

This package publishes **three focused classes** — `MapMap`, `MapSet`, `MapArray` — each optimised for a different inner collection type, while sharing the same ergonomic, constant‑time group lookup.

---

## TL;DR

| Sub‑path                    | Class      |
| --------------------------- | ---------- |
| `@randajan/group-map/map`   | `MapMap`   |
| `@randajan/group-map/set`   | `MapSet`   |
| `@randajan/group-map/array` | `MapArray` |

Node’s conditional **`exports`** field routes the correct file automatically, so you only need to pick the right sub‑path — *the runtime chooses ESM vs CJS for you*.

---

## Installation

```bash
# npm
npm i @randajan/group-map
# pnpm
yarn add @randajan/group-map
```

---

## Quick Start

### ESM

```js
import { MapMap }   from '@randajan/group-map/map';   // two‑level Map
import { MapSet }   from '@randajan/group-map/set';   // group → Set
import { MapArray } from '@randajan/group-map/array'; // group → Array

const users = new MapMap();
users.set('byId', 1, { name: 'Alice' })
      .set('byId', 2, { name: 'Bob'   });

const tags = new MapSet();
tags.add('post42', 'js', 'node', 'maps');

tags.has('post42', 'node');   // → true

const lines = new MapArray();
lines.add('file.txt', 1, 2, 3);
```

### CommonJS

```js
const { MapArray } = require('@randajan/group-map/array');

const colors = new MapArray();
colors.add('warm', 'red', 'orange');
```

---

## Why Three Classes?

| Class      | Inner collection | Use‑case                                                  |
| ---------- | ---------------- | --------------------------------------------------------- |
| `MapMap`   | `Map`            | Sparse keyed data per group (e.g. `userId → orderId`).    |
| `MapSet`   | `Set`            | Fast membership tests with uniqueness (e.g. tag systems). |
| `MapArray` | `Array`          | Ordered, possibly duplicated items (e.g. log lines).      |

All share:

* **O(1)** lookup of a whole group (`outer.get(groupId)`)
* Chainable mutators mirroring their native counterparts
* Familiar iterators: `.keysOf()`, `.valuesOf()`, `.entriesOf()`

---

## API Surface (Common Subset)

| Method                           | `MapMap` | `MapSet` | `MapArray` | Notes                             |
| -------------------------------- | :------: | :------: | :--------: | --------------------------------- |
| `has(groupId)`                   |     ✅    |     ✅    |      ✅     | Does the group exist?             |
| `has(groupId, subId)` / `hasSub` |     ✅    |     ✅    |      ✅     | Does the pair exist?              |
| `hasAll(groupId, ...ids)`        |     ✅    |     ✅    |      ✅     |                                   |
| `hasAny(groupId, ...ids)`        |     ✅    |     ✅    |      ✅     |                                   |
| `set` / `add`                    |     ✅    |     ✅    |      ✅     | Adds or replaces                  |
| `delete(groupId, ...ids)`        |     ✅    |     ✅    |      ✅     | Returns removed items             |
| `flush(groupId)`                 |     ✅    |     ✅    |      ✅     | Deletes & returns the whole group |
| `keysOf(groupId)`                |     ✅    |    N/A   |     N/A    |                                   |
| `valuesOf(groupId)`              |     ✅    |     ✅    |      ✅     |                                   |

---

## TypeScript

Rich **JSDoc** generics give instant IntelliSense. All classes are declared as

```ts
class MapMap<G, K, V>   extends Map<G, Map<K, V>> {}
class MapSet<G, V>      extends Map<G, Set<V>> {}
class MapArray<G, V>    extends Map<G, V[]> {}
```

You can therefore enjoy native‑like typings without any `*.d.ts` files.

---

## Build Notes

* Dual **CJS / ESM** output compiled with **esbuild**.

---

## License

MIT © [randajan](https://github.com/randajan)
