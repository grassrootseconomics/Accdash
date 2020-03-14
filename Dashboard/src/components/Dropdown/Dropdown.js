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
      <Select
        options={this.options}
        className="mt-1 ml-1 mr-1 mb-1"
        onChange={this.handleChange}
      />
    );
  }
}
