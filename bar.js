// Populate Data in Text boxes and BUild FLoating Chart
// Fetch the JSON data 
d3.json("http://127.0.0.1:5000/api/v1.0/FireLocations/floatingChart").then(function (data) {

    // List all the unique stations
    let uniqueStation = Array.from(new Set(data.map((item) => item.Incident_Station_Area)));
    let uniqueStationSorted = uniqueStation.sort((firstNum, secondNum) => firstNum - secondNum);
    // Count number of unique stations
    let stationNumber = uniqueStation.length;
    // Print # of unique stations in the box
    let stationBox = d3.select("#num-stations-data");
    stationBox.text(stationNumber);

    // Calculate AVG response time
    function avgRespTime(data) {
        let sum = 0;
        for (let obj of data) {
            sum += obj.Time_Taken_to_Arrive;
        }
        return sum / data.length;
    }
    let avgT = avgRespTime(data);
    let avgRoundedT = Math.round(avgT);
    // Print avg Response time in the box
    let timeBox = d3.select("#avg-time");
    timeBox.text(avgRoundedT);

    // Create an array to store information about min, max, avg response time, # of incidents, month trend for each station
    let stationList = [];

    // Create a list to store months of the year
    let listOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    // Store time information for each station ID
    function stationTimeList(idList) {
        for (let i = 0; i < idList.length; i++) {
            // Create an array to store information
            let stationTimeDict = {};
            let keys = ["stationId", "avgTime", "avgTimeRounded", "minTime", "maxTime", "numIncidents", "monthTrend"];
            for (let key of keys) {
                stationTimeDict[key] = undefined;
            }
            // Filter data by station ID
            let sampleData = data.filter(item => item.Incident_Station_Area == idList[i]);
            // Create a list of all incidents arrival time
            let timeList = sampleData.map(item => item.Time_Taken_to_Arrive);
            // Calculate min, max, avg, # of incidents
            let min = Math.min(...timeList);
            let max = Math.max(...timeList);
            let avg = timeList.reduce((accumulator, currentValue) => { return accumulator + currentValue }, 0) / timeList.length;
            let avgRounded = Math.round(avg);
            let numInc = timeList.length;

            // Record month trend
            let monthList = [];
            for (let y = 1; y <= 12; y++) {
                let monthData = {};
                let monthKeys = ["month", "min_time", "max_time", "incid_num"];
                for (let key of monthKeys) {
                    monthData[key] = undefined;
                }
                // Filter data by month
                let sampleMonthData = sampleData.filter(item => item.Month == y);
                // Create a list of all incidents arrival time
                let timeListMonth = sampleMonthData.map(item => item.Time_Taken_to_Arrive);
                // Calculate min, max for a particular month
                let min_t = Math.min(...timeListMonth);
                let max_t = Math.max(...timeListMonth);
                // Add values to a dictionary
                monthData.month = listOfMonths[y - 1];
                monthData.min_time = min_t;
                monthData.max_time = max_t;
                monthData.incid_num = timeListMonth.length;
                // Add new object to a list
                monthList.push(monthData);
            }
            // Add values to a dictionary
            stationTimeDict.stationId = idList[i];
            stationTimeDict.avgTime = avg;
            stationTimeDict.minTime = min;
            stationTimeDict.maxTime = max;
            stationTimeDict.avgTimeRounded = avgRounded;
            stationTimeDict.numIncidents = numInc;
            stationTimeDict.monthTrend = monthList;
            // Add new object to a list
            stationList.push(stationTimeDict);
        }
        return stationList;
    }
    let fullStationList = stationTimeList(uniqueStationSorted);

    // List all the stations whose avg response time is ABOVE overall avg
    let stationsAbove = fullStationList.filter(item => item.avgTime > parseFloat(avgT));
    let stationsAboveId = stationsAbove.map(item => item.stationId);
    // Sort the data by # of incidents decending
    let sortedStationsAbove = stationsAbove.sort((firstNum, secondNum) => secondNum.numIncidents - firstNum.numIncidents)

    // List all the stations whose avg response time is BELOW overall avg (included)
    let stationsBelow = fullStationList.filter(item => item.avgTime <= parseFloat(avgT));
    let stationsBelowId = stationsBelow.map(item => item.stationId)
    // Sort the data by # of incidents decending
    let sortedStationsBelow = stationsBelow.sort((firstNum, secondNum) => secondNum.numIncidents - firstNum.numIncidents)

    // Main dropdown menu value check
    let dropdownGroup = d3.select("#selDataset");

    // Add station IDs to dropdown menu
    let dropdownId = d3.select("#selDatasetStation");

    function idLoop(element, namesList1, namesList2) {
        element.html("")
        let dropdownGroupValue = dropdownGroup.property("value");
        if (dropdownGroupValue == "aboveAvg") {
            // If main drop down is at ABOVE
            for (let i = 0; i < namesList1.length; i++) {
                element.append("option").text(namesList1[i]).property("value", namesList1[i]);
            }
        } else if (dropdownGroupValue == "belowAvg") {
            // If main drop down is at BELOW
            for (let i = 0; i < namesList2.length; i++) {
                element.append("option").text(namesList2[i]).property("value", namesList2[i]);
            }
        }
    }
    idLoop(dropdownId, stationsAboveId, stationsBelowId);

    // Add list of stations with metadata to the text box
    let stationMetaData = d3.select("#station-data");

    function StationLoop(element, dataList1, dataList2) {
        element.html("")
        let dropdownGroupValue = dropdownGroup.property("value");
        if (dropdownGroupValue == "aboveAvg") {
            // If main drop down is at ABOVE
            let metaData = dataList1.map(dataList1 => {
                return `ID ${dataList1.stationId}: ${dataList1.numIncidents} incid, avg time ${dataList1.avgTimeRounded} min.`;
            });
            for (let i = 0; i < metaData.length; i++) {
                stationMetaData.append('p').text(metaData[i]);
            }
        } else if (dropdownGroupValue == "belowAvg") {
            // If main drop down is at BELOW
            let metaData = dataList2.map(dataList2 => {
                return `ID ${dataList2.stationId}: ${dataList2.numIncidents} incid, avg time ${dataList2.avgTimeRounded} min.`;
            });
            for (let i = 0; i < metaData.length; i++) {
                stationMetaData.append('p').text(metaData[i]);
            }
        }
    }
    StationLoop(stationMetaData, sortedStationsAbove, sortedStationsBelow);

    // On change to Group filter, update related data
    dropdownGroup.on("change", function () {
        // Update Sation ID filter
        idLoop(dropdownId, stationsAboveId, stationsBelowId);
        // Update List of stations in the group
        StationLoop(stationMetaData, sortedStationsAbove, sortedStationsBelow);
        // Update donut chart
        newData = selectColours(dropdownGroup);
        Plotly.react("donut", newData, donutLayout);
    });

    // Create a dynamic dataset for floating chart
    function floatigChartData(element) {
        let dropdownIdValue = element.property("value");
        // Filter data by station ID
        let dataList = fullStationList.filter(item => item.stationId == dropdownIdValue);
        let sampleData = dataList.map(item => item.monthTrend);
        //Create a list to store min max time range
        let timeRange = [];
        //Create a list to store number of incidents
        let numberOfIncidents = [];
        // Loop through the data to store itin the lists
        for (let obj of sampleData) {
            for (let a of obj) {
                timeRange.push([a.min_time, a.max_time]);
                numberOfIncidents.push(a.incid_num);
            }
        }
        return ([timeRange, numberOfIncidents]);
    }

    // Create floating bar chart 
    // Define location where the floating bar chart will be placed   
    const ctx = document.getElementById('floatingbar');

    // Create a dataset for the floating bar chart
    let barChartData = {
        labels: listOfMonths,
        datasets: [{
            data: floatigChartData(dropdownId)[0],
            label: "Response Time Range, min",
            backgroundColor: '#E9BFB7',
            borderColor: '#801600',
            borderWidth: 1,
        }]
    };

    // Create a config
    let config = {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Response time for Station ID ${dropdownId.property("value")}`
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: false
                    },
                    grid: {
                        display: false
                    },
                },
            },
        },
    };

    // Create a chart
    let floatingBarChart = new Chart(ctx, config);

    // On change to Station id filter, update related data
    document.getElementById('selDatasetStation').addEventListener('change', function () {
        let dropdownIDValue = this.value;
        // Update Floating Chart Data
        let newData = floatigChartData(dropdownId)[0];
        let newTitle = `Response time for Station ID ${dropdownIDValue}`;
        // Reflect the changes on the chart
        floatingBarChart.data.datasets[0].data = newData;
        floatingBarChart.options.plugins.title.text = newTitle;
        floatingBarChart.update();
        
    });


    // Build Bar chart for Incident types
    // Fetch the JSON data 
    d3.json("http://127.0.0.1:5000/api/v1.0/FireLocations/barChart").then(function (data) {

        // Change Dataset dynamically depending on Station ID in the filter
        function stationIncidentType(stationId) {
            // Filter array on Station ID Value
            let incidentData = data.filter(item => item.Incident_Station_Area == stationId);

            // Extract information about All the Incident types for this station
            let incidentList = Array.from(new Set(incidentData.map((item) => item.Final_Incident_Types)));
            let incidentNumList = [];
            for (let i = 0; i < incidentList.length; i++) {
                let incidTypeNum = incidentData.filter(item => item.Final_Incident_Types == incidentList[i]).length;
                incidentNumList.push([incidentList[i], incidTypeNum]);
            };
            // Sort the array in descending order by number of incidents for each type
            let incidentNumSorted = incidentNumList.sort((a, b) => b[1] - a[1]);
            let top15 = incidentNumSorted.slice(0, 15);
            // let reversedtop15 = top15.reverse();
            let top15Dict = Object.fromEntries(top15);
            let x = Object.keys(top15Dict);
            let y = Object.values(top15Dict);

            // Set trace for barchart
            let trace = [{
                x: x,
                y: y,
                type: "bar",
                marker: {
                    color: '#dba59a',
                    line: {
                        color: '#801600',
                        width: 0.3
                    },
                },
            }];

            // Set layout for barchart
            let layout = {
                title: {
                    text: `Top 15 most common Incident Types for Station ID ${stationId}`,
                    font: {
                        size: 14,
                        family: "Helvetica",
                    },
                    y: 0.95
                },
                xaxis: {
                    font: {
                        family: 'Helvetica',
                        size: 12,
                    },
                    tickangle: -88,
                },
                yaxis: {
                    title: {
                        text: "# of Incidents",
                        font: {
                            family: 'Helvetica',
                            size: 14,
                            color: "#7f7f7f"
                        }
                    },
                    tickfont: {
                        color: "#7f7f7f",
                        size: 12,
                    }
                },
                height: 1100,
                width: 800,
                margin: {
                    l: 50,
                    r: 40,
                    t: 50,
                    b: 600
                }
            }
            return ([trace, layout]);
        };

        // Display the default charts
        function init() {
            // Retrieve data to build a chart
            let dropdownIdValue = dropdownId.property("value");
            let newDataArray = stationIncidentType(dropdownIdValue);
            // Create a bar chart
            Plotly.newPlot("vbarchart", newDataArray[0], newDataArray[1]);
        };
        init();

        // On change to filter, update data in charts
        dropdownId.on("change", function () {
            dropdownIdValue = dropdownId.property("value");
            newDataArray = stationIncidentType(dropdownIdValue);
            Plotly.react("vbarchart", newDataArray[0], newDataArray[1]);
        });

    });

    // Create donut chart to display ratio between # of station Above and Below AVG
    // Set a function to dynamically change colours
    function selectColours(element) {
        let dropdownValue = element.property("value");

        // Determine colours for the cahrt depend on selected group in the filter
        let colourList = [];
        if (dropdownValue == "aboveAvg") {
            // If main drop down is at ABOVE
            colourList.push('#dba59a', '#C7C6C5');
        } else if (dropdownValue == "belowAvg") {
            // If main drop down is at BELOW
            colourList.push('#C7C6C5', '#dba59a');
        };

        // Set trace for donut chart
        let donutTrace = [{
            values: [stationsAboveId.length, stationsBelowId.length],
            labels: ["Stations with response time ABOVE avg", "Stations with response time BELOW avg"],
            hoverinfo: 'label+percent',
            insidetextfont: {
                size: 20,
              },
            hole: .4,
            type: 'pie',
            marker: {
                colors: colourList
            }
        }];
        return (donutTrace);
    };

    // Set layout for donut chart
    let donutLayout = {
        title: {
            text: '# of Stations ABOVE vs. BELOW avg resp.time',
            font: {
                size: 12,
                family: "Helvetica",
            },
        },
        height: 320,
        width: 320,
        margin: {
            l: 50,
            r: 50,
            t: 30,
            b: 50
        },
        showlegend: false,
    };

    // Create a new Plot
    function init() {
        let data = selectColours(dropdownGroup);
        Plotly.newPlot("donut", data, donutLayout);
    };
    init();

});
