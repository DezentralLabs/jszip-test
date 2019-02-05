import * as React from "react";
import styled from "styled-components";
import { colors, transitions } from "../styles";

const SHoverLayer = styled.div`
  transition: ${transitions.button};
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(${colors.white}, 0.1);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
`;

interface IImgWrapperStyleProps {
  selected: boolean;
}

const SImgWrapperStyleTypes = styled.div<IImgWrapperStyleProps>``;
const SImgWrapper = styled(SImgWrapperStyleTypes)`
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

  ${SHoverLayer} {
    opacity: ${({ selected }) => (selected ? 1 : 0)};
    visibility: ${({ selected }) => (selected ? "visible" : "hidden")};
  }
`;

class Image extends React.Component<any, any> {
  public state = {
    selected: false
  };

  public onClick = async () => {
    await this.setState({ selected: !this.state.selected });
    this.props.onPick(this.props.value);
  };
  public render() {
    const { src, alt, ...props } = this.props;
    return (
      <SImgWrapper selected={this.state.selected} {...props}>
        <SHoverLayer />
        <img src={src} alt={alt} onClick={this.onClick} />
      </SImgWrapper>
    );
  }
}

export default Image;
