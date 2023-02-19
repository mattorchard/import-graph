type ISafeMap<K, V> = Pick<Map<K, V>, "get" | "entries">;

export class SafeMap<K, V> implements ISafeMap<K, V> {
  private readonly map = new Map<K, V>();
  constructor(entries?: Iterable<[K, V]>) {
    if (entries) {
      for (const [key, value] of entries) {
        this.map.set(key, value);
      }
    }
  }
  get(key: K): V {
    if (!this.map.has(key)) throw new Error(`KeyError: missing "${key}"`);
    return this.map.get(key) as V;
  }
  set(key: K, value: V) {
    this.map.set(key, value);
    return this;
  }
  values() {
    return this.map.values();
  }
  entries(): IterableIterator<[K, V]> {
    return this.map.entries();
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}
