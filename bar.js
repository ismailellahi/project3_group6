// Read URL
const url = "http://127.0.0.1:5000/api/v1.0/FireLocations/floatingChart";

// Fetch the JSON data 
d3.json(url).then(function(data) {

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

    // Create an array to store information about min, max, avg response time for each station
    let stationList = [];

    // Store time information for each station ID
    function stationTimeList(idList) {
        for (let i = 0; i < idList.length; i++) {
            // Create an array to store information
            let stationTimeDict = {};
            let keys = ["stationId", "avgTime", "avgTimeRounded", "minTime","maxTime","numIncidents","monthTrend"];
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
            let avg = timeList.reduce((accumulator, currentValue) => {return accumulator + currentValue},0)/timeList.length;
            let avgRounded = Math.round(avg);
            let numInc = timeList.length;

            // Record month trend
            let listOfMonths = ["January", "February","March","April","May","June","July","August","September","October","November","December"]
            let monthList = [];
            for (let y = 1; y<=12; y++) {
                let monthData = {};
                let monthKeys = ["month","min_time","max_time"];
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
    
    function idLoop(element,namesList1,namesList2) {
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
    idLoop(dropdownId,stationsAboveId,stationsBelowId);

    // Add list of stations with metadata to the text box
    let stationMetaData = d3.select("#station-data");
    
    function StationLoop(element,dataList1,dataList2) {
        element.html("")
        let dropdownGroupValue = dropdownGroup.property("value");
        if (dropdownGroupValue == "aboveAvg") {
            // If main drop down is at ABOVE
            let metaData = dataList1.map(dataList1 => {
                return `ID ${dataList1.stationId}: ${dataList1.numIncidents} incid, avg time ${dataList1.avgTimeRounded} min.`;
            });
            for (let i = 0; i<metaData.length;i++) {
                stationMetaData.append('p').text(metaData[i]);
            }
        } else if (dropdownGroupValue == "belowAvg") {
            // If main drop down is at BELOW
            let metaData = dataList2.map(dataList2 => {
                return `ID ${dataList2.stationId}: ${dataList2.numIncidents} incid, avg time ${dataList2.avgTimeRounded} min.`;
            });
            for (let i = 0; i<metaData.length;i++) {
                stationMetaData.append('p').text(metaData[i]);
            }
        }
    }
    StationLoop(stationMetaData,sortedStationsAbove,sortedStationsBelow);

    // On change to Group filter, update related data
    dropdownGroup.on("change", function() {
        // Update Sation ID filter
        idLoop(dropdownId,stationsAboveId,stationsBelowId);
        // Update List of stations in the group
        StationLoop(stationMetaData,sortedStationsAbove,sortedStationsBelow);
    });

    // Create a dynamic dataset for floating chart
    function floatigChartData(element) {
        let dropdownIdValue = element.property("value");
        // Filter data by station ID
        let dataList = fullStationList.filter(item => item.stationId == dropdownIdValue);
        let sampleData = dataList.map (item => item.monthTrend);  
        return (sampleData);
    }

    // // Create floating bar chart
    // const config = {
    //     type: 'bar',
    //     data: data,
    //     options: {
    //       responsive: true,
    //       plugins: {
    //         legend: {
    //           position: 'top',
    //         },
    //         title: {
    //           display: true,
    //           text: 'Chart.js Floating Bar Chart'
    //         }
    //       }
    //     }
    //   };

    // const DATA_COUNT = 7;
    // const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

    // const labels = Utils.months({count: 7});
    // const data = {
    // labels: labels,
    // datasets: [
    //     {
    //     label: 'Dataset 1',
    //     data: labels.map(() => {
    //         return [Utils.rand(-100, 100), Utils.rand(-100, 100)];
    //     }),
    //     backgroundColor: Utils.CHART_COLORS.red,
    //     },
    //     {
    //     label: 'Dataset 2',
    //     data: labels.map(() => {
    //         return [Utils.rand(-100, 100), Utils.rand(-100, 100)];
    //     }),
    //     backgroundColor: Utils.CHART_COLORS.blue,
    //     },
    // ]
    // };

    // const actions = [
    //     {
    //       name: 'Randomize',
    //       handler(chart) {
    //         chart.data.datasets.forEach(dataset => {
    //           dataset.data = chart.data.labels.map(() => {
    //             return [Utils.rand(-100, 100), Utils.rand(-100, 100)];
    //           });
    //         });
    //         chart.update();
    //       }
    //     },
    //   ];

    // On change to Station id filter, update related data
    dropdownId.on("change", function() {
        // Update Floating Chart Data
        let test = floatigChartData(dropdownId)
        d3.select("#floatingbar").append('p').text(JSON.stringify(test));
    });

    

    







// init();

});