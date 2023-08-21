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

    // Function to create custom legends
    // function createLegend(data, containerId) {
    //     var legendContainer = document.getElementById(containerId);

    //     data[0].labels.forEach(function(label, index) {
    //         var legendItem = document.createElement('div');
    //         legendItem.className = 'legend-item';
    //         legendItem.innerHTML = `
    //             <div class="legend-color" style="background-color:${data[0].marker.colors[index]}"></div>
    //             <div class="legend-label">${label}</div>
    //         `;
    //         legendContainer.querySelector('.legend-box').appendChild(legendItem);
    //     });
    // }

    // Function to update pie charts based on selected location
    function updatePieCharts(selectedLocation) {
        let filteredData = data;
        if (selectedLocation !== "all") {
            filteredData = data.filter(item => item.Location === selectedLocation);
        }

        let calltype = Array.from(new Set(filteredData.map(item => item.Initial_CAD_Event_Call_Type)));
        let incidenttype = Array.from(new Set(filteredData.map(item => item.Final_Incident_Types)));
        let alarmlevel = Array.from(new Set(filteredData.map(item => item.Event_Alarm_Level)));

        var pieData1 = [
            {
                labels: calltype,
                type: 'pie',
                marker: {
                    colors: Plotly.d3.scale.category10().range() // You can use a color scale for variety
                }
            }
        ];

        var pieData2 = [
            {
                labels: incidenttype,
                type: 'pie',
                marker: {
                    colors: Plotly.d3.scale.category10().range() // You can use a color scale for variety
                }
            }
        ];

        var pieData3 = [
            {
                labels: alarmlevel,
                type: 'pie',
                marker: {
                    colors: Plotly.d3.scale.category10().range() // You can use a color scale for variety
                }
            }
        ];

        var layout = {
            width: 750,
            height: 500,
            showlegend: false, // Disable the built-in legend
            // Other layout properties
        };

        // Update the pie charts
        Plotly.newPlot('pie-chart1', pieData1, layout);
        Plotly.newPlot('pie-chart2', pieData2, layout);
        Plotly.newPlot('pie-chart3', pieData3, layout);

        // Create custom legends
        // createLegend(pieData1, 'legend-container1');
        // createLegend(pieData2, 'legend-container2');
        // createLegend(pieData3, 'legend-container3');
    }

    // Initial update for all pie charts with the first location
    var initialLocation = locations[0]; // Change this if you want a different initial location
    updatePieCharts(initialLocation);

    // Handle dropdown menu change event
    locationDropdown.on("change", function () {
        var selectedLocation = d3.select(this).property("value");
        updatePieCharts(selectedLocation);
    });

    // Apply CSS class to legend items
    // var legendItems1 = document.querySelectorAll('#legend-container1 .legend-label');
    // legendItems1.forEach(item => item.classList.add('legend-label'));

    // var legendItems2 = document.querySelectorAll('#legend-container2 .legend-label');
    // legendItems2.forEach(item => item.classList.add('legend-label'));

    // var legendItems3 = document.querySelectorAll('#legend-container3 .legend-label');
    // legendItems3.forEach(item => item.classList.add('legend-label'));
});
