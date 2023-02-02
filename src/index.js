import * as d3 from "d3";

import "./styles.css";

const URL = "../data/buildings.json";
const MARGIN = {
  TOP: 10,
  RIGHT: 10,
  BOTTOM: 130,
  LEFT: 100
};
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;
const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// x label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 110)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("The world's tallest building");

// y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .attr("y", -60)
  .attr("x", -(HEIGHT / 2))
  .attr("transform", "rotate(-90)")
  .text("Height (m)");

d3.json(URL).then((data) => {
  data.forEach((d) => {
    d.height = Number(d.height);
  });

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.height)])
    .range([0, HEIGHT]);

  // write axis
  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    // rotate text 40deg
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  const yAxisCall = d3
    .axisLeft(y)
    .ticks(3)
    .tickFormat((d) => d + " m");
  g.append("g").attr("class", "y axis").call(yAxisCall);

  const rects = g.selectAll("rect").data(data);

  rects
    .enter()
    .append("rect")
    .attr("y", 0)
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", (d) => y(d.height))
    .attr("fill", "grey");
});
