export const saveLocal = (key: string = "", data: any) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
};

export const getLocal = (key: string = ""): any | null => {
  const local = localStorage.getItem(key);
  if (local) {
    try {
      const json = JSON.parse(local);
      return json;
    } catch (error) {
      throw error;
    }
  }
  return null;
};

export const removeLocal = (key: string = ""): void =>
  localStorage.removeItem(key);

// PINATA PINNED FILES ON IPFS

const localStorageId = "PINATA_PINNED_FILES";

export const getPinnedFiles = () => getLocal(localStorageId);

export const addHashToPinned = (hash: string) => {
  const pinnedFiles = getLocal(localStorageId);
  const newPinnedFiles = pinnedFiles ? [...pinnedFiles, hash] : [hash];
  saveLocal(localStorageId, newPinnedFiles);
};

export const removeHashFromPinned = (hash: string) => {
  const pinnedFiles = getLocal(localStorageId);
  if (pinnedFiles) {
    const newPinnedFiles = pinnedFiles.filter((file: string) => file !== hash);
    saveLocal(localStorageId, newPinnedFiles);
  }
};
