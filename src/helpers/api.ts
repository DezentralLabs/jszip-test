import axios, { AxiosInstance } from "axios";
import { IFileJson } from "./types";

const api: AxiosInstance = axios.create({
  baseURL: "https://simple-ipfs-proxy-zyjcjjhlbb.now.sh",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const pinFile = (fileJson: IFileJson) => api.post("/pin", fileJson);

export const fetchFile = (fileHash: string) =>
  api.get(`/ipfs/${fileHash}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
