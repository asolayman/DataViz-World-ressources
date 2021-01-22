


function drawBarchart(chartId, data) {
    // Preprocess
    data.sort(function(a, b) {
        return d3.ascending(a.number, b.number)
    })

    // Clear div + responsive size
    d3.select(chartId).html('');
    const width = Math.min(d3.select(chartId).node().parentNode.clientWidth, 800) - 60,
        height = width/2.;
        
    // Scale for x axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.letter))
        .padding(0.1);

    // Scale for y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.number)])
        .range([height, 0]);
        
    // Create the svg for the chart
    const svg = d3.select(chartId).append('svg')
        .attr('id', 'svg')
        .attr('width', width + 60)
        .attr('height', height + 60)
        .append('g')
        .attr('transform', 'translate(' + 40 + ',' + 20 + ')');

    // Display X axis
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll('text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.6em')
            .attr('transform', 'rotate(-65)');

    // Display Y axis
    svg.append("g").call(d3.axisLeft(y).ticks(6));

    // Display bars
    var bars = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "#4e79a7")
        .attr("x", d => x(d.letter))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.number))
        .attr("height", d => height - y(d.number))
        .style('transition', 'opacity .25s');
    
    // Mouse events for highlight/tooltip
    bars.on('mousemove', function (e, d) {
        var mousePosition = d3.pointer(e, bars);
        
        bars.style('opacity', '0.25');
        d3.select(this).style('opacity', '1');
        d3.select('.toolTip')
            .classed('hidden', false)
            .style('left', (mousePosition[0] + 20) + "px")
            .style('top', (mousePosition[1] + 20) + "px");
        d3.select('.toolTipName').html(d.name + ' (' + d.letter + ')');
        d3.select('.toolTipData').html('Numéro atomique ' + d.number);
    });
    
    bars.on('mouseout', function (d) {
        bars.style('opacity', '1');
        
        d3.select('.toolTip')
            .classed('hidden', true);
    });
    
    
    // Add line for "limit" befor supernova
    svg.append("path")
        .datum([[0, 26], [width, 26]])
        .attr("fill", "none")
        .attr("stroke", "#E15759")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x((d) => d[0])
            .y((d) => y(d[1]))
        )
        .attr('pointer-events', "none")
        .attr('stroke-dasharray', "10,10");
    
    // Add small legend text for "limit" line
    svg.append('text')
        .attr("y", y(26)-10)
        .attr("x", 10)
        .attr("fill", "#E15759")
        .text('Limite sans explosion*');
}