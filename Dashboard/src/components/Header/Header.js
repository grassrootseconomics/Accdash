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

    const transactions = this.props.selectedTXType.map(transaction => (
      <button
        className="primary transaction"
        onClick={this.props.toggleFilters}
      >
        {transaction.charAt(0).toUpperCase() +
          transaction.slice(1).toLowerCase()}
      </button>
    ));

    const spendTypes = this.props.selectedSpendType.map(spendType => (
      <button className="primary spendType" onClick={this.props.toggleFilters}>
        {spendType.charAt(0).toUpperCase() + spendType.slice(1).toLowerCase()}
      </button>
    ));

    const genders = this.props.selectedGender.map(gender => (
      <button className="primary gender" onClick={this.props.toggleFilters}>
        {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
      </button>
    ));

    const tokens = this.props.selectedTokens.map(token => (
      <button className="primary token" onClick={this.props.toggleFilters}>
        {token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()}
      </button>
    ));

    return (
      <div className="top-bar">
        <Row className="header">
          <p>
            <span>COMMUNITY INCLUSION CURRENCIES DASHBOARD</span>
          </p>
        </Row>

        <Row className="filters">
          <button
            type="button"
            id="sidebarToggle"
            className="btn"
            onClick={this.props.toggleFilters}
          >
            <FontAwesomeIcon icon={faFilter} size="2x" />
          </button>
          <button
            className="primary dateRange"
            onClick={this.props.toggleFilters}
          >
            {dateRange}
          </button>
          {transactions}
          {spendTypes}
          {genders}
          {tokens}
        </Row>
      </div>
    );
  }
}
