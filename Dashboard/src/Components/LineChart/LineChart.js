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
    const graphTitle = this.props.title;
    const graphClass = graphTitle.replace(/\s+/g, "-").toLowerCase();
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const { startMonth, endMonth, keys, data, colors } = this.props;

    const parseMonth = d3.timeParse("%Y-%m");
    const parseDate = d3.timeParse("%Y-%m-%d");
    const monthView = startMonth === endMonth;

    const xScale = d3
      .scaleBand()
      .range([0, width - 5])
      .padding(1);
    const yScale = d3.scaleLinear().range([height, 20]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(
        !monthView ? d3.timeFormat("%b %Y") : d3.timeFormat("%d %b %Y")
      )
      .tickSize(0);

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.format(".3s"))
      .ticks(6)
      .tickSize(0);

    var svg = d3.select(`svg.${graphClass}`);
    svg.selectAll("g").remove();
    svg
      // .attr("width", `${width + margin.left + margin.right}`)
      // .attr("height", `${height + margin.top + margin.bottom}`);
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );

    const graph = svg.append("g").attr("transform", "translate(50, -10)");

    // Scale the range of the data
    xScale.domain(
      data.map(function (d) {
        return !monthView ? parseMonth(d.yearMonth) : parseDate(d.dayMonth);
      })
    );
    yScale.domain([0, d3.max(data, d => d3.max(keys, k => d[k]))]);

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
            .x(d =>
              xScale(
                !monthView ? parseMonth(d.yearMonth) : parseDate(d.dayMonth)
              )
            )
            .y(d => yScale(d[key]))
        );

      d3.select(`div.${graphClass}-${key}`).remove();

      const tooltip = d3
        .select("div.app")
        .append("div")
        .attr("class", `tooltip ${graphClass}-${key}`)
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
        .attr("cx", function (d) {
          return xScale(
            !monthView ? parseMonth(d.yearMonth) : parseDate(d.dayMonth)
          );
        })
        .attr("cy", function (d) {
          return yScale(d[key]);
        })
        .on("mouseover", function (d) {
          tooltip.html(`<p>${d3.format(".3s")(d[key])}</p>`);
          tooltip.style("display", "block");
          tooltip.style("opacity", 2);
        })
        .on("mousemove", function (d) {
          tooltip
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
          tooltip.style("opacity", 0);
        });
    });

    // Add the X Axis
    graph
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .call(g => g.select(".domain").remove())
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

    const legend = svg
      .append("g")
      .attr(
        "transform",
        (d, i) =>
          `translate(${
            (width + margin.left + margin.right) / 2 - keys.length * 40
          }, 40)`
      )
      .attr("font-size", 11)
      // .attr("text-anchor", "end")
      .selectAll("g")
      .data(this.props.keys.slice())
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * 100}, ${height})`);

    legend
      .append("rect")
      .attr("x", 10)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => colors[i]);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text(function (d) {
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
