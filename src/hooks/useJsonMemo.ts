import { useMemo } from "preact/hooks";

export const useJsonMemo = <T>(value: T): T =>
  useMemo(() => value, [JSON.stringify(value)]);
