import axios, { AxiosInstance } from "axios";
import { IFileJson } from "./types";

const api: AxiosInstance = axios.create({
  baseURL: "https://api.pinata.cloud/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
  }
});

export const pinJsonToIpfs = (fileJson: IFileJson) =>
  api.post("pinning/pinJSONToIPFS", fileJson);

export const fetchPinnedFile = (fileHash: string) =>
  axios.get(`https://ipfs.io/ipfs/${fileHash}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
