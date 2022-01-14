import React from "react";
import moment from "moment";
import Month from "./Month";
import { range } from "./utils";
import "moment/locale/ro";
import "./calendar.css"

interface CalendarProps {
  year: number;
  forceFullWeeks: boolean;
  showDaysOfWeek: boolean;
  showWeekSeparators: boolean;
  firstDayOfWeek: number;
  selectRange: boolean;
  selectedRange: any;
  onPickDate: null | ((val1: any, val2: any) => void);
  onPickRange: null | ((val1: any, val2: any) => void);
  selectedDay: any;
  dayIsDisabled: null | ((day: any) => boolean);
  dayIsBlocked: null | ((day: any) => boolean);
  dayEnable: null | ((day: any) => void);
  customClasses: any | (() => boolean);
}

interface CalnedarState {
  selectingRange: any;
}

export class Calendar extends React.Component<CalendarProps, CalnedarState> {

  static defaultProps: any = {
    forceFullWeeks: false,
    showDaysOfWeek: true,
    showWeekSeparators: true,
    firstDayOfWeek: 0,
    selectRange: false,
    onPickDate: null,
    onPickRange: null,
    selectedDay: null,
    customClasses: null
  };

  constructor(props: CalendarProps) {
    super(props);
    this.state = {
      selectingRange: undefined
    };
  }

  dayClicked(date: any, classes: any): void {
    if (!date) {
      return;
    }

    let selectingRange: any = this.state.selectingRange;
    let selectRange: any = this.props.selectRange;
    let onPickRange: any = this.props.onPickRange;
    let onPickDate: any = this.props.onPickDate;

    if (!selectRange) {
      if (onPickDate instanceof Function) {
        onPickDate(date, classes);
      }
      return;
    }

    if (!selectingRange) {
      selectingRange = [date, date];
    } else {
      if (selectingRange[0].isSame(date)) {
        onPickRange(date, selectingRange[0])
      } else if (onPickRange instanceof Function) {
        if (selectingRange[0] > date) {
          onPickRange(date, selectingRange[0]);
        } else {
          onPickRange(selectingRange[0], date);
        }
      }
      selectingRange = undefined;
    }

    this.setState({
      selectingRange
    });
  }

  dayIsDisabled(day: any): void {
    let dayIsDisabled: any = this.props.dayIsDisabled;
    dayIsDisabled(day);
  }

  dayIsBlocked(day: any): void {
    let dayIsBlocked: any = this.props.dayIsBlocked;
    dayIsBlocked(day);
  }

  dayEnable(day: any): void {
    if (this.state.selectingRange == null) {
      let dayEnable: any = this.props.dayEnable;
      dayEnable(day);
    }
  }

  dayHovered(hoveredDay: any): void {
    if (!hoveredDay) {
      // clicked on prev or next month
      return;
    }

    let selectingRange: any = this.state.selectingRange;

    if (selectingRange) {
      selectingRange[1] = hoveredDay;

      this.setState({
        selectingRange
      });
    }
  }

  renderDaysOfWeek(): JSX.Element {
    let firstDayOfWeek: any = this.props.firstDayOfWeek;
    let forceFullWeeks: any = this.props.forceFullWeeks;
    let showWeekSeparators: any = this.props.showWeekSeparators;
    const totalDays: any = forceFullWeeks ? 42 : 37;

    const days: any = [];
    range(firstDayOfWeek, totalDays + firstDayOfWeek).forEach((i: number) => {
      const day: any = moment()
        .weekday(i)
        .format("dd")
        .charAt(0);

      if (showWeekSeparators) {
        if (i % 7 === firstDayOfWeek && days.length) {
          // push week separator
          days.push(<th className="week-separator" key={"seperator-" + i} />);
        }
      }
      days.push(
        <th key={`weekday-${i}`} className={i % 7 === 0 ? "bolder" : ""}>
          {day}
        </th>
      );
    });

    return (
      <tr>
        <th>&nbsp;</th>
        {days}
      </tr>
    );
  }

  render(): React.ReactNode {
    let selectingRange: any = this.state.selectingRange;

    const months: any = range(0, 12).map((month: any) => (
      <Month
        month={month}
        key={"month-$" + month}
        dayClicked={(d: any, classes: any) => this.dayClicked(d, classes)}
        dayHovered={(d: any) => this.dayHovered(d)}
        dayIsDisabled={(d: any) => this.dayIsDisabled(d)}
        dayIsBlocked={(d: any) => this.dayIsBlocked(d)}
        dayEnableClick={(d: any) => this.dayEnable(d)}
        {...this.props}
        selectingRange={selectingRange}
      />
    ));

    return (
      <table className="calendar">
        <thead className="day-headers">{this.props.showDaysOfWeek ? this.renderDaysOfWeek() : null}</thead>
        <tbody>{months}</tbody>
      </table>
    );
  }
}