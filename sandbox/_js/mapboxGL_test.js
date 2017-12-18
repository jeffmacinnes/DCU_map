var w = 800
var h = 800

d3.select("#mapArea")
    .style("height", h+"px")
    .style("width", w+"px");



    // MAP SET-UP ********************************
var accessToken = 'pk.eyJ1IjoiamVmZm1hY2lubmVzIiwiYSI6ImNqOWR1Z2lmNjF5YzYycWxnZmQxOHU4d24ifQ.CBxxtAlqf03sh34hZ_jrNg';

//Setup mapbox-gl map
mapboxgl.accessToken = accessToken;
var map = new mapboxgl.Map({
    container: 'mapArea', // container id
    style:'mapbox://styles/mapbox/dark-v8',
    center: [-7, 53.505],
    interactive: true,
    zoom: 6,
})

//map.scrollZoom.disable()
map.addControl(new mapboxgl.Navigation());

// svg
var container = map.getCanvasContainer()
var svg = d3.select(container).append("svg")


// add group to the svg element, give it the leaflet-zoom-hide attribute
// This will be used to translate the SVG elements such that the top-left
// corner of the SVG element (0,0) corresponds to Leaflet's layer origin
var circleGroup = svg.append("g")

// D3 INTERACTION FUNCTIONS *********************
// Load the JSON data and add svg elements for each item
// Note: the load json command is Async, thus the rest of the code is
// in callback
d3.json("./fakeData_large.json", function(data){
    // project all datapoints to x,y coords of the map
    data.forEach(function(d) {
        d.projectedPoint = map.project([d.lng, d.lat])
    })

    // add circle for every item in data
    var circles = circleGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", function(d){
            return d.projectedPoint.x;
        })
        .attr("cy", function(d){
            return d.projectedPoint.y;
        })
        .attr("r", 10)
        .style("fill", "red")
        .attr("fill-opacity", 0.3);


    // function to update points whenever the map moves,pans,or zooms
    function updatePoints(){
        console.log(map.getZoom())

        // update projections of points
        data.forEach(function(d) {
            d.projectedPoint = map.project([d.lng, d.lat]);
        })

        circles.attr("cx", function(d) {
            return d.projectedPoint.x
        });
        circles.attr("cy", function(d) {
            return d.projectedPoint.y
        })
    }

    map.on("viewreset", updatePoints)
    map.on("move", updatePoints)
    updatePoints();
})
