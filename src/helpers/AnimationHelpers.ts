export const createRafLoop = (callback: () => void) => {
  let isCancelled = false;

  const handleAnimationFrame = () => {
    if (isCancelled) return;
    requestAnimationFrame(handleAnimationFrame);
    callback();
  };

  requestAnimationFrame(handleAnimationFrame);

  return () => {
    isCancelled = true;
  };
};
