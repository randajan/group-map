import { MapMap } from "./MapMap";

/**
 * A lightweight grouped `Set` (groupId → value).
 * Useful when you need to bucket unique items into groups but don’t
 * care about a secondary key.
 *
 * ```js
 * const gs = new MapSet();
 * gs.set("tags", "javascript");
 * gs.set("tags", "datastructures");
 * gs.set("categories", "tutorial");
 *
 * for (const [g, v] of gs) console.log(g, v);
 * //→ tags        javascript
 * //  tags        datastructures
 * //  categories  tutorial
 * ```
 */
export class MapSet extends Map {

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
   * Alias for {@link MapSet#valuesOf}. Provided for API symmetry.
   * @param {*} groupId  The group identifier.
   * @returns {IterableIterator<*> | undefined}
    */
  keysOf(groupId) {
    return this.valuesOf(groupId);
  }

  /**
   * Check whether a **value** exists in a given group.
   * @param {*} groupId  The group identifier.
   * @param {*} value    The value to look for.
   * @returns {boolean}  `true` if present, otherwise `false`.
   */
  has(groupId, value) {
    const sub = super.get(groupId);
    return !!sub && sub.has(value);
  }

  /**
   * Add a **value** to a group (creates the group if needed).
   * Chainable like the native `Map#set`.
   * @param {*} groupId  The group identifier.
   * @param {*} value    The value to add.
   * @returns {MapSet}   The map instance, enabling chaining.
   */
  set(groupId, value) {
    let sub = super.get(groupId);
    if (!sub) super.set(groupId, (sub = new Set()));
    sub.add(value);
    return this;
  }

  /**
   * Remove a **value** from a group. If the group becomes empty,
   * the group itself is removed.
   * @param {*} groupId  The group identifier.
   * @param {*} value    The value to remove.
   * @returns {boolean}  `true` if something was deleted, otherwise `false`.
   */
  delete(groupId, value) {
    const sub = super.get(groupId);
    if (!sub) return false;

    const deleted = sub.delete(value);
    if (sub.size === 0) super.delete(groupId);
    return deleted;
  }

  /**
   * Iterate over every `[groupId, value]` pair in the map.
   * Enables:
   * ```js
   * for (const [g, v] of gs) { … }
   * ```
   * @returns {IterableIterator<[*, *]>}
   */
  *[Symbol.iterator]() {
    for (const [groupId, sub] of super.entries()) {
      for (const value of sub.values()) {
        yield [groupId, value];
      }
    }
  }
}
