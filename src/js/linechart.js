function entries(map) {
    var entries = [];
    for (var key in map) {
        if (key != "reserve")
            entries.push({ key: d3.timeParse("%Y")(key), values: map[key] });
        else entries.push({ key: key, values: map[key] });
    }
    return entries;
}

function drawLinechart(div_id, data) {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 50, bottom: 50, left: 100 },
        width = 760 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
        .select(div_id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = {
        Or: {
            1975: { value: 1203579, cumul: 1203579 },
            1976: { value: 1213094, cumul: 2416673 },
            1977: { value: 1227680, cumul: 3644353 },
            1978: { value: 1248364, cumul: 4892717 },
            1979: { value: 1240463, cumul: 6133180 },
            1980: { value: 1232942, cumul: 7366122 },
            1981: { value: 1264125, cumul: 8630247 },
            1982: { value: 1321197, cumul: 9951444 },
            1983: { value: 1446668, cumul: 11398112 },
            1984: { value: 1444497, cumul: 12842609 },
            1985: { value: 1476744, cumul: 14319353 },
            1986: { value: 1560484, cumul: 15879837 },
            1987: { value: 1609162, cumul: 17488999 },
            1988: { value: 1793525, cumul: 19282524 },
            1989: { value: 1962396, cumul: 21244920 },
            1990: { value: 2132775, cumul: 23377695 },
            1991: { value: 2147151, cumul: 25524846 },
            1992: { value: 2240111, cumul: 27764957 },
            1993: { value: 2251501, cumul: 30016458 },
            1994: { value: 2222546, cumul: 32239004 },
            1995: { value: 2164561, cumul: 34403565 },
            1996: { value: 2261733, cumul: 36665298 },
            1997: { value: 2416653, cumul: 39081951 },
            1998: { value: 2454276, cumul: 41536227 },
            1999: { value: 2508224, cumul: 44044451 },
            2000: { value: 2555072, cumul: 46599523 },
            2001: { value: 2533201, cumul: 49132724 },
            2002: { value: 2529118, cumul: 51661842 },
            2003: { value: 2549478, cumul: 54211320 },
            2004: { value: 2415454, cumul: 56626774 },
            2005: { value: 2504376, cumul: 59131150 },
            2006: { value: 2367204, cumul: 61498354 },
            2007: { value: 2347262, cumul: 63845616 },
            2008: { value: 2300775, cumul: 66146391 },
            2009: { value: 2505029, cumul: 68651420 },
            2010: { value: 2656838, cumul: 71308258 },
            2011: { value: 2673628, cumul: 73981886 },
            2012: { value: 2758945, cumul: 76740831 },
            2013: { value: 2955129, cumul: 79695960 },
            2014: { value: 3076056, cumul: 82772016 },
            2015: { value: 3149155, cumul: 85921171 },
            2016: { value: 3230755, cumul: 89151926 },
            2017: { value: 3330773, cumul: 92482699 },
            2018: { value: 3351570, cumul: 95834269 },
            reserve: 50000,
        },
    };

    var data_ready = entries(Object.values(data)[0]);

    // Add X axis --> it is a date format
    var x = d3
        .scaleUtc()
        .domain(
            d3.extent(data_ready, function (d) {
                if (d.key != "reserve") {
                    console.log(d.key);
                    return d.key;
                }
            })
        )
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(data_ready, function (d) {
                return +d.values.value;
            }),
        ])
        .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data_ready)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
            "d",
            d3
                .line()
                .x(function (d) {
                    if (d.key != "reserve") return x(d.key);
                })
                .y(function (d) {
                    return y(d.values.value);
                })
        );

    svg.append("path")
        .datum(data_ready)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr(
            "d",
            d3
                .line()
                .x(function (d) {
                    if (d.key != "reserve") return x(d.key);
                })
                .y(function (d) {

                    return y(Object.values(data)[0]['reserve']);
                })
        );
}

drawLinechart("#my_dataviz");
