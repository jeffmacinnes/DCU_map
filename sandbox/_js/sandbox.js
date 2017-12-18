

var w = 600
var h = 600

d3.select("#vizArea")
    .style("height", h+"px")
    .style("width", w+"px");

// MAP SET-UP ********************************
// init map, add controls
var map = L.map('vizArea', {
    zoom: 6,
    minZoom: 6,
    maxZoom: 10,
    attributionControl: false
}).setView([53.505, -7]);

// add the map tiles
L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}').addTo(map);

// // add SVG element to the map's overlay pane
var svgMapLayer = L.svg();
svgMapLayer.addTo(map)

var svg = d3.select("#vizArea").select("svg")

// add group to the svg element, give it the leaflet-zoom-hide attribute
// This will be used to translate the SVG elements such that the top-left
// corner of the SVG element (0,0) corresponds to Leaflet's layer origin
var circleGroup = svg.append("g").attr("class", "leaflet-zoom-hide");


// D3 INTERACTION FUNCTIONS *********************
// Load the JSON data and add svg elements for each item
// Note: the load json command is Async, thus the rest of the code is
// in callback
d3.json("./fakeData.json", function(data){

    // project all datapoints to x,y coords of the map
    data.forEach(function(d) {
        d.LatLng = projectPointToMap(d.lat, d.lng)
        console.log(d);
    })

    // custom function that will allow us to project points to a new
    // geometry (namely, the x/y grid defined by the current map
    // zoom and location)
    // function to map from lng/lat to x,y on the leaflet plane
    function projectPointToMap(lat, lng){
        //console.log(lat, lng);
        var point = map.latLngToLayerPoint(new L.LatLng(lat, lng));
        //console.log(point);
        return point;
    }

    // add circle for every item in data
    var circles = circleGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", function(d){
            console.log(d);
            return d.LatLng.x;
        })
        .attr("cy", function(d){
            return d.LatLng.y;
        })
        .attr("r", 15)
        .style("fill", "blue")
        .attr("fill-opacity", 0.3);


    // function to update points whenever the map moves,pans,or zooms
    function updatePoints(){
        console.log('updating...')
        circles.attr("cx", function(d) {
            d.LatLng = projectPointToMap(d.lat, d.lng)
            return d.LatLng.x
        });
        circles.attr("cy", function(d) {
            console.log("new points: ", d.LatLng.x, d.LatLng.y);
            return d.LatLng.y
        })
    }

    map.on('moveend', updatePoints);
    updatePoints();


})
