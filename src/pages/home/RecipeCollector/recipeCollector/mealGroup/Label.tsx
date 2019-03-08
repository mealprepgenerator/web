import * as React from "react";

import { Input, Subtitle } from "bloomer";

export interface LabelProps {
  children: string;
  onEdit?(value: string): void;
}

export interface LabelState {
  showColor: boolean;
  showInput: boolean;
  value: string;
}

class Label extends React.Component<LabelProps, LabelState> {
  constructor(props: LabelProps) {
    super(props);

    this.state = {
      showColor: false,
      showInput: false,
      value: props.children
    };
  }

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && this.props.onEdit && this.state.value) {
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

  public onHover = () => this.setState({ showColor: true });

  public onLeave = () => this.setState({ showColor: false });

  public onBlur = () => this.setState({ showInput: false });

  public renderContent() {
    const { children: value } = this.props;

    if (this.state.showInput) {
      return (
        <Input
          defaultValue={value}
          onBlur={this.onBlur}
          isColor={this.state.value.length === 0 ? "danger" : undefined}
          onChange={this.onChange}
          maxLength={20}
          autoFocus={true}
          onKeyPress={this.onKeyPress}
        />
      );
    }

    const { showColor } = this.state;
    return (
      <Subtitle hasTextColor={showColor ? "info" : "dark"}>{value}</Subtitle>
    );
  }

  public render() {
    return (
      <div
        className="editable"
        onClick={this.onClick}
        onMouseOver={this.onHover}
        onMouseLeave={this.onLeave}
      >
        {this.renderContent()}
      </div>
    );
  }
}

export default Label;
