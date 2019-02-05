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

export function getBase64ImgSrc(base64: string, mime: string) {
  const prefix = `data:${mime};base64,`;
  const imgSrc = `${prefix}${base64}`;
  return imgSrc;
}

export function convertArrayBufferToUtf8(arrayBuffer: ArrayBuffer): string {
  const array: Uint8Array = new Uint8Array(arrayBuffer);
  const chars: string[] = [];
  let i: number = 0;

  while (i < array.length) {
    const byte: number = array[i];
    if (byte < 128) {
      chars.push(String.fromCharCode(byte));
      i++;
    } else if (byte > 191 && byte < 224) {
      chars.push(
        String.fromCharCode(((byte & 0x1f) << 6) | (array[i + 1] & 0x3f))
      );
      i += 2;
    } else {
      chars.push(
        String.fromCharCode(
          ((byte & 0x0f) << 12) |
            ((array[i + 1] & 0x3f) << 6) |
            (array[i + 2] & 0x3f)
        )
      );
      i += 3;
    }
  }

  const utf8: string = chars.join("");
  return utf8;
}

export function convertUtf8ToArrayBuffer(utf8: string): ArrayBuffer {
  const bytes: number[] = [];

  let i = 0;
  utf8 = encodeURI(utf8);
  while (i < utf8.length) {
    const byte: number = utf8.charCodeAt(i++);
    if (byte === 37) {
      bytes.push(parseInt(utf8.substr(i, 2), 16));
      i += 2;
    } else {
      bytes.push(byte);
    }
  }

  const array: Uint8Array = new Uint8Array(bytes);
  const arrayBuffer: ArrayBuffer = array.buffer;
  return arrayBuffer;
}

export function isImage(filePath: string) {
  return /\.(jpe?g|png|gif|bmp)$/i.test(filePath);
}
