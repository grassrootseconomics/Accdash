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
    const width = 750;
    const height = 400;
    const data = this.props.data;
    const svg = d3
      .select(`svg#${graphClass}`)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g");

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    const diameter = 300,
      radius = diameter / 2;

    const color = [...d3.schemePaired, ...d3.schemeTableau10];

    const pie = d3
      .pie()
      .sort((a, b) => a.value - b.value)
      .value(d => d.value);

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(0);

    const outerArc = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius * 0.8);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const slice = svg
      .select(".slices")
      .selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "slice")
      .attr("fill", (d, i) => color[i]);

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

    /* ------- TEXT LABELS -------*/
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    const text = svg
      .select(".labels")
      .selectAll("text")
      .data(pie(data));

    text
      .enter()
      .append("text")
      .attr("font-size", 10)
      .attr("transform", function(d) {
        return "translate(" + outerArc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .text(d => d.data.label)
      .attr("transform", function(d) {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 1.2 * (midAngle(d) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function(d) {
        return midAngle(d) < Math.PI ? "start" : "end";
      });

    /* ------- SLICE TO TEXT POLYLINES -------*/

    svg
      .select(".lines")
      .selectAll("polyline")
      .data(pie(data))
      .enter()
      .append("polyline")
      .attr("points", function(d) {
        // see label transform function for explanations of these three lines.
        const pos = outerArc.centroid(d);
        pos[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    const tooltip = d3
      .select("div.app")
      .append("div")
      .attr("class", "tooltip pieChart")
      .style("opacity", 0);

    tooltip.append("div").attr("class", "value");

    slice.on("mouseover", function(d) {
      tooltip.select(".value").html(d3.format(".2s")(d.value));
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
  };

  render() {
    return (
      <svg
        id={this.props.title.replace(/\s+/g, "-").toLowerCase()}
        className=""
      ></svg>
    );
  }
}
