


////// COMPUTER COMPOSITION //////
var computerCompositionLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/computer_composition.csv';

d3.dsv(';', computerCompositionLink).then(function (data) {
    // console.log(data);

    var finalDataOver = [{
        'name': 'Composants en faibles quantités (<1%)',
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
    
    // console.log(finalDataOver);
    // console.log(finalDataSub);
    
    drawPiechart('#chartPcOver', '#legendPcOver', finalDataOver);
    drawPiechart('#chartPcSub', '#legendPcSub', finalDataSub);
});



////// PHONE COMPOSITION //////
var phoneCompositionLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/phone_composition.csv';

d3.dsv(';', phoneCompositionLink).then(function (data) {
    // console.log(data);

    var finalDataOver = [{
        'name': 'Composants en faibles quantités (<1%)',
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
    
    // console.log(finalDataOver);
    // console.log(finalDataSub);
    
    drawPiechart('#chartPhoneOver', '#legendPhoneOver', finalDataOver);
    drawPiechart('#chartPhoneSub', '#legendPhoneSub', finalDataSub);
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
                            finalCurveData[dataMetal][k.toString()] = {'year': k.toString(), 'value': 0, 'cumul': 0};
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
                        
                        break;
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
            
            

            function doThings() {
                let metal = d3.select('#mapSelect').node().value;
                let cumul = d3.select('#mapCheck').node().checked;
                let reserve = d3.select('#curveCheck').node().checked;
                let year = d3.select('#mapSlider').node().value;
                
                updateMap = drawMap('#map', metal, cumul, finalMapData);
                d3.select('#mapSlider').on('input', function () {
                    updateMap(+this.value);
                    d3.select('#yearLabel').html('Année (' + +this.value + ')');
                    
                    if (cumul) {
                        d3.select('#titreCarte').html('Production de/d\' ' + metal + ' en ' + +this.value + ', cumulée depuis 1975');
                    } else {
                        d3.select('#titreCarte').html('Production de/d\' ' + metal + ' en ' + +this.value);
                    }
                });
                updateMap(+year);
                
                d3.select('#yearLabel').html('Année (' + year + ')');
                if (cumul) {
                    d3.select('#titreCarte').html('Production de/d\' ' + metal + ' en ' + year + ', cumulée depuis 1975');
                    d3.select('#titrePlot').html('Production de/d\' ' + metal + ' de 1975 à 2018' + ', cumulée depuis 1975');
                } else {
                    d3.select('#titreCarte').html('Production de/d\' ' + metal + ' en ' + year);
                    d3.select('#titrePlot').html('Production de/d\' ' + metal + ' de 1975 à 2018');
                }
                
                drawLinechart("#leg", metal, cumul, reserve, finalCurveData);
            }
            
            doThings();
            
            window.onresize = () => doThings();
            
            d3.select('#mapSelect').on('input', function () {
                doThings();
            });
            
            d3.select('#mapCheck').on('input', function () {
                doThings();
            });
            
            d3.select('#curveCheck').on('input', function () {
                doThings();
            });
        });
    });
});



////// METAL ELEMENT //////
var metalElementLink = 'https://raw.githubusercontent.com/asolayman/DataViz-World-ressources/main/data/metal_element.csv';

d3.dsv(';', metalElementLink).then(function (data) {
    console.log(data);

    var finalData = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i]['Metal'] != "") {
            let nb = parseFloat(data[i]['Numéro'].replace(',', '.'));
            
            if (!Number.isNaN(nb)) {
                finalData.push({
                    'name': data[i]['Metal'],
                    'letter': data[i]['Lettre'],
                    'number': nb
                });
            }
        }
    }
    
    console.log(finalData);

    // drawBarchart('#chartElem', finalData);
    
    function doThings() {
        drawBarchart('#chartElem', finalData);
    }
    
    doThings();
    
    window.addEventListener('resize', function(event){
        doThings()
    });
});

