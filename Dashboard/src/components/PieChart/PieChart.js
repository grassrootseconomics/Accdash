import React from "react";
import * as d3 from "d3";
import "./PieChart.scss";

export default class PieChart extends React.Component {
  componentDidMount() {
    this.createPieChart();
  }
  componentDidUpdate() {
    this.createPieChart();
  }

  createPieChart = () => {
    const graphClass = this.props.title.replace(/\s+/g, "-").toLowerCase();
    const width = this.props.width;
    const height = this.props.height;
    const { data, colors } = this.props;
    const svg = d3
      .select(`svg.${graphClass}`)
      // .attr("height", `${height}`).attr("width", `${width}`);
      .attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("g").remove();
    const graph = svg.append("g");

    graph.append("g").attr("class", "slices");
    graph.append("g").attr("class", "labels");
    graph.append("g").attr("class", "lines");

    const diameter = 250,
      radius = diameter / 2;

    const total = d3.sum(data, d => d.value);
    const pie = d3
      .pie()
      .sort((a, b) => a.value - b.value)
      .value(d => d.value);

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius / 2);

    graph.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const slice = graph
      .select(".slices")
      .selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "slice")
      .attr("fill", (d, i) => colors[i]);

    slice
      .append("path")
      .attr("d", arc)
      .attr("stroke", "white");

    slice
      .transition()
      .duration(1000)
      .attrTween("d", d => {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    d3.select(`div.${graphClass}`).remove();
    const tooltip = d3
      .select("div.app")
      .append("div")
      .attr("class", `tooltip ${graphClass}`)
      .style("opacity", 0);

    tooltip.append("span").attr("class", "label");
    tooltip.append("span").attr("class", "value");
    tooltip.append("span").attr("class", "percent");

    slice.on("mouseover", function(d) {
      tooltip.select(".label").html(d.data.label + ": ");
      tooltip.select(".value").html(d3.format(".2s")(d.value));
      tooltip
        .select(".percent")
        .html(" (" + d3.format(".2s")((d.value / total) * 100) + "%)");
      tooltip.style("display", "block");
      tooltip.style("opacity", 2);
    });

    slice.on("mousemove", function(d) {
      tooltip
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    });

    slice.on("mouseout", function() {
      tooltip.style("display", "none");
      tooltip.style("opacity", 0);
    });

    const legend = svg
      .append("g")
      .attr("transform", `translate(10, -15)`)
      .attr("font-size", 12)
      // .attr("text-anchor", "end")
      .selectAll("g")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * 60}, ${height})`);

    legend
      .append("rect")
      .attr("x", 10)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => colors[i]);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text(d => d.data.label);
  };

  render() {
    return (
      <svg
        id="pieChart"
        className={`${this.props.title.replace(/\s+/g, "-").toLowerCase()}`}
      ></svg>
    );
  }
}
