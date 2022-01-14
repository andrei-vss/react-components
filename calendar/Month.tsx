// tslint:disable: no-any

import React from "react";
import moment from "moment";
import Day from "./Day";
import { range } from "./utils";

export interface MonthState {
  selectingRangeStart: any;
  selectingRangeEnd: any;
}

export interface MonthProps {
  year: any;
  month: any;
  forceFullWeeks: boolean;
  showWeekSeparators: boolean;
  selectedDay: any;
  firstDayOfWeek: number;
  selectingRange?: any;
  selectRange: boolean;
  selectedRange?: any;
  customClasses?: any | (() => boolean);
  dayClicked: any;
  dayHovered: any;
  dayEnableClick: any;
  dayIsDisabled: any;
  dayIsBlocked: any;
}



export default class Month extends React.Component<MonthProps, MonthState> {
  static defaultProps: any = {
    selectingRange: undefined,
    selectedRange: undefined,
    customClasses: undefined
  };

  constructor(props: MonthProps) {
    super(props);

    this.state = {
      selectingRangeStart: undefined,
      selectingRangeEnd: undefined,
    };
  }

  shouldComponentUpdate(nextProps: any): boolean {
    let month: any = this.props.month;
    let selectingRange: any = this.props.selectingRange;
    let selectedRange: any = this.props.selectedRange;

    let selectingRangeStart: any = this.state.selectingRangeStart;
    let selectingRangeEnd: any = this.state.selectingRangeEnd;

    // full repaint for some global-affecting rendering props
    if (
      this.props.year !== nextProps.year ||
      this.props.forceFullWeeks !== nextProps.forceFullWeeks ||
      this.props.showWeekSeparators !== nextProps.showWeekSeparators ||
      this.props.firstDayOfWeek !== nextProps.firstDayOfWeek ||
      this.props.selectRange !== nextProps.selectRange ||
      this.props.customClasses !== nextProps.customClasses ||
      (this.props.selectRange && selectingRange === undefined && nextProps.selectingRange === undefined)
    ) {
      return true;
    }

    // if we get to this point and we are in 'selectRange' mode then it's likely that we have a change in selectingRange
    if (this.props.selectRange) {
      if (selectingRange === undefined && selectedRange !== undefined) {
        // tslint:disable: no-shadowed-variable
        let oldRangeStart: any = selectedRange[0].month();
        let oldRangeEnd: any = selectedRange[1].month();
        if (oldRangeStart > oldRangeEnd) {
          [oldRangeStart, oldRangeEnd] = [oldRangeEnd, oldRangeStart];
        }

        let newRangeStart: any = nextProps.selectingRange[0].month();
        let newRangeEnd: any = nextProps.selectingRange[1].month();
        if (newRangeStart > newRangeEnd) {
          [newRangeStart, newRangeEnd] = [newRangeEnd, newRangeStart];
        }

        // first time it's called, repaint months in old selectedRange and next selectingRange
        return (oldRangeStart <= month && month <= oldRangeEnd) || (newRangeStart <= month && month <= newRangeEnd);
      } else if (nextProps.selectingRange === undefined) {
        // last time it's called, repaint months in previous selectingRange
        let oldRangeStart: any = selectingRangeStart;
        let oldRangeEnd: any = selectingRangeEnd;
        if (oldRangeStart > oldRangeEnd) {
          [oldRangeStart, oldRangeEnd] = [oldRangeEnd, oldRangeStart];
        }

        let newRangeStart: any = nextProps.selectedRange[0].month();
        let newRangeEnd: any = nextProps.selectedRange[1].month();
        if (newRangeStart > newRangeEnd) {
          [newRangeStart, newRangeEnd] = [newRangeEnd, newRangeStart];
        }

        // called on day hovering changed
        return (oldRangeStart <= month && month <= oldRangeEnd) || (newRangeStart <= month && month <= newRangeEnd);
      }
      // called on day hovering changed
      let oldRangeStart: any = selectingRangeStart;
      let oldRangeEnd: any = selectingRangeEnd;
      if (oldRangeStart > oldRangeEnd) {
        [oldRangeStart, oldRangeEnd] = [oldRangeEnd, oldRangeStart];
      }

      let newRangeStart: any = nextProps.selectingRange[0].month();
      let newRangeEnd: any = nextProps.selectingRange[1].month();
      if (newRangeStart > newRangeEnd) {
        [newRangeStart, newRangeEnd] = [newRangeEnd, newRangeStart];
      }

      return (oldRangeStart <= month && month <= oldRangeEnd) || (newRangeStart <= month && month <= newRangeEnd);
    } else if (this.props.selectedDay.month() === month || nextProps.selectedDay.month() === month) {
      // single selectedDay changed: repaint months where selectedDay was and where will be
      return true;
    }

    return false;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: any): void {
    if (nextProps.selectingRange !== undefined) {
      this.setState({
        selectingRangeStart: nextProps.selectingRange[0].month(),
        selectingRangeEnd: nextProps.selectingRange[1].month()
      });
    }
  }

  dayClicked(day: any, classes: any): any {
    let dayClicked: any = this.props.dayClicked;
    dayClicked(day, classes);
  }

  dayEnable(day: any): any {
    let dayEnable: any = this.props.dayEnableClick;
    dayEnable(day);
  }

  dayHovered(day: any): any {
    let selectRange: any = this.props.selectRange;
    let dayHovered: any = this.props.dayHovered;
    let dayIsDisabled: any = this.props.dayIsDisabled;
    let dayClicked: any = this.props.dayClicked;
    let dayIsBlocked: any = this.props.dayIsBlocked;
    if (dayIsBlocked(day)) {
      return;
    }
    if (selectRange) {
      if (dayIsDisabled(day)) {
        dayClicked(day);
        return;
      }
      dayHovered(day);
    }
  }

  renderMonthDays(): JSX.Element {
    let year: any = this.props.year;
    let month: any = this.props.month;
    let forceFullWeeks: any = this.props.forceFullWeeks;
    let showWeekSeparators: any = this.props.showWeekSeparators;
    let selectedDay: any = this.props.selectedDay;
    let firstDayOfWeek: any = this.props.firstDayOfWeek;
    let selectingRange: any = this.props.selectingRange;
    let selectRange: any = this.props.selectRange;
    let selectedRange: any = this.props.selectedRange;
    let customClasses: any = this.props.customClasses;

    let monthStart: any = moment([year, month, 1]); // current day

    // number of days to insert before the first of the month to correctly align the weekdays
    let prevMonthDaysCount: any = monthStart.weekday();
    while (prevMonthDaysCount < firstDayOfWeek) {
      prevMonthDaysCount += 7;
    }
    // days in month
    const numberOfDays: any = monthStart.daysInMonth();
    // insert days at the end to match up 37 (max number of days in a month + 6)
    // or 42 (if user prefers seeing the week closing with Sunday)
    const totalDays: any = forceFullWeeks ? 42 : 37;

    // day-generating loop
    const days: any = [];
    range(firstDayOfWeek + 1, totalDays + firstDayOfWeek + 1).forEach((i: number) => {
      const day: any = moment([year, month, i - prevMonthDaysCount]);

      // pick appropriate classes
      const classes: any = [];
      if (i <= prevMonthDaysCount) {
        classes.push("prev-month");
      } else if (i > numberOfDays + prevMonthDaysCount) {
        classes.push("next-month");
      } else {
        if (selectRange && selectingRange != undefined) {
          // selectingRange is used while user is selecting a range
          // (has clicked on start day, and is hovering end day - but not yet clicked)
          let start: any = (selectingRange || selectedRange)[0];
          let end: any = (selectingRange || selectedRange)[1];

          // validate range
          if (end.isBefore(start)) {
            [end, start] = selectingRange || selectedRange;
          }

          if (day.isBetween(start, end, "day", "[]")) {
            classes.push("range");
          }

          if (day.isSame(start, "day")) {
            classes.push("range-left");
          }

          if (day.isSame(end, "day")) {
            classes.push("range-right");
          }
        } else if (day.isSame(selectedDay, "day")) {
          classes.push("selected");
        }

        // call here customClasses function to avoid giving improper classes to prev/next month
        if (customClasses instanceof Function) {
          classes.push(customClasses(day));
        }
      }

      if ((i - 1) % 7 === 0) {
        // sunday
        classes.push("bolder");
      }

      if (customClasses) {
        Object.keys(customClasses).forEach(k => {
          const obj: any = customClasses[k];
          // Order here is important! Everything is instance of Object in js
          if (typeof obj === "string") {
            if (obj.indexOf(day.format("ddd")) > -1) {
              classes.push(k);
            }
          } else if (obj instanceof Array) {
            obj.forEach(d => {
              if (day.format("YYYY-MM-DD") === d) {
                classes.push(k);
              }
            });
          } else if (obj instanceof Function) {
            if (obj(day)) {
              classes.push(k);
            }
          } else if (obj.start && obj.end) {
            const startDate: any = moment(obj.start, "YYYY-MM-DD").add(-1, "days");
            const endDate: any = moment(obj.end, "YYYY-MM-DD").add(1, "days");
            if (day.isBetween(startDate, endDate)) {
              classes.push(k);
            }
          }
        });
      }
      let disabled: boolean = false;
      let blocked: boolean = false;
      if (this.props.dayIsDisabled(day)) {
        disabled = true;
      }
      if (this.props.dayIsBlocked(day)) {
        blocked = true;
      }
      if (showWeekSeparators) {
        if ((i - 1) % 7 === firstDayOfWeek && days.length) {
          // push week separator
          days.push(<td className="week-separator" key={`seperator-${i}`} />);
        }
      }
      days.push(
        <Day
          blocked={blocked}
          key={`day-${i}`}
          day={day.isValid() ? day : null}
          classes={classes.join(" ")}
          dayClicked={(d: any) => this.dayClicked(d, classes.join(" "))}
          dayHovered={(d: any) => this.dayHovered(d)}
          dayEnableClick={(d: any) => this.dayEnable(d)}
          disabled={disabled}
        />
      );
    });

    return days;
  }

  render(): React.ReactNode {
    let month: any = this.props.month;
    let year: any = this.props.year;

    return (
      <tr>
        <td className="month-name">{moment([year, month, 1]).format("MMM")}</td>
        {this.renderMonthDays()}
      </tr>
    );
  }
}
