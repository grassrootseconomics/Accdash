import React from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default class MultiselectDropdown extends React.Component {
  state = {
    selectedOptions: null
  };
  handleChange = selectedOptions => {
    this.setState({ selectedOptions });
    this.props.callback(selectedOptions);
  };
  options = this.props.options.map(o => ({
    value: o.Item,
    label: o.Item.charAt(0).toUpperCase() + o.Item.slice(1).toLowerCase()
  }));

  default = this.props.selected
    ? this.props.selected.map(s => {
        return this.options.find(o => o.value === s);
      })
    : [];

  render() {
    return (
      <Select
        className="mt-1 ml-1 mr-1 mb-1"
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={this.default}
        isMulti
        options={this.options}
        onChange={this.handleChange}
      />
    );
  }
}
