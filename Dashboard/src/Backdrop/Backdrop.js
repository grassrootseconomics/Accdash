import React from "react";

import "./Backdrop.scss";

export default class Backdrop extends React.Component {
  render() {
    return this.props.show ? (
      <div className={"overlay"} onClick={this.props.clicked}></div>
    ) : null;
  }
}
