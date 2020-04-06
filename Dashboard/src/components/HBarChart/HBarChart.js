import React from "react";
import * as d3 from "d3";

export default class HBarChart extends React.Component {
  componentDidMount() {
    this.createBarChart();
  }
  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart() {
    const data = this.props.data;
    const graphTitle = this.props.title;
    const graphClass = graphTitle.replace(/\s+/g, "-").toLowerCase();
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    // const parseMonth = d3.timeParse("%Y-%m");
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const colors = [
      "#38DCE2",
      "#32AF93",
      "#248890",
      "#74D485",
      "#68EEAB",
      "#CAF270",
      "#2FADB6",
      "#66FCF1",
      "#1A505B",
      "#4472C4",
      "#1B2A37",
      "#8EBFF2"
    ];

    let mappedData = data.map((d, i) => ({ ...d, color: colors[i] }));
    mappedData = mappedData.sort(function(a, b) {
      return a.value - b.value;
    });

    const xScale = d3
      .scaleLinear()
      .range([0, width - 60])
      .domain([
        0,
        d3.max(mappedData, function(d) {
          return d.value;
        })
      ]);

    const yScale = d3
      .scaleBand()
      .range([height + margin.bottom, 0])
      .padding(0.3)
      .domain(
        mappedData.map(function(d) {
          return d.label;
        })
      );

    const svg = d3
      .select(`svg.${graphClass}`)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height +
          margin.top +
          margin.bottom}`
      );
    // .attr("height", `${height + margin.top + margin.bottom}`)
    // .attr("width", `${width + margin.left + margin.right}`);
    svg.selectAll("g").remove();

    const graph = svg.append("g").attr("transform", "translate(100,10)");

    graph
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(0))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .attr("font-size", 12);

    const bars = graph
      .selectAll(".bar")
      .data(mappedData)
      .enter()
      .append("g");

    //append rects
    bars
      .append("rect")
      .attr("class", "bar")

      .style("fill", d => d.color)
      .attr("y", function(d) {
        return yScale(d.label);
      })
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", function(d) {
        return xScale(d.value);
      });

    bars
      .append("text")
      .attr("class", "label")
      //y position of the label is halfway down the bar
      .attr("y", function(d) {
        return yScale(d.label);
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", function(d) {
        return xScale(d.value) + 1;
      })
      .text(function(d) {
        return d3.format(".2s")(d.value);
      })
      .attr("font-size", 12)
      .attr("transform", `translate(2, ${yScale.bandwidth() / 2 + 5})`);
  }

  render() {
    return (
      <svg
        id="barChart"
        className={`${this.props.title.replace(/\s+/g, "-").toLowerCase()}`}
      ></svg>
    );
  }
}
