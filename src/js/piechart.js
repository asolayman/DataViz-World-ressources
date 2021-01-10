


function drawPiechart(chartId, legendId, data) {
    var size = 400;
    var legendSize = 18;
    var margin = 10;
    var radius = size/2.;

    var color = d3.scaleOrdinal().range(["#9A266D","#9A268D","#86269A","#66269A","#46269A","#26279A","#26479A",
        "#26679A","#26879A","#269A8C","#269A6C","#269A4D","#269A2F","#3C9A26","#5B9A26","#7A9A26","#989A26",
        "#9A7D26","#9A5E26","#9A3F26","#9A262B"]);

    var dataPie = d3.pie().value((d) => d['percentage'])(data);
    var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    
    var chart = d3.select(chartId)
        .append('svg')
        .attr('width', size + 2*margin)
        .attr('height', size + 2*margin)
        .append('g')
        .attr('transform', 'translate(' + (radius + margin) + ',' + (margin + size/2.) + ')');

    var slices = chart.selectAll('slices')
        .data(dataPie)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d) => color(d.index))
        .attr('stroke', '#ADADAD')
        .style('stroke-width', '1px')
        .style('transition', 'opacity .25s');
    
    var legend = d3.select(legendId)
        .append('svg')
        .attr('width', size + 2*margin)
        .attr('height', data.length*legendSize*1 + (data.length-1)*legendSize*0.5 + 2*margin)
        .append('g')
        .attr('transform', 'translate(' + margin + ',' + margin + ')');
    
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

    var texts = legend.selectAll('texts')
        .data(dataPie)
        .enter()
        .append('text')
        .text(d => d.data['name'])
        .attr('x', legendSize*1.2)
        .attr('y', d => d.index*legendSize*1.5 + legendSize)
        .style('transition', 'opacity .25s');
    
    
    
    slices.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, slices);
        
        slices.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        d3.select('.toolTip')
            .classed('hidden', false)
            .style('left', (mousePosition[0] + 15) + "px")
            .style('top', (mousePosition[1]) + "px");
        d3.select('.toolTipName').html(d.data['name']);
        d3.select('.toolTipData').html(d.data['info']);
        
        
        squares.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
        texts.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
    });
    
    slices.on('mouseout', function (d) {
        slices.style('opacity', '1');
        squares.style('opacity', '1');
        texts.style('opacity', '1');
        
        d3.select('.toolTip')
            .classed('hidden', true);
    });
    
    
    
    squares.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, squares);
        
        squares.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        
        slices.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
        texts.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
    });
    
    squares.on('mouseout', function (d) {
        slices.style('opacity', '1');
        squares.style('opacity', '1');
        texts.style('opacity', '1');
    });
    
    
    
    texts.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, texts);
        
        texts.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        
        slices.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
        squares.style('opacity', function (squaresData) { return squaresData.data.name === d.data.name ? 1. : 0.25;})
    });
    
    texts.on('mouseout', function (d) {
        slices.style('opacity', '1');
        squares.style('opacity', '1');
        texts.style('opacity', '1');
    });
}


