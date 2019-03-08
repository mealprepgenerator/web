import * as React from "react";

import { Input, Subtitle } from "bloomer";

export interface LabelProps {
  children: string;
  onEdit?(value: string): void;
}

class Label extends React.Component<LabelProps> {
  public state = {
    showInput: false,
    value: ""
  };

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && this.props.onEdit) {
      this.props.onEdit(this.state.value);
      this.setState({ showInput: false });
    }
  };

  public onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ value: e.target.value });

  public onClick = () => {
    const { showInput } = this.state;
    if (showInput) {
      return;
    }

    this.setState({ showInput: true });
  };

  public onBlur = () => this.setState({ showInput: false });

  public renderContent() {
    const { children: value } = this.props;

    if (this.state.showInput) {
      return (
        <Input
          defaultValue={value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          autoFocus={true}
          onKeyPress={this.onKeyPress}
        />
      );
    }

    return <Subtitle>{value}</Subtitle>;
  }

  public render() {
    return (
      <div className="editable" onClick={this.onClick}>
        {this.renderContent()}
      </div>
    );
  }
}

export default Label;
