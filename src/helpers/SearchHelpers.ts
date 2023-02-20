import { Doc } from "./DomainHelpers";

const escapeRegExp = (text: string) =>
  text.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

const fullMatch = (pattern: string) => `^${pattern}$`;

const createDocCondition = (query: string): ((doc: Doc) => boolean) => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return () => true;

  const containsWildCard = query.includes("*");
  const containsSlashes = query.includes("/");

  if (!containsWildCard && !containsSlashes) {
    return (doc) => doc.path.at(-1)?.toLowerCase() === cleanQuery;
  }

  if (containsWildCard && !containsSlashes) {
    const regExp = new RegExp(
      fullMatch(escapeRegExp(cleanQuery).replaceAll("*", ".*")),
      "i"
    );
    return (doc) => doc.path.length > 0 && regExp.test(doc.path.at(-1)!);
  }

  throw new Error(`Not yet implemented`);

  return () => true;
};

type QueryFields = "start" | "middle" | "end";

export type QueryRecord = Record<QueryFields, string>;

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

  if (queries.middle.trim()) {
    const middleCondition = createDocCondition(queries.middle);
    conditions.push((walk) =>
      walk.slice(1, -1).some((doc) => middleCondition(doc))
    );
  }
  if (conditions.length === 0) return null;
  return (walk: Doc[]) => conditions.every((filter) => filter(walk));
};
