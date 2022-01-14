import React from "react";

interface CalendarControlsProps {
  year: number;
  maxYear?: number;
  minYear?: number;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  goToToday?: () => void;
  showTodayButton: boolean;
}

export class CalendarControls extends React.Component<CalendarControlsProps, {}> {


  render(): React.ReactNode {
    let todayButton: JSX.Element | undefined;
    if (this.props.showTodayButton) {
      todayButton = (
        <div style={{
          position: "absolute",
          right: "15px",
          lineHeight: "35px",
          fontSize: "0.6em",
          textTransform: "uppercase",
        }} /*className="control today" */ onClick={() => this.goToTodayClick()}>
          Today
          </div>
      );
    }

    let prevYear: JSX.Element | undefined;
    if (this.props.minYear == null || this.props.minYear < this.props.year) {
      prevYear = (
        <div className="control" onClick={() => this.onPrevYearClick()}>
          &laquo;
      </div>
      );
    }
    let nextYear: JSX.Element | undefined;
    if (this.props.maxYear == null || this.props.maxYear > this.props.year) {
      nextYear = (
        <div className="control" onClick={() => this.onNextYearClick()}>
          &raquo;
        </div>
      );
    }

    return (
      <div>
        <div className="calendar-controls">
          {prevYear}
          <div className="current-year">{this.props.year}</div>
          {nextYear}
        </div>
        {todayButton}
      </div>
    );
  }

  private goToTodayClick(): void {
    if (this.props.goToToday != null) {
      this.props.goToToday();
    }
  }

  private onPrevYearClick(): void {
    if (this.props.onPrevYear != null) {
      this.props.onPrevYear();
    }
  }

  private onNextYearClick(): void {
    if (this.props.onNextYear != null) {
      this.props.onNextYear();
    }
  }
}