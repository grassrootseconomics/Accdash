import React from "react";
import * as d3 from "d3";
import "./Table.scss";

export default class stackedBarChart extends React.Component {
  componentDidMount() {
    this.createTable();
  }

  createTable() {
    const tableClass = this.props.title.replace(/\s+/g, "-").toLowerCase();
    const { data, keys } = this.props;
    var table = d3.select(`#${tableClass}`).append("table");

    table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(keys)
      .enter()
      .append("th")
      .text(function (d) {
        return d;
      });

    const tbody = table.append("tbody");

    var rows = tbody.selectAll("tr").data(data).enter().append("tr");

    rows
      .selectAll("td")
      .data(function (d) {
        return keys.map(function (k) {
          return { value: d[k], name: k, url: d.url };
        });
      })
      .enter()
      .append("td")
      .append("a")
      .attr("href", function (d) {
        return d.url;
      })
      .attr("target", "_blank")
      .text(function (d) {
        return d.value;
      });
  }

  render() {
    return (
      <div id={`${this.props.title.replace(/\s+/g, "-").toLowerCase()}`}></div>
    );
  }
}
