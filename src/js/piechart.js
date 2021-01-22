


function drawPiechart(chartId, legendId, data) {
    var size = 400;
    var legendSize = 18;
    var margin = 10;
    var radius = size/2.;

    var color = d3.scaleOrdinal().range(d3.schemeTableau10);

    var dataPie = d3.pie().value((d) => d['percentage'])(data);
    var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    
    // Create svg for the chart
    var chart = d3.select(chartId)
        .append('svg')
        .attr('width', size + 2*margin)
        .attr('height', size + 2*margin)
        .append('g')
        .attr('transform', 'translate(' + (radius + margin) + ',' + (margin + size/2.) + ')');

    // Display chart
    var slices = chart.selectAll('slices')
        .data(dataPie)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d) => color(d.index))
        .attr('stroke', '#ADADAD')
        .style('stroke-width', '1px')
        .style('transition', 'opacity .25s');
    
    // Create svg for legend
    var legend = d3.select(legendId)
        .append('svg')
        .attr('width', size + 2*margin)
        .attr('height', data.length*legendSize*1 + (data.length-1)*legendSize*0.5 + 2*margin)
        .append('g')
        .attr('transform', 'translate(' + margin + ',' + margin + ')');
    
    // Display legend squares
    var squares = legend.selectAll('square')
        .data(dataPie)
        .enter()
        .append('rect')
        .attr('y', d => d.index*legendSize*1.5)
        .attr('width', legendSize)
        .attr('height', legendSize)
        .attr('fill', d => color(d.index))
        .attr('stroke', '#ADADAD')
        .style('stroke-width', '1px')
        .style('transition', 'opacity .25s');

    // Display legend texts
    var texts = legend.selectAll('texts')
        .data(dataPie)
        .enter()
        .append('text')
        .text(d => d.data['name'])
        .attr('x', legendSize*1.2)
        .attr('y', d => d.index*legendSize*1.5 + legendSize)
        .style('transition', 'opacity .25s');
    
    
    // Add mouse event on slices
    slices.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, slices);
        
        // Change opacity of hovered element + display tooltip
        slices.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        d3.select('.toolTip')
            .classed('hidden', false)
            .style('left', (mousePosition[0] + 20) + "px")
            .style('top', (mousePosition[1] + 20) + "px");
        d3.select('.toolTipName').html(d.data['name']);
        d3.select('.toolTipData').html(d.data['percentage'] + '%, ' + d.data['weight'] + 'g' + (d.data['info'] ? ('<br>' + d.data['info']):''));
        
        // Highlight only the right things
        squares.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
        texts.style('opacity', function (textsData) { return textsData.data.name === d.data.name ? 1. : 0.25;})
    });
    
    slices.on('mouseout', function (d) {
        // Reset opacity and remove hide tooltip
        slices.style('opacity', '1');
        squares.style('opacity', '1');
        texts.style('opacity', '1');
        
        d3.select('.toolTip')
            .classed('hidden', true);
    });
    
    
    // Add mouse event on squares legend
    squares.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, squares);
        
        // Change opacity of hovered element + display tooltip
        squares.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        d3.select('.toolTip')
            .classed('hidden', false)
            .style('left', (mousePosition[0] + 20) + "px")
            .style('top', (mousePosition[1] + 20) + "px");
        d3.select('.toolTipName').html(d.data['name']);
        d3.select('.toolTipData').html(d.data['percentage'] + '%, ' + d.data['weight'] + 'g' + (d.data['info'] ? ('<br>' + d.data['info']):''));
        
        // Highlight only the right things
        slices.style('opacity', function (slicesData) { return slicesData.data.name === d.data.name ? 1. : 0.25;})
        texts.style('opacity', function (textsData) { return textsData.data.name === d.data.name ? 1. : 0.25;})
    });
    
    squares.on('mouseout', function (d) {
        // Reset opacity and remove hide tooltip
        slices.style('opacity', '1');
        squares.style('opacity', '1');
        texts.style('opacity', '1');
        
        d3.select('.toolTip')
            .classed('hidden', true);
    });
    
    
    // Add mouse event on texts legend
    texts.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, texts);
        
        // Change opacity of hovered element + display tooltip
        texts.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        d3.select('.toolTip')
            .classed('hidden', false)
            .style('left', (mousePosition[0] + 20) + "px")
            .style('top', (mousePosition[1] + 20) + "px");
        d3.select('.toolTipName').html(d.data['name']);
        d3.select('.toolTipData').html(d.data['percentage'] + '%, ' + d.data['weight'] + 'g' + (d.data['info'] ? ('<br>' + d.data['info']):''));
        
        // Highlight only the right things
        slices.style('opacity', function (slicesData) { return slicesData.data.name === d.data.name ? 1. : 0.25;})
        squares.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
    });
    
    texts.on('mouseout', function (d) {
        // Reset opacity and remove hide tooltip
        slices.style('opacity', '1');
        squares.style('opacity', '1');
        texts.style('opacity', '1');
        
        d3.select('.toolTip')
            .classed('hidden', true);
    });
}


