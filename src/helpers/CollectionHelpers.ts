export const isOneOf = <T>(filter: Iterable<T>) => {
  const set = new Set(filter);
  return (item: T) => set.has(item);
};

export const isNotOneOf = <T>(filter: Iterable<T>) => {
  const set = new Set(filter);
  return (item: T) => !set.has(item);
};
