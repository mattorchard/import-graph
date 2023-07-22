export const countChar = (text: string, searchChar: string) => {
  let count = 0;
  for (const char of text) {
    if (char === searchChar) count += 1;
  }
  return count;
};

export const segmentLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const isValidRegex = (text: string, flags?: string) => {
  try {
    new RegExp(text, flags);
    return true;
  } catch {
    return false;
  }
};
