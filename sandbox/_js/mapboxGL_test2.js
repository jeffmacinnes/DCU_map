var w = 800
var h = 800

d3.select("#mapArea")
    .style("height", h+"px")
    .style("width", w+"px");


view = 'map';


//////////////////////////
// MAPBOX SET-UP
//////////////////////////
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
//map.addControl(new mapboxgl.Navigation());

//////////////////////////
// Link Mapbox and d3
//////////////////////////
// grab the container that holds the map
var container = map.getCanvasContainer()

// put the d3 SVG layer in the map container
var svg = d3.select(container).append("svg")

// load the map, and the load the dataset
map.on('load', function() {
    d3.json("./fakeData_large.json", function(err, data) {
        // function to draw all of the datapoints
        drawData(data);
    })
})

// function to project a given lng/lat coord to the maps
// current x/y coords
function projectPointToMap(lng, lat) {
    // returns a Point
    return map.project([lng, lat]);
}


///////////////////////////
// d3 setup and functions
//////////////////////////
var circles;        // define circles outside the scope of drawData
function drawData(data){
        // bind data to circle elements (but don't worry about positioning yet)
        circles = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', 10)
            .style('fill', 'red')
            .on('click', function(d){
                alert(d.contact_name);
            });

        // call the update function
        update();

        // set the map to update whenever it is interacted with
        map.on('viewreset', update);
        map.on('move', update);
        map.on('moveend', update);
}

// Update function
function update(){
    // updates to make in "map" view
    if (view == "map"){

        // WHAT THE FUCK IS D???
        circles.attr("cx", function(d) {
            d.projectedPoint = projectPointToMap(d.lng, d.lat)
            return d.projectedPoint.x
        });
        circles.attr("cy", function(d) {
            return d.projectedPoint.y
        })

    } else if (view == 'grid'){
        console.log('set grid functions yo!')

    }
}


// D3 INTERACTION FUNCTIONS *********************
// Load the JSON data and add svg elements for each item
// Note: the load json command is Async, thus the rest of the code is
// in callback
// d3.json("./fakeData_large.json", function(data){
//     // project all datapoints to x,y coords of the map
//     data.forEach(function(d) {
//         d.projectedPoint = map.project([d.lng, d.lat])
//     })
//
//     // add circle for every item in data
//     var circles = circleGroup.selectAll('circle')
//         .data(data)
//         .enter()
//         .append('circle')
//         .attr("cx", function(d){
//             return d.projectedPoint.x;
//         })
//         .attr("cy", function(d){
//             return d.projectedPoint.y;
//         })
//         .attr("r", 10)
//         .style("fill", "red")
//         .attr("fill-opacity", 0.3);
//
//
//     // function to update points whenever the map moves,pans,or zooms
//     function updatePoints(){
//         console.log(map.getZoom())
//
//         // update projections of points
//         data.forEach(function(d) {
//             d.projectedPoint = map.project([d.lng, d.lat]);
//         })
//
//         circles.attr("cx", function(d) {
//             return d.projectedPoint.x
//         });
//         circles.attr("cy", function(d) {
//             return d.projectedPoint.y
//         })
//     }
//
//     map.on("viewreset", updatePoints)
//     map.on("move", updatePoints)
//     updatePoints();
// })
