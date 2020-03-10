import React from "react";
import Select from "react-select";

export default class Dropdown extends React.Component {
  state = {
    selectedOption: null
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.props.callback(selectedOption);
  };
  options = this.props.options.map(o => ({ value: o.Item, label: o.Item }));
  render() {
    return (
      <div>
        <Select
          options={this.options}
          className="mt-4 ml-1 mr-1 mb-2"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
