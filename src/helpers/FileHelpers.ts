export const getFileExtension = (fileName: string) => {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot < 0) return null;
  return fileName.substring(lastDot + 1).toLowerCase();
};

export const removeFileExtension = (fileName: string) => {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot < 0) return fileName;
  return fileName.substring(0, lastDot);
};

export const readBlob = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Unable to read file`));
    reader.onabort = () => reject(new Error(`Unable to read file`));
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error(`File not able to be read as text`));
    reader.readAsText(blob);
  });
