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
    // var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    const margin = { top: 20, right: 10, bottom: 30, left: 80 };
    const width = 900 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const color = this.props.colors;
    const data = this.props.data;

    const parseMonth = d3.timeParse("%B");

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(1);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    const yAxis = d3.axisLeft(yScale);

    // // define the 1st line
    // var valueline = d3
    //   .line()
    //   .curve(d3.curveCardinal)
    //   .x(d => xScale(parseMonth(d.month)))
    //   .y(d => yScale(d.active));

    // // define the 2nd line
    // var valueline2 = d3
    //   .line()
    //   .curve(d3.curveCardinal)
    //   .x(d => xScale(parseMonth(d.month)))
    //   .y(d => yScale(d.registered));

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("svg#lineChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    xScale.domain(
      data.map(function(d) {
        return parseMonth(d.month);
      })
    );
    yScale.domain([
      0,
      d3.max(data, function(d) {
        return Math.max(d.Active, d.Registered);
      })
    ]);

    // Add the valueline path.
    // svg
    //   .append("path")
    //   .data([data])
    //   .attr("class", "line")
    //   .style("stroke", (d, i) => color(i))
    //   .style("fill", "none")
    //   .attr("d", valueline);

    // // Add the valueline2 path.
    // svg
    //   .append("path")
    //   .data([data])
    //   .attr("class", "line")
    //   .style("stroke", (d, i) => color(i))
    //   .style("fill", "none")
    //   .attr("d", valueline2);

    this.props.keys.forEach((key, i) => {
      svg
        .append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", color[i])
        .style("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x(d => xScale(parseMonth(d.month)))
            .y(d => yScale(d[key]))
        );
      const $keydiv = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const $keydot = svg
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .style("fill", color[i])
        .attr("r", 5);

      $keydot
        .attr("cx", function(d) {
          return xScale(parseMonth(d.month));
        })
        .attr("cy", function(d) {
          return yScale(d[key]);
        })
        .on("mouseover", function(d) {
          $keydiv
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          $keydiv
            .html("<p>" + d[key] + "</p>")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        });
    });

    // Add the X Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    svg.append("g").call(yAxis);

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 5) + ")"
      )
      .attr("font-size", 12)
      .style("text-anchor", "middle")
      .text("Months");

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("font-size", 12)
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "2.5rem")
      .style("text-anchor", "middle")
      .text("Users");

    const legend = svg
      .append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(this.props.keys.slice())
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d, i) => color[i]);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) {
        return d;
      });
  }
  render() {
    return <svg id="lineChart"></svg>;
  }
}
