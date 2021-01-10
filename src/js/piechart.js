


function drawPiechart(div_id, data, colors = ["#ff0000", "#00ff00", "#0000ff"]) {
  // set the dimensions and margins of the graph
  var width = 1100;
  var height = 450;
  var margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'div_id'
  var svg1 = d3
    .select(div_id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // set the color scale
  var color = d3.scaleOrdinal().range(colors);

  // Compute the position of each group on the pie:
  var pie = d3.pie().value((d) => d['percentage']);
  var data_ready = pie(data);

  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  var outerArc = d3
    .arc()
    .innerRadius(radius * 1.1)
    .outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  var slices = svg1
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", (d) => color(d.data['name']))
    .attr("stroke", "#adadad")
    .style("stroke-width", "1px")
    .style("opacity", 0.7);

  svg1
    .selectAll("allPolylines")
    .data(data_ready)
    .enter()
    .append("polyline")
    .attr("stroke", "#adadad")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      var posA = [arcGenerator.centroid(d)[0]*2, arcGenerator.centroid(d)[1]*2]; // line insertion in the slice
      var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      posC[0] *= 1.15
      return [posA, posB, posC];
    });

  svg1
    .selectAll("allLabels")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      console.log(d.data['name']);
      return d.data['name'];
    })
    .attr("transform", function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      pos[0] *= 1.15
      return "translate(" + pos + ")";
    })
    .style("text-anchor", function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });

  slices
    .on("mousemove", function (e, d) {
      // Quand on bouge la souris, le département s'assombri, et le toolTip change
      d3.select(this).style("opacity", "0.5");
      var mousePosition = d3.pointer(e, slices);

      d3.select(".toolTip")
        .classed("hidden", false)
        .style("left", mousePosition[0] + 15 + "px")
        .style("top", mousePosition[1] - 35 + "px");

      d3.select(".toolTipName").html(d.data['name']);
      d3.select(".toolTipData").html(d.data['info']);
    })
    .on("mouseout", function (d) {
      // Quand la souris quitte le département, on remet l'opacity du département et on cache le toolTip
      d3.select(this).style("opacity", "1");

      d3.select(".toolTip").classed("hidden", true);
    });
}

// drawPiechart("#piechart1");
// drawPiechart("#piechart2", { a: 50, b: 50 }, ["#7b6888", "#6b486b"], {
  // a: "truc a",
  // b: "truc b",
// });
