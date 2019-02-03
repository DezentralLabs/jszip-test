export interface IFileMeta {
  added: number;
  modified: number;
  keywords: string[];
}

export interface IFileJson {
  name: string;
  mime: string;
  file: string;
  meta: IFileMeta;
}
