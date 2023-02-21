import { useHash } from "./useHash";

export const pages = ["chains", "graph", "files"] as const;

type Page = typeof pages[number];

export const usePage = (): [Page, (page: Page) => void] => {
  const [rawHash, setHash] = useHash();
  const page = pages.includes(rawHash as typeof pages[number])
    ? (rawHash as Page)
    : "chains";
  return [page, setHash];
};
