function drawLinechart(chartId, legendId, metal, cumul, reserve, data) {
    reserve = reserve && data[metal].reserve;
    
    var finalData = [];
    for (var key in data[metal]) {
        if (key != 'reserve') {
            finalData.push({'year': d3.timeParse("%Y")(key), 'values': data[metal][key], 'reserve': data[metal]['reserve']})
        }
    }
    if (cumul) {
        for (var i = 0; i < finalData.length; i++) {
            finalData[i].reserve += finalData[finalData.length-1].values.cumul;
        }
    }
    
    d3.select(chartId).html('');
    var width = Math.min(d3.select(chartId).node().parentNode.clientWidth, 800) - 150;
    var height = width*0.5;

    var svg = d3
        .select(chartId)
        .append("svg")
        .attr("width", width+150)
        .attr("height", height+50)
        .append("g")
        .attr("transform", "translate(" + 150 + "," + 25 + ")");

        

    
    var x = d3.scaleUtc()
        .domain(d3.extent(finalData, (d) => d['year']))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    if (reserve) {
        var y = d3
            .scaleLinear()
            .domain([0, d3.max(finalData, (d) => Math.max(((cumul) ? +d.values.cumul:+d.values.value), d.reserve))])
            .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));
    } else {
        var y = d3
            .scaleLinear()
            .domain([0, d3.max(finalData, (d) => ((cumul) ? +d.values.cumul:+d.values.value))])
            .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));
    }

    
    
    // Add the line
    svg.append("path")
        .datum(finalData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
            "d",
            d3
                .line()
                .x((d) => x(d.year))
                .y((d) => y((cumul) ? +d.values.cumul:+d.values.value))
        );

    if (reserve) {
        svg.append("path")
            .datum(finalData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => x(d.year))
                    .y((d) => y(d.reserve))
            );
    }
}


