

function createMap(response) {  
    let fires = response;
    // console.log(fires)

    // let fireMarkers = [];
    let fireMarkersGreaterThanAvg = [];
    let fireMarkersLesserThanAvg = [];

    var myIcon = L.icon({
        iconUrl: 'my-icon.png',
        iconSize: [30, 50],
        iconAnchor: [30, 50],
        popupAnchor: [-15,-48]
        // shadowUrl: 'my-icon-shadow.png',
        // shadowSize: [10,20],
        // shadowAnchor: [0,0]
    });

    for (let i = 0; i < 1000; i++) {
        let fire = fires[i]

        // let fireMarker = L.marker([fire.Latitude,fire.Longitude])

        // fireMarkers.push(fireMarker)

        if (fire.Time_Taken_to_Arrive < 6.0) {
            let fireMarkerLesserThanAvg = L.marker([fire.Latitude, fire.Longitude], {icon: myIcon}).bindPopup(`<h1>${fire.Location}</h1> <hr> <h3>Station Area Code ${fire.Incident_Station_Area.toLocaleString()}</h3>`)
            fireMarkersLesserThanAvg.push(fireMarkerLesserThanAvg)
        }


    }

    for (let i = 0; i < 1000; i++) {
        let fire = fires[i]

        // let fireMarker = L.marker([fire.Latitude,fire.Longitude])

        // fireMarkers.push(fireMarker)

        if (fire.Time_Taken_to_Arrive >= 6.0) {
            let fireMarkerGreaterThanAvg = L.marker([fire.Latitude, fire.Longitude]).bindPopup(`<h1>${fire.Location}</h1> <hr> <h3>Station Area Code ${fire.Incident_Station_Area.toLocaleString()}</h3>`)
            fireMarkersGreaterThanAvg.push(fireMarkerGreaterThanAvg)
        }

        console.log(fireMarkersGreaterThanAvg)
    }

    let fireIncidentLesserAvg = L.layerGroup(fireMarkersLesserThanAvg)
    let fireIncidentGreaterAvg = L.layerGroup(fireMarkersGreaterThanAvg)

    let firemarkers = L.markerClusterGroup();

    for ( let i = 0; i < 3000; i++){
        let fire = fires[i];

        firemarkers.addLayer(L.marker([fire.Latitude, fire.Longitude]))
    }

    // Define variables for our tile layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Only one base layer can be shown at a time.
    let baseMaps = {
        Street: street,
        Topography: topo
    };

    // Overlays that can be toggled on or off
    let overlayMaps = {
        "Time Taken To Arrive > Avg": fireIncidentGreaterAvg,
        "Time Taken to Arrive < Avg": fireIncidentLesserAvg,
        "Fire incidents by Cluster" : firemarkers

    };

    // Create a map object, and set the default layers.
    let myMap = L.map("map", {
        center: [43.6510, -79.3470],
        zoom: 12,
        layers: [street, fireIncidentLesserAvg, fireIncidentGreaterAvg]
    });

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    myMap.addLayer(firemarkers)



}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("http://127.0.0.1:5000/api/v1.0/FireLocations").then(createMap);



