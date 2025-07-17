/**
 * Two‑level Map where each **group** stores an **ordered list** of values in a plain
 * JavaScript `Array` — enabling constant‑time lookup of the *group* and familiar
 * array semantics inside the group.
 *
 * Internally represented as `Map<groupId, V[]>`.
 *
 * ```txt
 *           groupId ─┬───────────┐
 *                     ▼           ▼
 * Map<G, V[]>  ===  Map<groupId, [v1, v2, v3, ...]>
 * ```
 *
 * @template G Type of the group identifier.
 * @template V Type of the stored value.
 *
 * @extends {Map<G, V[]>}
 */
export class MapArray extends Map {
    /**
     * Does the **group** exist?
     *
     * @param {G} groupId
     * @returns {boolean} `true` if the group is present, otherwise `false`.
     */
    has(groupId) {
        return super.has(groupId);
    }

    /**
     * Does the given `value` exist inside the specified `group`?
     *
     * @param {G} groupId
     * @param {V} value
     * @returns {boolean} `true` if `value` is found in the group.
     */
    hasSub(groupId, value) {
        return super.get(groupId)?.includes(value) ?? false;
    }

    /**
     * Are **all** provided `values` present in the `group`?
     *
     * @param {G} groupId
     * @param {...V} values Values to test for membership.
     * @returns {boolean} `true` only if *every* value is found in the group.
     */
    hasAll(groupId, ...values) {
        const sub = super.get(groupId);
        if (!sub) return false;
        return values.every(v => sub.includes(v));
    }

    /**
     * Is **at least one** of the provided `values` present in the `group`?
     *
     * @param {G} groupId
     * @param {...V} values Values to test for membership.
     * @returns {boolean} `true` if *any* value is found in the group.
     */
    hasAny(groupId, ...values) {
        const sub = super.get(groupId);
        if (!sub) return false;
        return values.some(v => sub.includes(v));
    }

    /**
     * Append `values` to the **end** of the array for the given `group`.
     *
     * If the group does **not** exist it will be created.
     *
     * @param {G} groupId
     * @param {...V} values Values to append. _Ignored_ when empty.
     * @returns {this} Reference to the current instance for chaining.
     */
    add(groupId, ...values) {
        if (values.length === 0) { return this; }
        const arr = super.get(groupId);
        if (arr) { arr.push(...values); }
        else { super.set(groupId, [...values]); }
        return this;
    }

    /**
     * Replace the entire array for the given `group` with `values`.
     *
     * Passing **zero** `values` will *delete* the group.
     *
     * @param {G} groupId
     * @param {...V} values New values for the group.
     * @returns {this} Reference to the current instance for chaining.
     */
    set(groupId, ...values) {
        if (values.length !== 0) { return super.set(groupId, [...values]); }
        super.delete(groupId);
        return this;
    }

    /**
     * Remove specific `values` from the `group` (all occurrences).
     *
     * @param {G} groupId
     * @param {...V} values Values to remove.
     * @returns {V[]} Array of actually removed values (empty if none matched).
     */
    delete(groupId, ...values) {
        const removed = [];
        if (values.length === 0) { return removed; }

        const arr = super.get(groupId);
        if (!arr) { return removed; }

        for (const v of values) {
            let idx;
            while ((idx = arr.indexOf(v)) !== -1) {
                arr.splice(idx, 1);
                removed.push(v);
            }
        }
        if (arr.length === 0) { super.delete(groupId); }
        return removed;
    }

    /**
     * Delete the **entire** group and return its previous array of values.
     *
     * @param {G} groupId
     * @returns {V[]} The removed array, or an empty array if the group was absent.
     */
    flush(groupId) {
        const sub = super.get(groupId);
        if (!sub) { return []; }
        super.delete(groupId);
        return sub;
    }

    /**
     * **Generator** yielding *each* value in the specified `group`.
     *
     * Usage:
     * ```js
     * for (const value of mapArray.valuesOf("groupA")) {
     *   console.log(value);
     * }
     * ```
     *
     * @param {G} groupId
     * @returns {IterableIterator<V>} Iterator over the group's values (empty if missing).
     */
    *valuesOf(groupId) {
        const arr = super.get(groupId);
        if (arr) yield* arr;
    }
}

export default MapArray;
