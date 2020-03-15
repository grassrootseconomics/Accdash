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

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 750 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const color = this.props.colors;
    const data = this.props.data;

    const parseMonth = d3.timeParse("%Y-%m");

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(1);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    var svg = d3
      .select("svg#lineChart")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height +
          margin.top +
          margin.bottom}`
      );

    const graph = svg
      .append("g")
      .attr("transform", "translate(" + 50 + "," + margin.top + ")");

    // Scale the range of the data
    xScale.domain(
      data.map(function(d) {
        return parseMonth(d.yearMonth);
      })
    );
    yScale.domain([
      0,
      d3.max(data, function(d) {
        return Math.max(d["Frequent Traders"], d.Traders);
      })
    ]);

    this.props.keys.forEach((key, i) => {
      graph
        .append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", color[i])
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
        .style("fill", color[i])
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
      // .on("mouseover", function(d) {
      //   tooltip
      //     .transition()
      //     .duration(200)
      //     .style("opacity", 0.9);
      //   tooltip
      //     .html(`<p class="tooltip"> ${d3.format(".2s")(d[key])}</p>`)
      //     .style("left", d3.event.pageX + "px")
      //     .style("top", d3.event.pageY - 28 + "px");
      // })
      // .on("mouseout", d => {
      //   tooltip
      //     .transition()
      //     .duration(200)
      //     .style("opacity", 0)
      //     .style("display", "none");
      // });
    });

    // Add the X Axis
    graph
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    graph.append("g").call(yAxis);

    graph
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 5) + ")"
      )
      .attr("font-size", 12)
      .style("text-anchor", "middle")
      .text("Months");

    // text label for the y axis
    graph
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("font-size", 12)
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1.5rem")
      .style("text-anchor", "middle")
      .text("Users");

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
      .attr("fill", (d, i) => color[i]);

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
    return <svg id="lineChart"></svg>;
  }
}
