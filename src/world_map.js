// Lien des données + carte
var mapLink = "world-countries-no-antartica.json";
var dataLink = "data.csv";

var metal = "Argent";

var width = 1600;
var height = 1160;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var g = svg.append("g");

var projection = d3
  .geoEquirectangular()
  .scale(300)
  .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var color = d3.scaleQuantize().range(d3.schemeGreens[9]);

d3.dsv(",", dataLink).then(function (data) {
  d3.json(mapLink).then(function (json) {
    // On initialise le tableau de jours à vide pour tous les départements
    for (var j = 0; j < json.features.length; j++) {
      json.features[j].properties.value = {};
    }

    for (var i = 0; i < data.length; i++) {
      // Pays
      var dataPays = data[i].Pays;
      var dataValue = {};
      for (var annee = 1975; annee < 2019; annee++) {
        if (Number.isNaN(parseInt(data[i][annee]))) {
          dataValue[annee] = 0;
        } else {
          dataValue[annee] = parseInt(data[i][annee]);
        }
      }
      // Recherche du département dans le GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonPays = json.features[j].properties.name;
        if (dataPays == jsonPays && data[i].Metal === metal) {
          //On injecte la valeur du département dans le json

          for (var annee = 1975; annee < 2019; annee++) {
            if (json.features[j].properties.value[annee] === undefined)
              json.features[j].properties.value[annee] = 0;
            json.features[j].properties.value[annee] += parseInt(
              dataValue[annee]
            );
          }

          //Pas besoin de chercher plus loin
          break;
        }
      }
    }

    // On définit les bornes avec comme min, le minimum sur tous les jours et tous les départements (resp. max)
    color.domain([
      d3.min(json.features, function (d) {
        return Math.min(...Object.values(d.properties.value));
      }),
      d3.max(json.features, function (d) {
        return Math.max(...Object.values(d.properties.value));
      }),
    ]);

    // On ajoute la légende
    svg
      .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(15, 310)");
    var legend = d3
      .legendColor()
      .labelFormat(d3.format("d"))
      .title("Nombre de tonne d'or produit :")
      .scale(color);
    svg.select(".legendQuant").call(legend);

    function drawMap(dayDate) {
      // Mise à jour de la carte
      g.attr("class", "update")
        .selectAll("path")
        .style("fill", function (d) {
          // On prend la valeur recuperee plus haut
          var value = d.properties.value[dayDate];

          if (value) {
            return color(value);
          } else {
            // Si pas de valeur alors en gris
            return "#adadad";
          }
        })
        .on("mousemove", function (e, d) {
          // Quand on bouge la souris, le département s'assombri, et le toolTip change
          d3.select(this).style("opacity", "0.5");
          var mousePosition = d3.pointer(e);

          d3.select(".toolTip")
            .classed("hidden", false)
            .style("left", mousePosition[0] + 15 + "px")
            .style("top", mousePosition[1] - 35 + "px");
          d3.select(".toolTipName").html(d.properties.name);
          d3.select(".toolTipData").html(
            "Tonne d'or produit : " + d.properties.value[dayDate]
          );
        })
        .on("mouseout", function (d) {
          // Quand la souris quitte le département, on remet l'opacity du département et on cache le toolTip
          d3.select(this).style("opacity", "1");

          d3.select(".toolTip").classed("hidden", true);
        });

      // Initialisation de la carte
      g.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "enter")
        .style("stroke", "#ccc")
        .style("stroke-width", "0.5")
        .style("fill", function (d) {
          // On prend la valeur recuperee plus haut
          var value = d.properties.value[dayDate];

          if (value) {
            return color(value);
          } else {
            // Si pas de valeur alors en gris
            return "#adadad";
          }
        })
        .on("mousemove", function (e, d) {
          // Quand on bouge la souris, le département s'assombri, et le toolTip change
          d3.select(this).style("opacity", "0.5");
          var mousePosition = d3.pointer(e);

          d3.select(".toolTip")
            .classed("hidden", false)
            .style("left", mousePosition[0] + 15 + "px")
            .style("top", mousePosition[1] - 35 + "px");
          d3.select(".toolTipName").html(d.properties.name);
          d3.select(".toolTipData").html(
            "Tonne d'or produit : " + d.properties.value[dayDate]
          );
        })
        .on("mouseout", function (d) {
          // Quand la souris quitte le département, on remet l'opacity du département et on cache le toolTip
          d3.select(this).style("opacity", "1");

          d3.select(".toolTip").classed("hidden", true);
        });
    }

    // Callback sur le slider
    d3.select("#slider").on("input", function () {
      updateViz(+this.value);
    });

    // Met à jour la visualisation
    function updateViz(value) {
      let date = 1975;
      date = date + value;
      d3.select("#day").html(date);
      drawMap(date);
    }

    // On initialise avec un jour
    updateViz(0);
  });
});
