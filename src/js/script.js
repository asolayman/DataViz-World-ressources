


////// COMPUTER COMPOSITION //////
var computerCompositionLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/computer_composition.csv';

d3.dsv(';', computerCompositionLink).then(function (data) {
    console.log(data);

    var finalDataOver = [{
        'name': 'Minéraux en faibles quantités',
        'percentage': 0,
        'weight': 0,
        'info': ''
    }];
    var finalDataSub = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i]['Metal'] != "") {
            let percentage = parseFloat(data[i]['Pourcent'].replace(',', '.'));
            let weight = parseFloat(data[i]['Poids'].replace(',', '.'));
            
            if (!Number.isNaN(percentage) && !Number.isNaN(weight)) {
                if (percentage >= 1) {
                    finalDataOver.push({
                        'name': data[i]['Metal'],
                        'percentage': percentage,
                        'weight': weight,
                        'info': data[i]['Utilisation']
                    });
                } else {
                    finalDataOver[0]['percentage'] += percentage;
                    finalDataOver[0]['weight'] += weight;
                    
                    finalDataSub.push({
                        'name': data[i]['Metal'],
                        'percentage': percentage,
                        'weight': weight,
                        'info': data[i]['Utilisation']
                    });
                }
            }
        }
    }
    
    console.log(finalDataOver);
    
    drawPiechart("#piechart1", finalDataOver);
    drawPiechart("#piechart2", finalDataSub);
});



////// PHONE COMPOSITION //////
var phoneCompositionLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/phone_composition.csv';

d3.dsv(';', phoneCompositionLink).then(function (data) {
    console.log(data);

    var finalData = {};
    for (var i = 0; i < data.length; i++) {
        if (finalData[data[i]['Metal']] === undefined) {
            let percentage = parseFloat(data[i]['Pourcent'].replace(',', '.'));
            let weight = parseFloat(data[i]['Poids'].replace(',', '.'));
            
            if (!Number.isNaN(percentage) && !Number.isNaN(weight)) {
                finalData[data[i]['Metal']] = {
                    'name': data[i]['Metal'],
                    'percentage': percentage,
                    'weight': weight,
                    'info': ""
                }
            }
        }
    }
    
    console.log(finalData);
});



////// WORLD PRODUCTION & RESERVES //////
var mineralProductionLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/mineral_production.csv';
var mineralReservesLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/mineral_reserves.csv';
var worldMapLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/world_map.json';

d3.dsv(';', mineralProductionLink).then(function (dataProduction) {
    d3.dsv(';', mineralReservesLink).then(function (dataReverves) {
        d3.json(worldMapLink).then(function (jsonMap) {
            console.log(dataProduction);
            console.log(dataReverves);
            console.log(jsonMap);

            var finalMapData = jsonMap;
            var finalCurveData = {};
            
            for (var j = 0; j < finalMapData.features.length; j++) {
                finalMapData.features[j].properties.metals = {};
            }
            
            for (var i = 0; i < dataProduction.length; i++) {
                let dataPays = dataProduction[i].Pays;
                let dataMetal = dataProduction[i].Metal;
                
                if (dataMetal != "") {
                    if (finalCurveData[dataMetal] === undefined) {
                        finalCurveData[dataMetal] = {'reserve': undefined};
                        
                        for (var k = 1975; k <= 2018; k++) {
                            finalCurveData[dataMetal][k.toString()] = {'value': 0, 'cumul': 0};
                        }
                    }
                    
                    for (var k = 1975; k <= 2018; k++) {
                        if (dataProduction[i][k.toString()] != "") {
                            finalCurveData[dataMetal][k.toString()]['value'] += parseFloat(dataProduction[i][k.toString()].replace(',', '.'));
                            
                            for (var n = k; n <= 2018; n++) {
                                finalCurveData[dataMetal][n.toString()]['cumul'] += parseFloat(dataProduction[i][k.toString()].replace(',', '.'));
                            }
                        }
                    }
                }
                
                for (var j = 0; j < finalMapData.features.length; j++) {
                    let jsonPays = finalMapData.features[j].properties.name;
                    
                    if (dataPays == jsonPays) {
                        if (finalMapData.features[j].properties.metals[dataMetal] === undefined) {
                            finalMapData.features[j].properties.metals[dataMetal] = {}
                            
                            for (var k = 1975; k <= 2018; k++) {
                                finalMapData.features[j].properties.metals[dataMetal][k.toString()] = {'value': 0, 'cumul': 0};
                            }
                        }
                        
                        for (var k = 1975; k <= 2018; k++) {
                            if (dataProduction[i][k.toString()] != "") {
                                finalMapData.features[j].properties.metals[dataMetal][k.toString()]['value'] += parseFloat(dataProduction[i][k.toString()].replace(',', '.'));
                                
                                for (var n = k; n <= 2018; n++) {
                                    finalMapData.features[j].properties.metals[dataMetal][n.toString()]['cumul'] += parseFloat(dataProduction[i][k.toString()].replace(',', '.'));
                                }
                            }
                        }
                    }
                }
            }
            
            for (var i = 0; i < dataReverves.length; i++) {
                let dataValue = dataReverves[i].Capacité;
                let dataMetal = dataReverves[i].Metal;
                
                if (dataMetal != "" && dataValue != "") {
                    finalCurveData[dataMetal]['reserve'] = parseFloat(dataValue.replace(',', '.'));
                }
            }
            
            console.log(finalMapData);
            console.log(finalCurveData);
        });
    });
});


