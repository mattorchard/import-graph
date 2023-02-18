export const prettyJson = (value: any) =>
  JSON.stringify(
    value,
    (key, value) => {
      if (value instanceof Map)
        return {
          type: "[object Map]",
          value: Object.fromEntries(value.entries()),
        };
      if (value instanceof Set)
        return {
          type: "[object Set]",
          value: [...value],
        };
      return value;
    },
    2
  );
