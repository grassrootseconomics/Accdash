import React from "react";
import DatePicker from "react-datepicker";
import { timeFormat } from "d3";
import "./MonthDropDown.scss";

export default class MonthDropdown extends React.Component {
  show = false;
  message = "";
  state = {
    selectedOptions: null,
    startDate: new Date(this.props.start),
    endDate: new Date(this.props.end),
    dateRange: `${timeFormat("%b %Y")(new Date(this.props.start))} -
    ${timeFormat("%b %Y")(new Date(this.props.end))}`
  };

  options = this.props.options.map(o => ({ value: o.Item, label: o.Item }));
  handleChange = date => {
    if (date) {
      if (this.state.startDate && this.state.endDate) {
        this.setState({
          startDate: date,
          endDate: undefined,
          dateRange: `${timeFormat("%b %Y")(date)}`
        });
        this.show = true;
        this.message = "Please select end date";
      } else {
        if (date > this.state.startDate && !this.state.endDate) {
          this.show = false;
          this.setState({
            endDate: date,
            dateRange: `
          ${timeFormat("%b %Y")(this.state.startDate)} -
          ${timeFormat("%b %Y")(date)}`
          });
          this.props.callback({
            from: `${timeFormat("%Y-%m")(this.state.startDate)}`,
            to: `${timeFormat("%Y-%m")(date)}`
          });
        } else if (+date === +this.state.startDate) {
          this.show = false;
          this.setState({
            endDate: date,
            dateRange: `${timeFormat("%b %Y")(date)}`
          });
          this.props.callback({
            from: `${timeFormat("%Y-%m")(this.state.startDate)}`,
            to: `${timeFormat("%Y-%m")(date)}`
          });
        } else {
          this.setState({
            startDate: date,
            endDate: undefined,
            dateRange: `${timeFormat("%b %Y")(date)}`
          });
          this.show = true;
          this.message = "Please select end date";
        }
      }
    }
  };

  render() {
    const tooltip = this.show ? (
      <div>
        <div className="arrow"></div>
        <div className="tooltip-inner">{this.message}</div>
      </div>
    ) : (
      ""
    );
    if (this.props.options.length > 0) {
      return (
        <div>
          <DatePicker
            minDate={new Date(this.options[0].value)}
            maxDate={new Date(this.options[this.options.length - 1].value)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            onChange={this.handleChange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            shouldCloseOnSelect={false}
            customInput={
              <div className="yearMonthPicker">
                <span ref={this.target}>{this.state.dateRange}</span>
                {tooltip}
              </div>
            }
          />
        </div>
      );
    }
    return <p>API returned no data Please try again ...</p>;
  }
}
