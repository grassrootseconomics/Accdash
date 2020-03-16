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

    const keys = this.props.keys;
    const graphTitle = this.props.title;
    const graphClass = graphTitle.replace(/\s+/g, "-").toLowerCase();
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const parseMonth = d3.timeParse("%Y-%m");
    const width = 750 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const xScale = d3
      .scaleBand()
      .range([0, width - 20])
      .padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const color = [...d3.schemePaired, ...d3.schemeTableau10];
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));
    const svg = d3
      .select(`svg.${graphClass}`)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height +
          margin.top +
          margin.bottom}`
      );
    const graph = svg
      .append("g")
      .attr("transform", "translate(" + 50 + "," + 10 + ")");

    var stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    var layers = stack(data);

    xScale.domain(
      data.map(function(d) {
        return parseMonth(d.yearMonth);
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
      .select("div.app")
      .append("div")
      .attr("class", `tooltip ${graphClass}`)
      .style("opacity", 0);

    tooltip.append("div").attr("class", "value");

    const layer = graph
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
        return xScale(parseMonth(d.data.yearMonth));
      })
      .attr("y", function(d) {
        return yScale(d[1]);
      })
      .attr("height", function(d) {
        return yScale(d[0]) - yScale(d[1]);
        // return isNaN(yScale(d[0]) - yScale(d[1])) ? 0 : height;
      })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function(d) {
        tooltip.html(`<p>${d3.format(".2s")(d[1] - d[0])}</p>`);
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
    // .on("mouseover", d => {
    //   tooltip
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 0.9)
    //     .style("display", "block");
    //   tooltip
    //     .html(`<p class=""tooltip>  ${d3.format(".2s")(d[1] - d[0])}  </p>`)
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

    graph
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-40)");

    graph
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

    // graph
    //   .append("text")
    //   .attr(
    //     "transform",
    //     "translate(" + width / 2 + " ," + (height + margin.top + 8) + ")"
    //   )
    //   .attr("font-size", 12)
    //   .style("text-anchor", "middle")
    //   .text("Months");

    // text label for the y axis
    graph
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("font-size", 12)
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1.75rem")
      .style("text-anchor", "middle")
      .text(graphTitle);

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
    return (
      <svg
        id="stackedChart"
        className={this.props.title.replace(/\s+/g, "-").toLowerCase()}
      ></svg>
    );
  }
}
