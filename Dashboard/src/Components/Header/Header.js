import React from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.scss";
import { faFilter, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { timeFormat } from "d3";
import logo from "../../resources/CIC-Logo-white-100x50-1.png";
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
          <button
            type="button"
            id="sidebarToggle"
            className="btn mobileOnly"
            onClick={this.props.toggleFilters}
          >
            <FontAwesomeIcon icon={faFilter} size="2x" />
          </button>
          <p>
            <img src={logo} alt="CIC" />
            <span className="nonMobile">
              COMMUNITY INCLUSION CURRENCIES DASHBOARD
            </span>
            <span className="mobileOnly">CIC DASHBOARD</span>
          </p>
          <OverlayTrigger
            key={"bottom"}
            placement={"bottom"}
            overlay={<Tooltip id={`tooltip-bottom`}>{"CIC Hub"}</Tooltip>}
          >
            <a
              href="http://cichub.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            </a>
          </OverlayTrigger>
        </Row>

        <Row className="filters nonMobile">
          <Col className="col" lg={12}>
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
            <button className="primary threeDots">...</button>
          </Col>
        </Row>
      </div>
    );
  }
}
