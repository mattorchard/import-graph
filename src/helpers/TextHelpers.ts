export const countChar = (text: string, searchChar: string) => {
  let count = 0;
  for (const char of text) {
    if (char === searchChar) count += 1;
  }
  return count;
};
