import React from "react";
import * as d3 from "d3";

export default class lineBarChart extends React.Component {
  componentDidMount() {
    this.createLineChart();
  }
  componentDidUpdate() {
    this.createLineChart();
  }

  createLineChart() {
    // set the dimensions and margins of the graph

    const keys = this.props.keys;
    const graphTitle = this.props.title;
    const graphClass = graphTitle.replace(/\s+/g, "-").toLowerCase();
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const colors = [
      "#CAF270",
      "#38DCE2",
      "#32AF93",
      "#248890",
      "#74D485",
      "#68EEAB",
      "#2FADB6",
      "#66FCF1",
      "#1A505B",
      "#4472C4",
      "#1B2A37",
      "#8EBFF2"
    ];
    const data = this.props.data;
    const parseMonth = d3.timeParse("%Y-%m");

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(1);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat(" %b %Y"))
      .tickSize(0);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.format(".2s"))
      .tickSize(0);

    var svg = d3.select(`svg.${graphClass}`);
    svg.selectAll("g").remove();
    svg
      // .attr("width", `${width + margin.left + margin.right}`)
      // .attr("height", `${height + margin.top + margin.bottom}`);
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height +
          margin.top +
          margin.bottom}`
      );

    const graph = svg
      .append("g")
      .attr("transform", "translate(" + 50 + "," + 10 + ")");

    // Scale the range of the data
    xScale.domain(
      data.map(function(d) {
        return parseMonth(d.yearMonth);
      })
    );
    yScale.domain([
      0,
      d3.max(data, d => d3.max(keys, k => d[k]))
      // d3.max(data, function(d) {
      //   return Math.max(d.Frequent, d.Total);
      // })
    ]);

    this.props.keys.forEach((key, i) => {
      graph
        .append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", colors[i])
        .style("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x(d => xScale(parseMonth(d.yearMonth)))
            .y(d => yScale(d[key]))
        );

      const tooltip = d3
        .select("div.app")
        .append("div")
        .attr("class", "tooltip lineChart")
        .style("opacity", 0);

      tooltip.append("div").attr("class", "value");

      const $keydot = graph
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .style("fill", colors[i])
        .attr("r", 5);

      $keydot
        .attr("cx", function(d) {
          return xScale(parseMonth(d.yearMonth));
        })
        .attr("cy", function(d) {
          return yScale(d[key]);
        })
        .on("mouseover", function(d) {
          tooltip.html(`<p>${d3.format(".2s")(d[key])}</p>`);
          tooltip.style("display", "block");
          tooltip.style("opacity", 2);
        })
        .on("mousemove", function(d) {
          tooltip
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function() {
          tooltip.style("display", "none");
          tooltip.style("opacity", 0);
        });
    });

    // Add the X Axis
    graph
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-40)");

    // Add the Y Axis
    graph
      .append("g")
      .call(yAxis)
      .call(g => g.select(".domain").remove());

    // // text label for the y axis
    // graph
    //   .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("font-size", 12)
    //   .attr("y", 0 - margin.left)
    //   .attr("x", 0 - height / 2)
    //   .attr("dy", "1.5rem")
    //   .style("text-anchor", "middle")
    //   .text("Users");

    const legend = svg
      .append("g")
      .attr("transform", `translate(15, 0)`)
      .attr("font-size", 9)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(this.props.keys.slice())
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 15})`);

    legend
      .append("rect")
      .attr("x", width + 50)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => colors[i]);

    legend
      .append("text")
      .attr("x", width + 45)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text(function(d) {
        return d;
      });
  }
  render() {
    return (
      <svg
        id="lineChart"
        className={`${this.props.title.replace(/\s+/g, "-").toLowerCase()}`}
      ></svg>
    );
  }
}
