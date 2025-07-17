/**
 * Two‑level Map — group → key → value — enabling constant‑time lookup by
 * `[groupId, keyId]`. Internally, values are stored in nested `Map` instances
 * (`Map<groupId, Map<keyId, value>>`).
 *
 * @template G Type of the group identifier.
 * @template K Type of the item identifier within the group.
 * @template V Type of the stored value.
 *
 * @extends {Map<G, Map<K, V>>}
 */
export class MapMap extends Map {
    /**
     * Check whether the map contains **any** entry for the given group.
     * Equivalent to the native `Map.prototype.has` on the outer map.
     *
     * @param {G} groupId
     * @returns {boolean} `true` if the group exists.
     */
    has(groupId) {
        return super.has(groupId);
    }

    /**
     * Check whether **[groupId, key]** exists in the map.
     *
     * @param {G} groupId
     * @param {K} key
     * @returns {boolean} `true` if a value is stored at that pair.
     */
    hasSub(groupId, key) {
        return super.get(groupId)?.has(key);
    }

    /**
     * Are **all** specified keys present in the given group?
     *
     * @param {G} groupId
     * @param {...K} keys
     * @returns {boolean}
     */
    hasAll(groupId, ...keys) {
        const sub = super.get(groupId);
        if (!sub) { return false; }
        return keys.every(k => sub.has(k));
    }

    /**
     * Does **any** of the provided keys exist in the given group?
     *
     * @param {G} groupId
     * @param {...K} keys
     * @returns {boolean}
     */
    hasAny(groupId, ...keys) {
        const sub = super.get(groupId);
        if (!sub) { return false; }
        return keys.some(k => sub.has(k));
    }

    /**
     * Retrieve the value stored at **[groupId, key]**.
     *
     * @param {G} groupId
     * @param {K} key
     * @returns {V | undefined}
     */
    get(groupId, key) {
        return super.get(groupId)?.get(key);
    }

    /**
     * Get the entire inner map for a group.
     * **Be careful:** mutating the returned map also mutates this instance.
     *
     * @param {G} groupId
     * @returns {Map<K, V> | undefined}
     */
    getAll(groupId) {
        return super.get(groupId);
    }

    /**
     * Store a value at **[groupId, key]**, creating the group if necessary.
     * Chainable like the native `Map#set`.
     *
     * @param {G} groupId   The group identifier.
     * @param {K} key       The item identifier within the group.
     * @param {V} value     The value to store.
     * @returns {MapMap<G, K, V>} Returns itself so calls can be chained.
     */
    set(groupId, key, value) {
        let sub = super.get(groupId);
        if (!sub) { super.set(groupId, (sub = new Map())); }
        sub.set(key, value);
        return this;
    }

    /**
     * Delete one or more keys from a group. When the last key is removed,
     * the entire group is dropped.
     *
     * @param {G} groupId
     * @param {...K} keys  Which keys to delete inside the group.
     * @returns {Map<K, V>} A map of removed items (`key → value`). Empty if
     *                      nothing was deleted.
     */
    delete(groupId, ...keys) {
        const out = new Map();
        if (keys.length === 0) { return out; }

        const sub = super.get(groupId);
        if (!sub) { return out; }

        for (const k of keys) {
            if (!sub.has(k)) { continue; }
            const v = sub.get(k);
            sub.delete(k);
            out.set(k, v);
        }
        if (sub.size === 0) { super.delete(groupId); }
        return out;
    }

    /**
     * Remove **all** keys in a given group and return them.
     *
     * @param {G} groupId
     * @returns {Map<K, V>} The removed inner map, or an empty map if the group
     *                      did not exist.
     */
    flush(groupId) {
        const sub = super.get(groupId);
        if (!sub) { return new Map(); }
        super.delete(groupId);
        return sub;
    }

    /**
     * Get an iterator over **keyIds** inside a given group.
     *
     * @param {G} groupId  The group identifier.
     * @returns {IterableIterator<K> | undefined}
     */
    keysOf(groupId) {
        return super.get(groupId)?.keys();
    }

    /**
     * Get an iterator over **values** inside a given group.
     *
     * @param {G} groupId  The group identifier.
     * @returns {IterableIterator<V> | undefined}
     */
    valuesOf(groupId) {
        return super.get(groupId)?.values();
    }

    /**
     * Get an iterator over `[key, value]` entries inside a given group.
     *
     * @param {G} groupId  The group identifier.
     * @returns {IterableIterator<[K, V]> | undefined}
     */
    entriesOf(groupId) {
        return super.get(groupId)?.entries();
    }
}
