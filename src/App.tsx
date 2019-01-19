import * as React from "react";
import styled from "styled-components";
import logo from "./assets/logo.svg";
import { colors, fonts } from "./styles";
import UploadButton from "./components/UploadButton";

const SApp = styled.div`
  text-align: center;
`;

const SAppHeader = styled.header`
  background-color: rgb(${colors.dark});
  padding: 10px;
  color: rgb(${colors.white});
`;

const SAppLogo = styled.img`
  margin-top: 20px;
  height: 70px;
`;

const SAppTitle = styled.h3`
  margin: 20px auto;
`;

const SAppIntro = styled.p`
  margin: 40px auto;
  font-size: ${fonts.size.large};
`;

class App extends React.Component {
  public onUpload() {
    console.log("onUpload"); // tslint:disable-line
  }
  public render() {
    return (
      <SApp>
        <SAppHeader>
          <SAppLogo src={logo} alt="logo" />
          <SAppTitle>Upload Zip</SAppTitle>
        </SAppHeader>
        <SAppIntro>
          <UploadButton onUpload={this.onUpload}>Upload</UploadButton>
        </SAppIntro>
      </SApp>
    );
  }
}

export default App;
