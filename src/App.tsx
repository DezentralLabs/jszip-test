import * as React from "react";
import styled from "styled-components";
import * as JSZip from "jszip";
import * as base64js from "base64-js";
import logo from "./assets/logo.svg";
import { colors } from "./styles";
import ImportButton from "./components/ImportButton";
import Image from "./components/Image";
import Button from "./components/Button";
import { pinFile, fetchFile } from "./helpers/api";
import {
  getFileName,
  getMimeType,
  getBase64ImgSrc,
  isImage,
  convertArrayBufferToUtf8
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

class App extends React.Component {
  public state = {
    loading: false,
    images: [],
    selected: []
  };

  public onLoadPinned = async () => {
    const pinnedFiles = getPinnedFiles();

    if (pinnedFiles) {
      try {
        await this.setState({ loading: true });
        const files = await Promise.all(
          pinnedFiles.map(async (fileHash: string) => {
            const result = await fetchFile(fileHash);

            const base64 = result.data.result;
            const dataArrayBuffer = base64js.toByteArray(base64).buffer;
            const dataString = convertArrayBufferToUtf8(dataArrayBuffer);

            let data = null;

            try {
              data = JSON.parse(dataString);
            } catch (error) {
              console.error(error); // tslint:disable-line
            }

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

  public uploadNewFile = async (fileJson: IFileJson) => {
    const result = await pinFile(fileJson);
    if (result && result.data.success) {
      const fileHash = result.data.result;
      console.log("fileHash", fileHash); // tslint:disable-line
      addHashToPinned(fileHash);
    } else {
      console.error("Failed to pin file"); // tslint:disable-line
    }
  };

  public onPick = (image: IFileJson) => {
    console.log("onPick image", image); // tslint:disable-line
    this.setState({ selected: [...this.state.selected, image] });
  };

  public onImport = async (file: File) => {
    await this.setState({ loading: true });
    const zip = await JSZip.loadAsync(file);
    const imageFilePaths = Object.keys(zip.files).filter(filePath =>
      isImage(filePath)
    );
    const imageFiles = imageFilePaths.map(path => zip.files[path]);
    const images = await Promise.all(
      imageFiles.map(async (imageFile: JSZip.JSZipObject, index: number) => {
        const name = getFileName(imageFile.name);
        const data = await imageFile.async("uint8array");
        const file = base64js.fromByteArray(data);
        const mime = getMimeType(name);

        const now = Date.now();
        const fileJson = {
          name,
          mime,
          file,
          meta: {
            added: now,
            modified: now,
            keywords: ["image"]
          }
        };
        return fileJson;
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
            images.map((fileJson: IFileJson) => (
              <Image
                src={getBase64ImgSrc(fileJson.file, fileJson.mime)}
                alt={fileJson.name}
                value={fileJson}
                onPick={this.onPick}
              />
            ))
          ) : (
            <React.Fragment>
              <ImportButton loading={loading} onImport={this.onImport}>
                Import
              </ImportButton>
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
