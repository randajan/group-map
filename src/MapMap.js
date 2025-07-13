/**
 * A lightweight two-level `Map` (groupId → keyId → value).
 * Suitable when you need to organise items into named groups
 * but still want constant-time lookup with a pair of keys.
 *
 * ```js
 * const sm = new GroupMap();
 * sm.set("users",   1, { name: "Alice" });
 * sm.set("users",   2, { name: "Bob"   });
 * sm.set("orders", "A42", { total: 99 });
 *
 * for (const [g, k, v] of sm) console.log(g, k, v);
 * //→ users  1   {…}
 * //  users  2   {…}
 * //  orders A42 {…}
 * ```
 */
export class MapMap extends Map {

  /**
   * Get an iterator over **keyIds** inside a given group.
   * @param {*} groupId  The group identifier.
   * @returns {IterableIterator<*> | undefined}  
   *          Iterator of keyIds, or `undefined` if the group doesn’t exist.
   */
  keysOf(groupId) {
    return super.get(groupId)?.keys();
  }

  /**
   * Get an iterator over **values** inside a given group.
   * @param {*} groupId  The group identifier.
   * @returns {IterableIterator<*> | undefined}  
   *          Iterator of values, or `undefined` if the group doesn’t exist.
   */
  valuesOf(groupId) {
    return super.get(groupId)?.values();
  }

  /**
   * Retrieve the entire sub-map for a group.
   * @param {*} groupId  The group identifier.
   * @returns {Map<*, *> | undefined}  
   *          A `Map` of the group’s items, or `undefined` if the group doesn’t exist.
   */
  getAll(groupId) {
    return super.get(groupId);
  }

  /**
   * Retrieve a single value by **groupId** and **keyId**.
   * @param {*} groupId  The group identifier.
   * @param {*} keyId    The item identifier within the group.
   * @returns {*} The stored value, or `undefined` if not found.
   */
  get(groupId, keyId) {
    return super.get(groupId)?.get(keyId);
  }

  /**
   * Check whether a value exists at **groupId / keyId**.
   * @param {*} groupId  The group identifier.
   * @param {*} keyId    The item identifier within the group.
   * @returns {boolean}  `true` if present, otherwise `false`.
   */
  has(groupId, keyId) {
    const sub = super.get(groupId);
    return !!sub && sub.has(keyId);
  }

  /**
   * Store a value at **groupId / keyId** (creates the group if needed).
   * Chainable like the native `Map#set`.
   * @param {*} groupId  The group identifier.
   * @param {*} keyId    The item identifier within the group.
   * @param {*} value    The value to store.
   * @returns {GroupMap} The map instance, enabling chaining.
   */
  set(groupId, keyId, value) {
    let sub = super.get(groupId);
    if (!sub) super.set(groupId, (sub = new Map()));
    sub.set(keyId, value);
    return this;
  }

  /**
   * Delete a value at **groupId / keyId**.  
   * If the group becomes empty, the group itself is removed.
   * @param {*} groupId  The group identifier.
   * @param {*} keyId    The item identifier within the group.
   * @returns {boolean}  `true` if something was deleted, otherwise `false`.
   */
  delete(groupId, keyId) {
    const sub = super.get(groupId);
    if (!sub) return false;

    const deleted = sub.delete(keyId);
    if (sub.size === 0) super.delete(groupId);
    return deleted;
  }

  /**
   * Iterate over every `[groupId, keyId, value]` triple in the map.
   * Enables:
   * ```js
   * for (const [g, k, v] of GroupMap) { … }
   * ```
   * @returns {IterableIterator<[*, *, *]>}
   */
  *[Symbol.iterator]() {
    for (const [groupId, sub] of super.entries()) {
      for (const [keyId, value] of sub.entries()) {
        yield [groupId, keyId, value];
      }
    }
  }
}
