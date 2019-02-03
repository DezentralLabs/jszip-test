import { mimeTypes } from "./constants";

export function getFileName(filePath: string) {
  const fileName = filePath.replace(/^.*[\\\/]/, "");
  if (fileName) {
    return fileName;
  }
  return "";
}

export function getFileExtension(fileName: string) {
  const regex = /(?:\.([^.]+))?$/;
  const fileExtension = regex.exec(fileName); // "txt"
  if (fileExtension && fileExtension[1]) {
    return fileExtension[1];
  }
  return "";
}

export function getMimeType(fileName: string) {
  const fileExtension = getFileExtension(fileName);
  const mimeType = mimeTypes[fileExtension];
  if (mimeType) {
    return mimeType;
  }
  return "";
}

export function getBase64ImgSrc(base64: string) {
  const prefix = `data:image/png;base64,`;
  const imgSrc = `${prefix}${base64}`;
  return imgSrc;
}
