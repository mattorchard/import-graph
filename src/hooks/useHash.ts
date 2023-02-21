import { useCallback, useEffect, useState } from "preact/hooks";

const getHash = () => (window.location.hash || "").replace(/^#/, "");

export const useHash = () => {
  const [hash, setHashState] = useState(getHash);
  const setHash = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);
  useEffect(() => {
    const handleHashChange = () => setHashState(getHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  });
  return [hash, setHash] as const;
};
