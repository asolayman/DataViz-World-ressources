


function drawMap(chartId, legendId, metal, cumul, data) {
    d3.select(chartId).html('');
    var width = d3.select(chartId).node().parentNode.clientWidth - 30;
    var height = width*(400/800.);

    var svg = d3
      .select(chartId)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var g = svg.append("g");

    var projection = d3
      .geoEquirectangular()
      .scale(width*(128/800.))
      .translate([width/2, height/2]);

    var path = d3.geoPath().projection(projection);

    var color = d3.scaleQuantize().range(d3.schemeGreens[9]);

    let minBound = null;
    let maxBound = null;
    for (var i = 0; i < data.features.length; i++) {
        let values = data.features[i].properties.metals[metal];
        if (values != undefined) {
            for (var k = 1975; k <= 2018; k++) {
                let value = null;
                if (cumul) {
                    value = values[k.toString()]['cumul'];
                } else {
                    value = values[k.toString()]['value'];
                }
                
                if (minBound == null || minBound > value)
                    minBound = value;
                
                if (maxBound == null || maxBound < value)
                    maxBound = value;
            }
        }
    }
    
    color.domain([minBound, maxBound]);
    
    // On ajoute la légende
    // svg
      // .append("g")
      // .attr("class", "legendQuant")
      // .attr("transform", "translate(15, 310)");
    // var legend = d3
      // .legendColor()
      // .labelFormat(d3.format("d"))
      // .title("Nombre de tonne de/d'"+metal+" produit :")
      // .scale(color);
    // svg.select(".legendQuant").call(legend);

    function updateMap(year) {
        g.attr('class', 'update')
            .selectAll('path')
            .style('fill', function (d) {
                var value = null;
                if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.properties.metals[metal][year.toString()]['value'];
                    }
                }
                
                if (value) {
                    return color(value);
                } else {
                    return '#ADADAD';
                }
            })
            .on('mousemove', function (e, d) {
                var mousePosition = d3.pointer(e, g);
                
                var value = null;
                if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.properties.metals[metal][year.toString()]['value'];
                    }
                }
                
                d3.select(this).style('opacity', '0.5');
                d3.select('.toolTip')
                    .classed('hidden', false)
                    .style('left', (mousePosition[0] + 20) + 'px')
                    .style('top', (mousePosition[1] + 20) + 'px');
                d3.select('.toolTipName').html(d.properties.name);
                if (value) {
                d3.select('.toolTipData').html(metal + ' produit : ' + value + ' tonnes');
            }
            })
            .on('mouseout', function (d) {
                d3.select(this).style('opacity', '1');
                d3.select('.toolTip').classed('hidden', true);
            });


        
        g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'enter')
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5')
            .style('fill', function (d) {
                var value = null;
                if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.properties.metals[metal][year.toString()]['value'];
                    }
                }

                if (value) {
                    return color(value);
                } else {
                    return '#ADADAD';
                }
            })
        .on('mousemove', function (e, d) {
            var mousePosition = d3.pointer(e, g);
            
            var value = null;
            if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                if (cumul) {
                    value = d.properties.metals[metal][year.toString()]['cumul'];
                } else {
                    value = d.properties.metals[metal][year.toString()]['value'];
                }
            }
            
            d3.select(this).style('opacity', '0.5');
            d3.select('.toolTip')
                .classed('hidden', false)
                .style('left', (mousePosition[0] + 20) + 'px')
                .style('top', (mousePosition[1] + 20) + 'px');
            d3.select('.toolTipName').html(d.properties.name);
            if (value) {
                d3.select('.toolTipData').html(metal + ' produit : ' + value + ' tonnes');
            }
        })
        .on('mouseout', function (d) {
            d3.select(this).style('opacity', '1');
            d3.select('.toolTip').classed('hidden', true);
        });
    }

    return updateMap;
}
