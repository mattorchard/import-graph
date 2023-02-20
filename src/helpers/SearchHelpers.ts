import { Doc } from "./DomainHelpers";

const createDocCondition = (query: string): ((doc: Doc) => boolean) => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return () => true;

  const regExp = new RegExp(cleanQuery, "i");
  return (doc) => regExp.test(doc.searchTarget);
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
    const middleCondition = createDocCondition(queries.anywhere);
    conditions.push((walk) => walk.some((doc) => middleCondition(doc)));
  }
  if (conditions.length === 0) return null;
  return (walk: Doc[]) => conditions.every((filter) => filter(walk));
};
