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

        let calltype = Array.from(new Set(filteredData.map(item => item
          .Initial_CAD_Event_Call_Type)));
        let incidenttype = Array.from(new Set(filteredData.map(item => item
          .Final_Incident_Types)));
        let alarmlevel = Array.from(new Set(filteredData.map(item => item
          .Event_Alarm_Level)));

        var pieData1 = [
            {
                labels: calltype,
                type: 'pie'
            }
        ];

        var pieData2 = [
            {
                labels: incidenttype,
                type: 'pie'
            }
        ];

        var pieData3 = [
            {
                labels: alarmlevel,
                type: 'pie'
            }
        ];

        var layout = {
            width: 750,
            height: 400
        };

        // Update the pie charts
        Plotly.newPlot('pie-chart1', pieData1, layout);
        Plotly.newPlot('pie-chart2', pieData2, layout);
        Plotly.newPlot('pie-chart3', pieData3, layout);
    }

    // Initial update for all pie charts with the first location
    var initialLocation = locations[0]; // Change this if you want a different initial location
    updatePieCharts(initialLocation);

    // Handle dropdown menu change event
    locationDropdown.on("change", function () {
        var selectedLocation = d3.select(this).property("value");
        updatePieCharts(selectedLocation);
    });

});
