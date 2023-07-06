var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
    });

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

d3.json(url).then(function(data){
    console.log(data)
    for (var i = 0; i < data.features.length; i++){


        coords = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
        
        var color = '';
        var depth = data.features[i].geometry.coordinates[2];
        switch(true){
            case (depth > -10 && depth < 10):
                color = 'RGB(163, 246, 0)'
                break;
            case (depth >= 10 && depth < 30):
                color = 'RGB(220,244,0)'
                break;
            case (depth >= 30 && depth < 50):
                color = 'RGB(247,219,17)'
                break;
            case (depth >= 50 && depth < 70):
                color = 'RGB(253,183,42)'
                break;
            case ( depth >= 70 && depth < 90):
                color = 'RGB(252,163,93)'
                break;
            case (depth >= 90):
                color = 'RGB(255,95,101)'
                break;
        }


        var date = moment(data.features[i].properties.time).format('MMMM Do YYYY')
        var time =  moment(data.features[i].properties.time).format('h:mm:ss a')
        var loc = data.features[i].properties.place
        var mag = data.features[i].properties.mag

        L.circle(coords, {
            opacity: .5,
            fillOpacity: 0.7,
            weight: .5,
            color: 'black',
            stroke: true,
            fillColor: color,
            radius: 7000 * data.features[i].properties.mag
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br> <strong>Time:</strong>${time} <br>
     <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap)

    newMarker = L.layer
}});

var legend = L.control({position: 'bottomright'});


legend.onAdd = function (){
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = [
        'RGB(163, 246, 0)',
        'RGB(220,244,0)',
        'RGB(247,219,17)',
        'RGB(253,183,42)',
        'RGB(252,163,93)',
        'RGB(255,95,101)'
        ];
    var labels = [];
    grades.forEach(function(grade, index){
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 25px"+ "; height: 20px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })
  
    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;

};

legend.addTo(myMap);