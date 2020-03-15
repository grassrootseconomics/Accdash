import React from "react";
import Picker from "react-month-picker";
import "./MonthDropDown.scss";

export default class MonthDropdown extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || "N/A"
    };
    this._handleClick = this._handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value || "N/A"
    });
  }

  render() {
    let pickerLang = {
        months: [
          "Jan",
          "Feb",
          "Mar",
          "Spr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        from: "From",
        to: "To"
      },
      mvalue = { year: 2018, month: 11 },
      mrange = { from: { year: 2018, month: 8 }, to: { year: 2020, month: 5 } };

    let makeText = m => {
      if (m && m.year && m.month)
        return pickerLang.months[m.month - 1] + ". " + m.year;
      return "?";
    };

    return (
      <ul>
        <li>
          <div className="edit">
            <Picker
              ref="pickAMonth"
              years={[2018, 2019, 2020]}
              value={mvalue}
              lang={pickerLang.months}
              onChange={this.handleAMonthChange}
              onDismiss={this.handleAMonthDissmis}
            >
              <MonthDropdown
                values={makeText(mvalue)}
                onClick={this.handleClickMonthBox}
              />
            </Picker>
          </div>
        </li>
        <li>
          <label>Pick A Span of Months</label>
          <div className="edit">
            <Picker
              ref="pickRange"
              years={{ min: 2018, max: 2020 }}
              range={mrange}
              lang={pickerLang}
              theme="dark"
              onChange={this.handleRangeChange}
              onDismiss={this.handleRangeDismiss}
            >
              <MonthDropdown
                values={makeText(mrange.from) + " ~ " + makeText(mrange.to)}
                onClick={this._handleClickRangeBox}
              />
            </Picker>
          </div>
        </li>
      </ul>
    );
  }
}
