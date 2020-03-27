import React from "react";
import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.scss";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { timeFormat } from "d3";
export default class Header extends React.Component {
  render() {
    let dateRange;
    if (this.props.dateRangeFrom !== this.props.dateRangeTo)
      dateRange = `${timeFormat("%b %Y")(new Date(this.props.dateRangeFrom))} -
        ${timeFormat("%b %Y")(new Date(this.props.dateRangeTo))}`;
    else
      dateRange = `${timeFormat("%b %Y")(new Date(this.props.dateRangeFrom))}`;
    return (
      <Row className="header">
        <section id="filters">
          <button
            type="button"
            id="sidebarToggle"
            className="btn"
            onClick={this.props.toggleFilters}
          >
            <FontAwesomeIcon icon={faFilter} size="2x" />
          </button>
          <label className="dateRange">{dateRange}</label>
        </section>
        <p>CIC Dashboard</p>
      </Row>
    );
  }
}
