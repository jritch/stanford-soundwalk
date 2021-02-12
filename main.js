// modified from: https://leafletjs.com/examples/mobile/
function onLocationFound(e) { };
function onLocationError(e) { };

var map = L.map('map').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianJpdGNoIiwiYSI6ImNrbDE5YWp1YzByNTUydm1pemp4NWo2NGcifQ.UqOkdnWMNCF3tWfPTB_4UQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
}).addTo(map);

//map.locate({ setView: true, maxZoom: 16 });
//map.on('locationfound', onLocationFound);
//map.on('locationerror', onLocationError);

map.setView(new L.LatLng(37.437417408658916, -122.16877133597302), 16);

omnivore.kml('soundwalk.kml').addTo(map);



points_of_interest =
    [["Stanford Mausoleum", [37.4364654,-122.1698852], "haydn1.mp3"],
    ["Angel of Grief", [37.4373239,-122.1688938], "bach1.mp3"],
    ["Cactus Garden", [37.435612701969426, -122.17147463768667], "delius1.mp3"],
    ["Stanford Griffins", [37.43487591301868, -122.1680102423321], "sano1.mp3"]]

for (i = 0; i < points_of_interest.length; i++) {
    item = points_of_interest[i];
    latlng = new L.LatLng(item[1][0], item[1][1]);

    function onClickFactory(name) {
        return function () {
            audio = document.getElementById("audio");
            
            if (audio){
                audio.remove();
            }

            audio = new Audio('audio/' + name);
            audio.setAttribute("id","audio");
            
            document.body.appendChild(audio);
            audio.play();
        };
    }

    L.marker(latlng).addTo(map).bindPopup(item[0]).on('click', onClickFactory(item[2]));
}