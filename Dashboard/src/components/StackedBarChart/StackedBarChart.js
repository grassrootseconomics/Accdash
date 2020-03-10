import React from "react";
import * as d3 from "d3";

export default class stackedBarChart extends React.Component {
  componentDidMount() {
    this.createBarChart();
  }
  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart() {
    const data = this.props.data;

    const key = this.props.keys;
    const graphTitle = this.props.title;
    const graphClass = graphTitle.replace(/\s+/g, "-").toLowerCase();
    const margin = { top: 20, right: 10, bottom: 30, left: 80 };
    const parseMonth = d3.timeParse("%B");
    const width = 900 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const color = this.props.colors;
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    const yAxis =
      this.props.title === "Trade Volumes"
        ? d3.axisLeft(yScale).tickFormat(d3.format(".2s"))
        : d3.axisLeft(yScale);

    const svg = d3
      .select(`svg.${graphClass}`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var stack = d3
      .stack()
      .keys(key)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    var layers = stack(data);
    data.sort(function(a, b) {
      return b.total - a.total;
    });
    xScale.domain(
      data.map(function(d) {
        return parseMonth(d.month);
      })
    );
    yScale
      .domain([
        0,
        d3.max(layers[layers.length - 1], function(d) {
          return d[0] + d[1];
        })
      ])
      .nice();

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", `tooltip ${graphClass}`)
      .style("opacity", 0);

    // const tooltip = svg
    //   .append("g")
    //   .attr("class", "tooltip")
    //   .style("display", "none");

    // tooltip
    //   .append("rect")
    //   .attr("width", 60)
    //   .attr("height", 20)
    //   .attr("fill", "white")
    //   .style("opacity", 0.5);

    // tooltip
    //   .append("text")
    //   .attr("x", 30)
    //   .attr("dy", "1.2em")
    //   .style("text-anchor", "middle")
    //   .attr("font-size", "12px")
    //   .attr("font-weight", "bold");

    const layer = svg
      .selectAll(".layer")
      .data(layers)
      .enter()
      .append("g")
      .attr("class", "layer")
      .style("fill", (d, i) => color[i]);

    layer
      .selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return xScale(parseMonth(d.data.month));
      })
      .attr("y", function(d) {
        return yScale(d[1]);
      })
      .attr("height", function(d) {
        return yScale(d[0]) - yScale(d[1]);
      })
      .attr("width", xScale.bandwidth())
      .on("mouseout", function() {
        tooltip.style("display", "none");
      })
      .on("mouseover", function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("display", "block");
        tooltip
          .html(
            `<p class=""tooltip>  ${
              graphTitle === "Trade Volumes"
                ? d3.format(".2s")(d[1] - d[0])
                : d[1] - d[0]
            }  </p>`
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      });

    //   var tooltip = svg.append("g")
    // .attr("class", "tooltip")
    // .style("display", "none");
    // .on("mouseover", function() {
    //   tooltip.style("display", null);
    // })
    // .on("mouseout", function() {
    //   tooltip.style("display", "none");
    // })
    // .on("mousemove", function(d) {
    //   console.log(d);
    //   var xPosition = d3.mouse(this)[0] - 5;
    //   var yPosition = d3.mouse(this)[1] - 5;
    //   tooltip.attr(
    //     "transform",
    //     "translate(" + xPosition + "," + yPosition + ")"
    //   );
    //   tooltip.select("text").text(d[1] - d[0]);
    // });

    svg
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0,0)")
      .call(yAxis)
      .append("text")
      .attr("x", 2)
      .attr("y", yScale(yScale.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

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
      .text(graphTitle === "Trade Volumes" ? "Volume" : "Users");

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
    return (
      <svg
        id="stackedChart"
        className={this.props.title.replace(/\s+/g, "-").toLowerCase()}
      ></svg>
    );
  }
}
