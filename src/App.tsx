import * as React from "react";
import styled from "styled-components";
import * as JSZip from "jszip";
import logo from "./assets/logo.svg";
import { colors } from "./styles";
import UploadButton from "./components/UploadButton";

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
  }
  public onUpload = async (file: File) => {
    await this.setState({ loading: true });
    const zip = await JSZip.loadAsync(file);
    const imageFilePaths = Object.keys(zip.files).filter(key =>
      key.endsWith(".jpg")
    );
    const imageFiles = imageFilePaths.map(path => zip.files[path]);
    const images = await Promise.all(
      imageFiles.map(async (imageFile: JSZip.JSZipObject) => {
        const imageArray = await imageFile.async("uint8array");
        const imageBlob = new Blob([imageArray], { type: "image/jpeg" });
        const imageUrl = window.URL.createObjectURL(imageBlob);
        return imageUrl;
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
            <UploadButton loading={loading} onUpload={this.onUpload}>
              Upload
            </UploadButton>
          )}
        </SContent>
      </SApp>
    );
  }
}

export default App;
