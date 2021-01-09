// Données
const url_data =
  "https://lyondataviz.github.io/teaching/lyon1-m2/2020/data/data_network.json";

// Definition de la taille du svg
const margin = { top: 0, right: 30, bottom: 20, left: 10 },
  width = 450 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// ajout du svg à la 'div id="arcviz"' de page html
var svg = d3
  .select("#arcviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url_data).then(function (data) {
  let allNodes = data.nodes.map(function (d) {
    return d.name;
  });
  let scale = d3.scalePoint().domain(allNodes).range([0, width]);

  let idToNodeName = {};
  data.nodes.forEach(function (n) {
    idToNodeName[n.id] = n;
  });

  let links = svg
    .selectAll("links")
    .data(data.links)
    .enter()
    .append("path")
    .attr("d", function (link_data) {
      let x1 = scale(idToNodeName[link_data.source].name);
      let x2 = scale(idToNodeName[link_data.target].name);
      return getArc(x1, x2);
    })
    .style("fill", "none")
    .attr("stroke", "#eeeeee")
    .attr("stroke-width", 1);

  let nodes = svg
    .selectAll("nodes")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("cx", function (elem) {
      return scale(elem.name);
    })
    .attr("cy", height - 30)
    .attr("r", 10)
    .style("fill", "#547EA8");

  let labels = svg
    .selectAll("labels")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("x", function (elem) {
      return scale(elem.name);
    })
    .attr("y", height)
    .text(function (elem) {
      return elem.name;
    })
    .style("text-anchor", "middle");

  nodes
    .on("mouseover", function (d, e) {
      nodes.style("fill", "#333333");
      d3.select(this).style("fill", "#547EA8").style("stroke", "#eeeeee");

      links
        .style("stroke-opacity", function (link_d) {
          return link_d.source === e.id || link_d.target === e.id ? 1 : 0.2;
        })
        .style("stroke-width", function (link_d) {
          return link_d.source === e.id || link_d.target === e.id ? 4 : 1;
        });
    })
    .on("mouseout", function (d) {
      nodes.style("fill", "#547EA8").style("stroke", "none");

      links.style("stroke-opacity", 1).style("stroke-width", 1);
    });
});

function getArc(x1, x2) {
  return [
    "M",
    x1,
    height - 30, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
    "A", // A for elliptical arc
    (x1 - x2) / 2,
    ",", // coordinates of the inflexion point. Height of this point is proportional with start - end distance
    (x1 - x2) / 2,
    0,
    0,
    ",",
    x1 < x2 ? 1 : 0,
    x2,
    ",",
    height - 30,
  ].join(" ");
}
