// Pour format les data
function entries(map) {
  var entries = [];
  for (var key in map) entries.push({ key: key, value: map[key] });
  return entries;
}

function drawPiechart(div, data={ a: 15, b: 15, c: 30, d: 30 }, colors=["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]) {
  // set the dimensions and margins of the graph
  var width = 450;
  height = 450;
  margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'my_dataviz'
  var svg1 = d3
    .select(div)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // set the color scale
  var color = d3
    .scaleOrdinal()
    .range(colors);

  // Compute the position of each group on the pie:
  var pie = d3.pie().value((d) => d.value);
  var data_ready = pie(entries(data));

  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  var slices = svg1
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", (d) => color(d.data.key))
    .attr("stroke", "#adadad")
    .style("stroke-width", "3px")
    .style("opacity", 0.7);

  svg1
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("text")
    .text((d) => d.data.key + " (" + d.data.value + "%)")
    .attr("transform", (d) => "translate(" + arcGenerator.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 17);

  slices
    .on("mousemove", function (e, d) {
      // Quand on bouge la souris, le département s'assombri, et le toolTip change
      d3.select(this).style("opacity", "0.5");
      var mousePosition = d3.pointer(e, slices);

      d3.select(".toolTip")
        .classed("hidden", false)
        .style("left", mousePosition[0] + 15 + "px")
        .style("top", mousePosition[1] - 35 + "px");

      d3.select(".toolTipName").html(d.data.key);
      d3.select(".toolTipData").html(d.data.value + "%");
    })
    .on("mouseout", function (d) {
      // Quand la souris quitte le département, on remet l'opacity du département et on cache le toolTip
      d3.select(this).style("opacity", "1");

      d3.select(".toolTip").classed("hidden", true);
    });
}

drawPiechart("#piechart1")
drawPiechart("#piechart2", { a: 50, b: 50}, ["#7b6888", "#6b486b"])
