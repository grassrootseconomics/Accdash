import React from "react";
import * as d3 from "d3";
import "./Table.scss";

export default class stackedBarChart extends React.Component {
  componentDidMount() {
    this.createTable();
  }
  // componentDidUpdate() {
  //   this.createTable();
  // }

  createTable() {
    const tableClass = this.props.title.replace(/\s+/g, "-").toLowerCase();
    const { data, keys } = this.props;
    let sort = true;
    var table = d3.select(`#${tableClass}`).append("table");

    var headers = table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(keys)
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      })
      .on("click", function(d) {
        headers.attr("class", "header");

        if (sort) {
          rows.sort(function(a, b) {
            return b[d] < a[d];
          });
          sort = false;
          this.className = "aes";
        } else {
          rows.sort(function(a, b) {
            return b[d] > a[d];
          });
          sort = true;
          this.className = "des";
        }
      });

    const tbody = table.append("tbody");

    var rows = tbody
      .selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

    rows
      .selectAll("td")
      .data(function(d) {
        return keys.map(function(k) {
          return { value: d[k], name: k };
        });
      })
      .enter()
      .append("td")
      .attr("data-th", function(d) {
        return d.name;
      })
      .text(function(d) {
        return d.value;
      });
  }

  render() {
    return (
      <div id={`${this.props.title.replace(/\s+/g, "-").toLowerCase()}`}></div>
    );
  }
}
