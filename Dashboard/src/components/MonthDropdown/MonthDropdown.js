import React from "react";
import Picker from "react-month-picker";
import MonthBox from "react-month-picker";
import "./MonthDropDown.scss";

export default class MonthDropdown extends React.Component {
  state = {
    selectedOptions: null
  };
  handleChange = selectedOptions => {
    console.log("$$$$$$$", selectedOptions);
    this.setState({ selectedOptions });
    this.props.callback(selectedOptions);
  };
  options = this.props.options.map(o => ({ value: o.Item, label: o.Item }));
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
      mvalue = { year: 2015, month: 11 },
      mrange = { from: { year: 2014, month: 8 }, to: { year: 2015, month: 5 } };

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
              years={[2008, 2010, 2011, 2012, 2014, 2015, 2016, 2017]}
              value={mvalue}
              lang={pickerLang.months}
              onChange={this.handleAMonthChange}
              onDismiss={this.handleAMonthDissmis}
            >
              <MonthBox
                value={makeText(mvalue)}
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
              years={{ min: 2010, max: 2018 }}
              range={mrange}
              lang={pickerLang}
              theme="dark"
              onChange={this.handleRangeChange}
              onDismiss={this.handleRangeDismiss}
            >
              <MonthBox
                value={makeText(mrange.from) + " ~ " + makeText(mrange.to)}
                onClick={this._handleClickRangeBox}
              />
            </Picker>
          </div>
        </li>
      </ul>
    );
  }
}
