


function drawMap(chartId, metal, cumul, data) {
    // Clear div and compute responsive size
    d3.select(chartId).html('');
    var width = Math.min(d3.select(chartId).node().parentNode.clientWidth, 800) - 30;
    var height = width*(320/800.);

    var svg = d3
      .select(chartId)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var g = svg.append("g");

    // Projection to get whole world map
    var projection = d3
      .geoEquirectangular()
      .scale(width*(128/800.))
      .translate([width/2, height/1.675]);

    var path = d3.geoPath().projection(projection);

    var color = d3.scaleSequential(d3.interpolateBlues);

    // Compute bounds (usefull for color scale)
    let minBound = 0;
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

                if (maxBound == null || maxBound < value)
                    maxBound = value;
            }
        }
    }
    
    color.domain([minBound, maxBound]);
    
    // START On ajoute la légende
    var defs = svg.append("defs");

    // Create the gradient
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color(maxBound));
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color(minBound));
        
    // Display the rectangle, with text at top and bottom
    svg.append("rect")
        .attr("width", 15)
        .attr("x", 2)
        .attr("y", height/2.)
        .attr("height", height/2.)
        .style("fill", "url(#linear-gradient)")
        .style('stroke', '#ccc')
        .style('stroke-width', '0.5');
    svg.append('text')
        .attr("y", 12+height/2.)
        .attr("x", 20)
        .text(maxBound+" tonnes");
    svg.append('text')
        .attr("y", -2+height)
        .attr("x", 20)
        .text(minBound+" tonne");
    // END On ajoute la légende

    // Build a callback function to return, that'll update the map instead of rebuilding it while slider moves
    function updateMap(year) {
        // UPDATE PART (juste update color and mouse event like in BUILD part)
        g.attr('class', 'update')
            .selectAll('path')
            .style('fill', function (d) {
                // Get value (could be null or undefined so lots of checks)
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
                    return color(minBound);
                }
            })
            .on('mousemove', function (e, d) {
                var mousePosition = d3.pointer(e, g);
                
                // Get value (could be null or undefined so lots of checks)
                var value = null;
                if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.properties.metals[metal][year.toString()]['value'];
                    }
                }
                
                // Highlight the right country + display tooltip
                g.selectAll('path').style('opacity', '0.25');
                d3.select(this).style('opacity', '1');
                d3.select('.toolTip')
                    .classed('hidden', false)
                    .style('left', (mousePosition[0] + 20) + 'px')
                    .style('top', (mousePosition[1] + 20) + 'px');
                d3.select('.toolTipName').html(d.properties.name);
                if (value) {
                    d3.select('.toolTipData').html(metal + ' produit : ' + value + ' tonnes');
                }else{
                    d3.select('.toolTipData').html(metal + ' produit : ' + 0 + ' tonnes');
                }
            })
            .on('mouseout', function (d) {
                // Reset opacity + hide tooltip
                g.selectAll('path').style('opacity', '1');
                d3.select('.toolTip').classed('hidden', true);
                d3.select('.toolTipData').html('');
            });


        // BUILD PART 
        g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'enter')
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5')
            .style('fill', function (d) {
                // Get value (could be null or undefined so lots of checks)
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
                    return color(minBound);
                }
            })
            .on('mousemove', function (e, d) {
                var mousePosition = d3.pointer(e, g);
                
                // Get value (could be null or undefined so lots of checks)
                var value = null;
                if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.properties.metals[metal][year.toString()]['value'];
                    }
                }
                
                // Highlight the right country + display tooltip
                g.selectAll('path').style('opacity', '0.25');
                d3.select(this).style('opacity', '1');
                d3.select('.toolTip')
                    .classed('hidden', false)
                    .style('left', (mousePosition[0] + 20) + 'px')
                    .style('top', (mousePosition[1] + 20) + 'px');
                d3.select('.toolTipName').html(d.properties.name);
                if (value) {
                    d3.select('.toolTipData').html(metal + ' produit : ' + value + ' tonnes');
                }else{
                    d3.select('.toolTipData').html(metal + ' produit : ' + 0 + ' tonnes');
                }
            })
            .on('mouseout', function (d) {
                // Reset opacity + hide tooltip
                g.selectAll('path').style('opacity', '1');
                d3.select('.toolTip').classed('hidden', true);
                d3.select('.toolTipData').html('');
            })
            .style('transition', 'opacity .25s');;
    }

    // Return the tooltip
    return updateMap;
}
