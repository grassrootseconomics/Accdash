import React from "react";
import * as d3 from "d3";

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
    const height = 350;
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
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(0);

    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.2)
      .outerRadius(radius);

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

    //   slice.transition().duration(1000);
    // .attrTween("d", d => {
    //   this._current = this._current || d;
    //   const interpolate = d3.interpolate(this._current, d);
    //   this._current = interpolate(0);
    //   return function(t) {
    //     return arc(interpolate(t));
    //   };
    // });

    //   slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    // const text = svg
    //   .select(".labels")
    //   .selectAll("text")
    //   .data(pie(data));

    // text
    //   .enter()
    //   .append("text")
    //   .attr("transform", function(d) {
    //     return "translate(" + outerArc.centroid(d) + ")";
    //   })
    //   .attr("dy", ".35em")
    //   .text(function(d) {
    //     return d.data.label;
    //   });

    // function midAngle(d) {
    //   return d.startAngle + (d.endAngle - d.startAngle) / 2;
    // }

    //   text
    //     .transition()
    //     .duration(1000)
    //     .attrTween("transform", function(d) {
    //       this._current = this._current || d;
    //       const interpolate = d3.interpolate(this._current, d);
    //       this._current = interpolate(0);
    //       return function(t) {
    //         const d2 = interpolate(t);
    //         const pos = outerArc.centroid(d2);
    //         pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
    //         return "translate(" + pos + ")";
    //       };
    //     })
    //     .styleTween("text-anchor", function(d) {
    //       this._current = this._current || d;
    //       const interpolate = d3.interpolate(this._current, d);
    //       this._current = interpolate(0);
    //       return function(t) {
    //         const d2 = interpolate(t);
    //         return midAngle(d2) < Math.PI ? "start" : "end";
    //       };
    //     });

    //   text.exit().remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    //   const polyline = svg
    //     .select(".lines")
    //     .selectAll("polyline")
    //     .data(pie(data), key);

    //   polyline.enter().append("polyline");

    //   polyline
    //     .transition()
    //     .duration(1000)
    //     .attrTween("points", function(d) {
    //       this._current = this._current || d;
    //       const interpolate = d3.interpolate(this._current, d);
    //       this._current = interpolate(0);
    //       return function(t) {
    //         const d2 = interpolate(t);
    //         const pos = outerArc.centroid(d2);
    //         pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
    //         return [arc.centroid(d2), outerArc.centroid(d2), pos];
    //       };
    //     });

    //   polyline.exit().remove();
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
