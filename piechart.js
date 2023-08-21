// Load the CSV data  
d3.json("http://127.0.0.1:5000/api/v1.0/FireLocations").then(data => {
    let locations = Array.from(new Set(data.map(item => item.Location)));

    // Populate the dropdown menu with options
    var locationDropdown = d3.select("#locationDropdown");
    locationDropdown.selectAll("option")
        .data(locations)
        .enter()
        .append("option")
        .text(location => location)
        .attr("value", location => location);

    // Function to update pie charts based on selected location
    function updatePieCharts(selectedLocation) {
        let filteredData = data;
        if (selectedLocation !== "all") {
            filteredData = data.filter(item => item.Location === selectedLocation);
        }

        let alarmLevelCounts = {};
        filteredData.forEach(item => {
            if (alarmLevelCounts[item.Event_Alarm_Level]) {
                alarmLevelCounts[item.Event_Alarm_Level]++;
            } else {
                alarmLevelCounts[item.Event_Alarm_Level] = 1;
            }
        });

        let alarmLevels = Object.keys(alarmLevelCounts);
        let alarmCounts = Object.values(alarmLevelCounts);

        var pieData3 = [
            {
                labels: alarmLevels,
                values: alarmCounts,
                type: 'pie',
                marker: {
                    colors: Plotly.d3.scale.category10().range() 
                }
            }
        ];

        var layout = {
            width: 750,
            height: 500,
        };

        // Update the pie charts
        Plotly.newPlot('pie-chart3', pieData3, layout);

    }

    // Initial update for all pie charts with the first location
    var initialLocation = locations[0]; 
    updatePieCharts(initialLocation);

    // Handle dropdown menu change event
    locationDropdown.on("change", function () {
        var selectedLocation = d3.select(this).property("value");
        updatePieCharts(selectedLocation);
    });
});
