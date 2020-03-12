import React from "react";
import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.scss";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export default class Header extends React.Component {
  render() {
    return (
      <Row>
        <div className="header">
          <button
            type="button"
            id="sidebarToggle"
            className="btn"
            onClick={this.props.toggleFilters}
          >
            <FontAwesomeIcon icon={faFilter} size="2x" />
          </button>
          <p>CIC Dashboard</p>
        </div>
      </Row>
    );
  }
}
