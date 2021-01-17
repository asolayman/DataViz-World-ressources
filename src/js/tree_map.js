


function drawTreemap(chartId, metal, cumul, data) {
    d3.select(chartId).html('');
    var width = Math.min(d3.select(chartId).node().parentNode.clientWidth, 800) - 30;
    var height = width*(320/800.);

    var svg = d3
      .select(chartId)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var g = svg.append("g");

    var color = d3.scaleSequential(d3.interpolateBlues);

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

    function updateMap(year) {
        var root = d3.hierarchy(data, x => x.features)
            .sum(function(d) {
                if (!d.properties) {
                    return 1;
                }

                var value = null;
                if (d.properties.metals[metal] != undefined && d.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.properties.metals[metal][year.toString()]['value'];
                    }
                }

                if (value) {
                    return value;
                } else {
                    return 0;
                }
            });

        d3.treemap().size([width, height]).padding(2)(root)


        g.attr('class', 'update')
            .selectAll("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .on('mousemove', function (e, d) {
                var mousePosition = d3.pointer(e, g);

                var value = null;
                if (d.data.properties.metals[metal] != undefined && d.data.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.data.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.data.properties.metals[metal][year.toString()]['value'];
                    }
                }

                g.selectAll("rect").style('opacity', '0.25');
                d3.select(this).style('opacity', '1');
                d3.select('.toolTip')
                    .classed('hidden', false)
                    .style('left', (mousePosition[0] + 20) + 'px')
                    .style('top', (mousePosition[1] + 20) + 'px');
                d3.select('.toolTipName').html(d.data.properties.name);
                if (value) {
                    d3.select('.toolTipData').html(metal + ' produit : ' + value + ' tonnes');
                }else{
                    d3.select('.toolTipData').html(metal + ' produit : ' + 0 + ' tonnes');
                }

                g.selectAll(".textsvg").style('opacity', function (textsData) { return textsData === d ? 1 : 0.25;});
            })
            .on('mouseout', function (d) {
                g.selectAll("rect").style('opacity', '1');
                d3.select('.toolTip').classed('hidden', true);
                d3.select('.toolTipData').html('');

                g.selectAll(".textsvg").style('opacity', 1);
            })
            .style('transition', 'opacity .25s');

        g.attr('class', 'update')
            .selectAll(".textsvg")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; });

        g.attr('class', 'update')
            .selectAll("text")
            .text(function (d) { return d.data.properties.name})
            .append('tspan')
            .attr('x', '5px')
            .attr('dy', '1.2em')
            .text(function(d) {

                if (!d.data.properties) {
                    return '';
                }

                var value = null;
                if (d.data.properties.metals[metal] != undefined && d.data.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.data.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.data.properties.metals[metal][year.toString()]['value'];
                    }
                }

                if (value) {
                    return (value + ' tonnes');
                } else {
                    return (0 + ' tonnes');
                }
            });

        g.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style('fill', "#444444")
            .on('mousemove', function (e, d) {
                var mousePosition = d3.pointer(e, g);

                var value = null;
                if (d.data.properties.metals[metal] != undefined && d.data.properties.metals[metal][year.toString()] != undefined) {
                    if (cumul) {
                        value = d.data.properties.metals[metal][year.toString()]['cumul'];
                    } else {
                        value = d.data.properties.metals[metal][year.toString()]['value'];
                    }
                }

                g.selectAll("rect").style('opacity', '0.25');
                d3.select(this).style('opacity', '1');
                d3.select('.toolTip')
                    .classed('hidden', false)
                    .style('left', (mousePosition[0] + 20) + 'px')
                    .style('top', (mousePosition[1] + 20) + 'px');
                d3.select('.toolTipName').html(d.data.properties.name);
                if (value) {
                    d3.select('.toolTipData').html(metal + ' produit : ' + value + ' tonnes');
                }else{
                    d3.select('.toolTipData').html(metal + ' produit : ' + 0 + ' tonnes');
                }

                g.selectAll(".textsvg").style('opacity', function (textsData) { return textsData === d ? 1 : 0.25;});
            })
            .on('mouseout', function (d) {
                g.selectAll("rect").style('opacity', '1');
                d3.select('.toolTip').classed('hidden', true);
                d3.select('.toolTipData').html('');

                g.selectAll(".textsvg").style('opacity', 1);
            })
            .style('transition', 'opacity .25s');


        g.selectAll(".textsvg")
            .data(root.leaves())
            .enter()
            .append('svg')
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('class', 'textsvg')
            .append("text")
            .attr("x", function(d){ return 5})    // +5 to adjust position (more right)
            .attr("y", function(d){ return 20})    // +20 to adjust position (lower)
            .style('transition', 'opacity .25s')
            .attr('pointer-events', "none")
            .text(function (d) { return d.data.properties.name})
            .append('tspan')
            .attr('x', '5px')
            .attr('dy', '1.2em')
            .text(d => d.value + ' tonnes')
            .attr('pointer-events', "none");
    }

    return updateMap;
}
