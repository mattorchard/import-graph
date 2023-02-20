import { useCallback, useState } from "preact/hooks";

export const useScrollState = () => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const onScroll = useCallback((event: Event) => {
    const element = event.currentTarget;
    if (!(element instanceof HTMLElement)) return;
    const newScroll = { x: element.scrollLeft, y: element.scrollTop };
    setScroll((oldScroll) =>
      oldScroll.x === newScroll.x && oldScroll.y === newScroll.y
        ? oldScroll
        : newScroll
    );
  }, []);
  return [scroll, onScroll] as const;
};
