import React from "react";

interface DayProps {
  classes: string | undefined;
  dayClicked: (day: any) => void;
  dayHovered: (day: any) => void;
  dayEnableClick: (day: any) => void;
  day: any | null;
  disabled: boolean;
  blocked: boolean;
}

export default class Day extends React.Component<DayProps, {}> {
  constructor(props: DayProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onHover = this.onHover.bind(this);
    this.dayEnableClick = this.dayEnableClick.bind(this);
  }

  onClick(): void {
    this.props.dayClicked(this.props.day);
  }

  dayEnableClick(): void {
    this.props.dayEnableClick(this.props.day);
  }

  onHover(): void {
    this.props.dayHovered(this.props.day);
  }

  render(): React.ReactNode {
    return (
      <td onClick={this.props.blocked ?  undefined : (this.props.disabled ? this.dayEnableClick : this.onClick)} 
      onMouseEnter={this.props.blocked ?  undefined :  (this.props.disabled ? undefined : this.onHover)}
        className={(this.props.classes != null ? this.props.classes : "") + (this.props.disabled ? " disabled " : "") + (this.props.blocked ? " blocked " : "")}>
        <span className="day-number">{this.props.day === null ? "" : this.props.day.date()}</span>
      </td>
    );
  }
}
