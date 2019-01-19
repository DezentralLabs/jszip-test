import * as React from "react";
import styled, { keyframes } from "styled-components";
import logo from "./assets/logo.svg";
import { colors, fonts } from "./styles";
import Button from "./components/Button";

const logoSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SApp = styled.div`
  text-align: center;
`;

const SAppHeader = styled.header`
  background-color: rgb(${colors.dark});
  padding: 10px;
  color: rgb(${colors.white});
`;

const SAppLogo = styled.img`
  animation: ${logoSpin} infinite 20s linear;
  margin-top: 10px;
  height: 100px;
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
    console.log("clicked"); // tslint:disable-line
  }
  public render() {
    return (
      <SApp>
        <SAppHeader>
          <SAppLogo src={logo} alt="logo" />
          <SAppTitle>Upload Zip</SAppTitle>
        </SAppHeader>
        <SAppIntro>
          <Button onClick={this.onUpload}>Upload</Button>
        </SAppIntro>
      </SApp>
    );
  }
}

export default App;
