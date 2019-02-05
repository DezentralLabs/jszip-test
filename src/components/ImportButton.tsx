import * as React from "react";

import Button from "./Button";

class ImportButton extends React.Component<any, any> {
  public inputRef: React.RefObject<HTMLInputElement>;

  set input(value: any) {
    return;
  }

  get input() {
    const _input: HTMLInputElement | null =
      this.inputRef && this.inputRef.current ? this.inputRef.current : null;
    return _input;
  }

  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef();
  }

  public onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.input && event.target.files) {
      const file = event.target.files[0];
      this.props.onImport(file);
    }
  };

  public onClick = () => {
    if (this.input) {
      this.input.click();
    }
  };
  public render() {
    const { onImport, loading, ...props } = this.props;
    return (
      <>
        <input
          type="file"
          accept="application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream"
          ref={this.inputRef}
          style={{ display: "none" }}
          onChange={this.onImport}
        />
        <Button loading={loading} onClick={this.onClick} {...props}>
          Upload Zip
        </Button>
      </>
    );
  }
}

export default ImportButton;
