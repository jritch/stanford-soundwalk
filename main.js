// modified from: https://leafletjs.com/examples/mobile/
function onLocationFound(e) {};
function onLocationError(e) {};

var map = L.map('map').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianJpdGNoIiwiYSI6ImNrbDE5YWp1YzByNTUydm1pemp4NWo2NGcifQ.UqOkdnWMNCF3tWfPTB_4UQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
}).addTo(map);

map.locate({setView: true, maxZoom: 16});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);