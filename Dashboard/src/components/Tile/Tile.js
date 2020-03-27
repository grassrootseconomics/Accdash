import React from "react";
import "./Tile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default class Tiles extends React.Component {
  render() {
    return (
      <OverlayTrigger
        key={"right"}
        placement={"right"}
        overlay={<Tooltip id={`tooltip-right`}>{this.props.toolTip}</Tooltip>}
      >
        <div className="card">
          <p className="title ">{this.props.title}</p>
          <div className="body">
            {/* <FontAwesomeIcon icon={this.props.icon} /> */}
            <div className="details">
              <p>{this.props.value}</p>
              <div className={`trend ${this.props.trend.symbol.iconName}`}>
                <p>
                  {" "}
                  <FontAwesomeIcon icon={this.props.trend.symbol} />
                  {this.props.trend.percent}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </OverlayTrigger>
    );
  }
}
