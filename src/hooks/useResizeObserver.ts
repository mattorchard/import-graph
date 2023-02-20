import { Ref, useEffect, useLayoutEffect, useState } from "preact/hooks";

const getSize = (element: HTMLElement) => {
  const { width, height } = element.getBoundingClientRect();
  return { width, height };
};

export const useResizeObserver = (ref: Ref<HTMLElement>) => {
  const [size, setSize] = useState(() =>
    ref.current ? getSize(ref.current) : { width: 0, height: 0 }
  );
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return () => {};
    const observer = new ResizeObserver(() => setSize(getSize(element)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return size;
};
