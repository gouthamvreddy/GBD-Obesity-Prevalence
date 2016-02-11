var margin = {top: 20, right: 10, bottom: 10, left: 200},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var barHeight = 20;

var formatPercent = d3.format(".0%");

var x = d3.scale.linear().range([0, width]);

var svg = d3.select("#chart")
  .append('svg')
  .attr("width", width + margin.left + margin.right);

var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("top")
                  .tickFormat(formatPercent);

d3.csv('data/overweight_children.csv', type, function(error, data){

  console.log(data);

  svg.attr("height", barHeight * data.length + margin.top * 2);

  x.domain([0, d3.max(data, function(d) { return d.mean; })]);

  var bar = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
  //  .attr("cx", 0)
    .attr("transform", function(d, i) { return "translate(0," + (i * barHeight + margin.top * 2) + ")"; });

  bar.append("text")
  .attr("class", "location_name")
  .attr("x", margin.left)
  .attr("y", barHeight / 2)
  .attr("dy", ".35em")
  .text(function(d) { return d.location_name; });

  bar.append("rect")
    .attr("transform", function(d, i) { return "translate(" + margin.left + ",0 )"; })
    .attr("width", function(d) { return x(d.mean); })
    .attr("height", barHeight - 1);

  bar.append("text")
    .attr("x", function(d) { return margin.left + x(d.mean) + 30; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return (d.mean * 100).toFixed(1) + "%"; });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + margin.left + "," + 20 + ")")
      .call(xAxis);
});

function type(d) {
  d.mean = +d.mean; // coerce to number
  return d;
}
