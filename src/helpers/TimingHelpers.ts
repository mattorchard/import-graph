export const createDebounced = <ArgsType extends unknown[]>(
  callback: (...args: ArgsType) => void,
  delay: number
) => {
  let timeoutId: number | null = null;
  return {
    debounced: (...args: ArgsType) => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback(...args), delay);
    },
    immediate: (...args: ArgsType) => {
      if (timeoutId) window.clearTimeout(timeoutId);
      callback(...args);
    },
  };
};
