import * as React from "react";
import styled from "styled-components";
import * as JSZip from "jszip";
import axios from "axios";
import * as base64js from "base64-js";
import logo from "./assets/logo.svg";
import { colors } from "./styles";
import UploadButton from "./components/UploadButton";
import Button from "./components/Button";
import { pinJsonToIpfs, fetchPinnedFile } from "./helpers/api";
import {
  getFileName,
  getMimeType,
  getBase64ImgSrc,
  isImage
} from "./helpers/utils";
import { addHashToPinned, getPinnedFiles } from "./helpers/localStorage";
import { IFileJson } from "./helpers/types";

const SApp = styled.div`
  text-align: center;
`;

const SHeader = styled.header`
  background-color: rgb(${colors.dark});
  padding: 10px;
  color: rgb(${colors.white});
`;

const SLogo = styled.img`
  margin-top: 20px;
  height: 70px;
`;

const STitle = styled.h3`
  margin: 20px auto;
`;

const SContent = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const SImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  padding: 10px;
  margin: 10px auto;
  & img {
    width: 100%;
  }
`;

class App extends React.Component {
  public state = {
    loading: false,
    images: []
  };
  public componentDidMount() {
    window.JSZip = JSZip;
    window.axios = axios;
  }
  public onLoadPinned = async () => {
    const pinnedFiles = getPinnedFiles();
    console.log("pinnedFiles", pinnedFiles); // tslint:disable-line

    if (pinnedFiles) {
      try {
        await this.setState({ loading: true });
        const files = await Promise.all(
          pinnedFiles.map(async (fileHash: string) => {
            console.log("fileHash", fileHash); // tslint:disable-line
            const { data } = await fetchPinnedFile(fileHash);
            console.log("getPinnedFile data", data); // tslint:disable-line
            return data;
          })
        );
        const images = files.map((fileJson: IFileJson) => {
          const imgSrc = getBase64ImgSrc(fileJson.file, fileJson.mime);
          return imgSrc;
        });
        await this.setState({ loading: false, images });
      } catch (error) {
        await this.setState({ loading: false });
        console.error(error); // tslint:disable-line
      }
    }
  };
  public uploadNewFile = async (name: string, mime: string, file: string) => {
    const now = Date.now();
    const jsonFile = {
      name,
      mime,
      file,
      meta: {
        added: now,
        modified: now,
        keywords: ["image"]
      }
    };
    const result = await pinJsonToIpfs(jsonFile);
    if (result && result.data.IpfsHash) {
      const fileHash = result.data.IpfsHash;
      console.log("fileHash", fileHash); // tslint:disable-line
      addHashToPinned(fileHash);
    }
  };
  public onUpload = async (file: File) => {
    await this.setState({ loading: true });
    const zip = await JSZip.loadAsync(file);
    const imageFilePaths = Object.keys(zip.files).filter(filePath =>
      isImage(filePath)
    );
    const imageFiles = imageFilePaths.map(path => zip.files[path]);
    const images = await Promise.all(
      imageFiles.map(async (imageFile: JSZip.JSZipObject, index: number) => {
        if (index === 0) {
          console.log("imageFile", imageFile); // tslint:disable-line
          const imageName = getFileName(imageFile.name);
          console.log("imageName", imageName); // tslint:disable-line
          const imageArray = await imageFile.async("uint8array");
          console.log("imageArray", imageArray); // tslint:disable-line
          const imageBase64 = base64js.fromByteArray(imageArray);
          console.log("imageBase64", imageBase64); // tslint:disable-line
          const mimeType = getMimeType(imageName);
          console.log("mimeType", mimeType); // tslint:disable-line
          const imageBlob = new Blob([imageArray], { type: mimeType });
          console.log("imageBlob", imageBlob); // tslint:disable-line
          const imageUrl = window.URL.createObjectURL(imageBlob);
          console.log("imageUrl", imageUrl); // tslint:disable-line

          this.uploadNewFile(imageName, mimeType, imageBase64);

          return imageUrl;
        }
        return null;
      })
    );
    await this.setState({ images, loading: false });
  };
  public render() {
    const { loading, images } = this.state;
    return (
      <SApp>
        <SHeader>
          <SLogo src={logo} alt="logo" />
          <STitle>Upload Zip</STitle>
        </SHeader>
        <SContent>
          {!!images.length ? (
            images.map(url => (
              <SImgWrapper key={url}>
                <img src={url} alt={url} />
              </SImgWrapper>
            ))
          ) : (
            <React.Fragment>
              <UploadButton loading={loading} onUpload={this.onUpload}>
                Upload
              </UploadButton>
              <Button loading={loading} onClick={this.onLoadPinned}>
                Load Pinned
              </Button>
            </React.Fragment>
          )}
        </SContent>
      </SApp>
    );
  }
}

export default App;
