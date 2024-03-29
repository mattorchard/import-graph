import { Doc } from "./DomainHelpers";
import { segmentLines } from "./TextHelpers";

const createDocCondition = (query: string): ((doc: Doc) => boolean) => {
  const querySegments = segmentLines(query);
  if (query.length === 0) return () => true;

  const patterns = querySegments.map((segment) => {
    try {
      return new RegExp(segment, "i");
    } catch {
      console.warn(`Invalid regex, usign literal search`, segment);
      return {
        test: (value: string) => segment.includes(value),
      };
    }
  });
  return (doc) => patterns.some((pattern) => pattern.test(doc.searchTarget));
};

type QueryFields = "start" | "anywhere" | "end";

export type QueryRecord = Record<QueryFields, string>;
export const EmptyQueryRecord: QueryRecord = {
  start: "",
  anywhere: "",
  end: "",
} as const;

export const createWalkFilter = (queries: QueryRecord) => {
  const conditions = new Array<(walk: Doc[]) => boolean>();

  if (queries.start.trim()) {
    const startCondition = createDocCondition(queries.start);
    conditions.push((walk) => walk.length > 0 && startCondition(walk.at(0)!));
  }

  if (queries.end.trim()) {
    const endCondition = createDocCondition(queries.end);
    conditions.push((walk) => walk.length > 0 && endCondition(walk.at(-1)!));
  }

  if (queries.anywhere.trim()) {
    const anywhereCondition = createDocCondition(queries.anywhere);
    conditions.push((walk) => walk.some((doc) => anywhereCondition(doc)));
  }
  if (conditions.length === 0) return null;
  return (walk: Doc[]) => conditions.every((filter) => filter(walk));
};
