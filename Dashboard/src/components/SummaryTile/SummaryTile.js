import React from "react";
import "./SummaryTile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default class summaryTiles extends React.Component {
  render() {
    return (
      <OverlayTrigger
        key={"right"}
        placement={"right"}
        overlay={<Tooltip id={`tooltip-right`}>{this.props.toolTip}</Tooltip>}
      >
        <div className="card summary-tile-content ml-4">
          <h5 className="card-title ">{this.props.title}</h5>
          <div className="card-body text-center">
            <FontAwesomeIcon icon={this.props.icon} size="4x" />
            <p className="card-body ">{this.props.value}</p>
          </div>
          <div className="card-trend">
            <FontAwesomeIcon icon={this.props.trend} size="3x" />
          </div>

          <h6 className="card-subtitle mt-2 mb-1">{this.props.month}</h6>
        </div>
      </OverlayTrigger>
    );
  }
}
