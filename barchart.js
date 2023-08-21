document.addEventListener("DOMContentLoaded", function() {
  const dataUrl = "http://127.0.0.1:5000/api/v1.0/FireLocations";

  fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
      
      // top 15 stations with the largest number of incidents
      let locations = {}
      data.forEach(e => {
        if (e['Location'] in locations) {
          locations[e['Location']] = locations[e['Location']] + 1
        } else {
          locations[e['Location']] = 1
        }
        
      });

      function getTopRecords(jsonData, count) {
        const sortedEntries = Object.entries(jsonData).sort((a, b) => b[1] - a[1]);
        const topEntries = sortedEntries.slice(0, count);
        const result = Object.fromEntries(topEntries);
        return result;
      }
      
      const topRecords = getTopRecords(locations, 15);

      const stationNames = Object.keys(topRecords);
      const incidentCounts = Object.values(topRecords);

      // Generate an array of different colors for each bar
      const barColors = [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        // Add more colors as needed
      ];

      // Assign different colors to each bar
      const backgroundColors = barColors.slice(0, stationNames.length);

      const horizontalBarChartCanvas = document.getElementById("horizontalBarChart");
      new Chart(horizontalBarChartCanvas, {
        type: 'bar',
        data: {
          labels: stationNames,
          datasets: [{
            data: incidentCounts,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(0, 0, 0, 0.8)',
            borderWidth: 1,
            label: 'Number of Incidents', // Add this label
          }]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Location Names',
                font: {
                  size: 16,
                },
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Number of Incidents',
                font: {
                  size: 16,
                },
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
          // Set white background for the chart
          backgroundColor: 'white',
          // Set the title and font properties
          plugins: {
            title: {
              display: true,
              text: 'Top 15 Locations with the Highest # of Incidents',
              position: 'top',
              font: {
                size: 20,
              },
            },
          },
        }
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// document.addEventListener("DOMContentLoaded", function() {
//   const dataUrl = "http://127.0.0.1:5000/api/v1.0/FireLocations";

//   fetch(dataUrl)
//     .then(response => response.json())
//     .then(data => {
      
//       // top 15 stations with the largest number of incidents
//       let locations = {}
//       data.forEach(e => {
//         if (e['Location'] in locations) {
//           locations[e['Location']] = locations[e['Location']] + 1
//         } else {
//           locations[e['Location']] = 1
//         }
        
//       });

//       function getTopRecords(jsonData, count) {
//         const sortedEntries = Object.entries(jsonData).sort((a, b) => b[1] - a[1]);
//         const topEntries = sortedEntries.slice(0, count);
//         const result = Object.fromEntries(topEntries);
//         return result;
//       }
      
//       const topRecords = getTopRecords(locations, 15);
//       console.log(topRecords);


//       const stationNames = Object.keys(topRecords);
//       const incidentCounts = Object.values(topRecords);

//       const horizontalBarChartCanvas = document.getElementById("horizontalBarChart");
//       new Chart(horizontalBarChartCanvas, {
//         type: 'bar',
//         data: {
//           labels: stationNames,
//           datasets: [{
//             label: 'Top 15 Stations with the Highest # of Incidents',
//             data: incidentCounts,
//             backgroundColor: 'rgba(75, 192, 192, 0.6)',
//           }]
//         },
//         options: {
//           scales: {
//             x: {
//               beginAtZero: true,
//               title: {
//                 display: true,
//                 text: 'Station Names'
//               }
//             },
//             y: {
//               title: {
//                 display: true,
//                 text: 'Number of Incidents'
//               }
//             }
//           }
//         }
//       });
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//     });
// });