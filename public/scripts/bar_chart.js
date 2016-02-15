var margin = {top: 20, right: 10, bottom: 10, left: 230},
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

var obesityData;

//Initial state - Metric: Overweight, Sort: Alphabetical
d3.csv('data/childhood_obesity.csv', type, function(error, csv){

  obesityData = csv;
  initialGraph();
});

function initialGraph(){
  var data = obesityData.filter(function(value){ return value.metric === 'overweight'; });

  svg.attr("height", barHeight * data.length + margin.top * 2);

  x.domain([0, d3.max(data, function(d) { return d.mean; })]);

  var bar = svg.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { return "translate(0," + (i * barHeight + margin.top * 2) + ")"; });

  bar.append("text")
    .attr("class", "location-name")
    .attr("x", margin.left - 3)
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.location_name; });

  bar.append("rect")
    .attr("transform", function(d, i) { return "translate(" + margin.left + ",0 )"; })
    .attr("width", function(d) { return x(d.mean); })
    .attr("height", barHeight - 1);

  bar.append("text")
    .attr("class", "label")
    .attr("x", function(d) { return margin.left + x(d.mean) + 30; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return (d.mean * 100).toFixed(1) + "%"; });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(xAxis);
};

//Change function for changing metric option - obese or overweight
//  - change length of bars & x-axis based on chosen metric
function changeMetric() {

  var metric = d3.select("#metric").node().value; //gets selected metric option
  var data = obesityData.filter(function(value){ return value.metric === metric; });

  x.domain([0, d3.max(data, function(d) { return d.mean; })]);

  svg.selectAll(".bar")
    .data(data)
    .transition()
    .attr("transform", function(d, i) { return "translate(0," + (i * barHeight + margin.top * 2) + ")"; });

  svg.selectAll("rect")
    .data(data)
    .transition()
    .duration(1500)
    .attr("width", function(d) { return x(d.mean); });

  svg.selectAll(".label")
    .data(data)
    .transition()
    .duration(1500)
    .attr("x", function(d) { return margin.left + x(d.mean) + 30; })
    .text(function(d) { return (d.mean * 100).toFixed(1) + "%"; });

  svg.selectAll(".location-name")
    .data(data)
    .transition()
    .duration(1500)
    .text(function(d) { return d.location_name; });

  svg.selectAll(".axis")
    .transition().duration(1500).ease("sin-in-out")
    .call(xAxis);

  //need to sort also if sort selection is not alphabetical
  sortBars();

};

//Sort locations based on option selected in #sort menu & selected metric
//  ascending - 'asc', descending - 'des', or alphabetical - 'alpha'
function sortBars() {
  var sortBy = d3.select("#sort").node().value;
  svg.selectAll(".bar")
     .sort(function(a, b) {
        if(sortBy === 'asc') {
           return a.mean - b.mean;
         } else if(sortBy === 'des') {
           return b.mean - a.mean;
         } else {
           return a.location_name.localeCompare(b.location_name); //alphabetical
         }
     })
     .transition()
     .duration(2000)
     .attr("transform", function(d, i) { return "translate(0," + (i * barHeight + margin.top * 2) + ")"; });
};

function type(d) {
  d.mean = +d.mean; // coerce to number
  return d;
};

//Handle metric option selection
d3.select("#metric")
  .on("change", changeMetric);

//Handle sort option selection
d3.select("#sort")
  .on("change", sortBars);
