/**
 * Two‑level Map where each group is a `Set` of unique values — enabling constant‑time
 * membership checks by `[groupId, value]`.
 *
 * Internally stored as `Map<groupId, Set<value>>`.
 *
 * @template G Type of the group identifier.
 * @template V Type of the stored value.
 *
 * @extends {Map<G, Set<V>>}
 */
export class MapSet extends Map {
    /**
     * Does the **group** exist?
     * @param {G} groupId
     * @returns {boolean}
     */
    has(groupId) {
        return super.has(groupId);
    }

    /**
     * Does a **value** exist inside the given group?
     * @param {G} groupId  The group identifier.
     * @param {V} value    The value to check.
     * @returns {boolean}
     */
    hasSub(groupId, value) {
        return super.get(groupId)?.has(value);
    }

    /**
     * Are **all** values present inside the group?
     * @param {G} groupId
     * @param {...V} values
     * @returns {boolean}
     */
    hasAll(groupId, ...values) {
        const sub = super.get(groupId);
        if (!sub) { return false; }
        return values.every(v => sub.has(v));
    }

    /**
     * Is **any** of the provided values present?
     * @param {G} groupId
     * @param {...V} values
     * @returns {boolean}
     */
    hasAny(groupId, ...values) {
        const sub = super.get(groupId);
        if (!sub) { return false; }
        return values.some(v => sub.has(v));
    }

    /**
     * Add one or more values to the group's set (creates the group if needed).
     * Chainable like the native `Map#set`.
     * @param {G} groupId
     * @param {...V} values
     * @returns {this}
     */
    add(groupId, ...values) {
        if (values.length === 0) { return this; }
        let sub = super.get(groupId);
        if (!sub) { super.set(groupId, (sub = new Set())); }
        for (const v of values) { sub.add(v); }
        return this;
    }

    /**
     * Replace the entire set for a given group.
     * When called with no values it deletes the group.
     * @param {G} groupId
     * @param {...V} values
     * @returns {this}
     */
    set(groupId, ...values) {
        if (values.length !== 0) {
            super.set(groupId, new Set(values));
        } else {
            super.delete(groupId);
        }
        return this;
    }

    /**
     * Remove specific values from a group and return those actually removed.
     * @param {G} groupId
     * @param {...V} values
     * @returns {Set<V>} Set of removed values (empty if nothing matched).
     */
    delete(groupId, ...values) {
        const removed = new Set();
        if (values.length === 0) { return removed; }

        const sub = super.get(groupId);
        if (!sub) { return removed; }

        for (const v of values) {
            if (!sub.has(v)) { continue; }
            sub.delete(v);
            removed.add(v);
        }
        if (sub.size === 0) { super.delete(groupId); }
        return removed;
    }

    /**
     * Remove and return the entire `Set` for a group (empty if the group is missing).
     * @param {G} groupId
     * @returns {Set<V>}
     */
    flush(groupId) {
        const sub = super.get(groupId);
        if (!sub) { return new Set(); }
        super.delete(groupId);
        return sub;
    }

    /**
     * Iterator of all values inside the given group.
     * @param {G} groupId
     * @returns {IterableIterator<V>}
     */
    *valuesOf(groupId) {
        const sub = super.get(groupId);
        if (sub) { yield* sub; }
    }
}

export default MapSet;
