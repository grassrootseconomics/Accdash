import React from "react";
import "./Tile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { format } from "d3";

export default class Tiles extends React.Component {
  renderSecondValue() {
    if (this.props.value2) {
      return (
        <div className="details">
          <p className="label">
            {(this.props.value2 >= 1 && this.props.value2 < 100) ||
            this.props.value2 === 0
              ? this.props.value2
              : this.props.value2 < 1
              ? format(".3n")(this.props.value2)
              : format(".3s")(this.props.value2)}

            {this.renderSecondValueUnits()}
          </p>
          {this.renderSecondValueTrend()}
        </div>
      );
    }
  }

  renderFirstValueUnits() {
    if (this.props.units1) {
      return <span>{this.props.units1}</span>;
    }
  }

  renderFirstValueTrend() {
    if (this.props.trend1) {
      return (
        <div
          className={`trend ${
            this.props.trend1.percent === 0 ||
            this.props.trend1.percent === "NA"
              ? "grey"
              : this.props.trend1.symbol.iconName
          }`}
        >
          <p>
            <FontAwesomeIcon icon={this.props.trend1.symbol} />
            <span className="trendLabel">{`${
              this.props.trend1.percent !== "NA"
                ? ((this.props.trend1.percent >= 1 &&
                    this.props.trend1.percent < 100) ||
                  this.props.trend1.percent === 0
                    ? this.props.trend1.percent
                    : this.props.trend1.percent < 1
                    ? format(".3n")(this.props.trend1.percent)
                    : format(".3s")(this.props.trend1.percent)) + "%"
                : this.props.trend1.percent
            }`}</span>
          </p>
        </div>
      );
    }
  }

  renderSecondValueTrend() {
    if (this.props.trend2) {
      return (
        <div
          className={`trend ${
            this.props.trend2.percent === 0 ||
            this.props.trend1.percent === "NA"
              ? "grey"
              : this.props.trend2.symbol.iconName
          }`}
        >
          <p>
            <FontAwesomeIcon icon={this.props.trend2.symbol} />
            <span className="trendLabel">{`${
              this.props.trend1.percent !== "NA"
                ? ((this.props.trend2.percent >= 1 &&
                    this.props.trend2.percent < 100) ||
                  this.props.trend2.percent === 0
                    ? this.props.trend2.percent
                    : this.props.trend2.percent < 1
                    ? format(".3n")(this.props.trend2.percent)
                    : format(".3s")(this.props.trend2.percent)) + "%"
                : this.props.trend2.percent
            }`}</span>
          </p>
        </div>
      );
    }
  }

  renderSecondValueUnits() {
    if (this.props.units2) {
      return <span>{this.props.units2}</span>;
    }
  }

  render() {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        overlay={<Tooltip id={`tooltip-bottom`}>{this.props.toolTip}</Tooltip>}
      >
        <div className="card">
          <p className="title ">{this.props.title}</p>
          <div className="body">
            {/* <FontAwesomeIcon icon={this.props.icon} /> */}
            <div className="details">
              <p className="label">
                {(this.props.value1 >= 1 && this.props.value1 < 100) ||
                this.props.value1 === 0
                  ? this.props.value1
                  : this.props.value1 < 1
                  ? format(".3n")(this.props.value1)
                  : format(".3s")(this.props.value1)}
                {this.renderFirstValueUnits()}
              </p>
              {this.renderFirstValueTrend()}
            </div>

            {this.renderSecondValue()}
          </div>
        </div>
      </OverlayTrigger>
    );
  }
}
