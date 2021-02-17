// modified from: https://leafletjs.com/examples/mobile/

// global variable keeps track of the position in the playlist
playlist_position = 0;

// to be played when you click on the marker or are in the proper position
points_of_interest =
    [["Stanford Mausoleum", [37.4364654, -122.1698852], 20, "haydn1.mp3",0],
    ["Angel of Grief", [37.4373239, -122.1688938], 20, "bach1.mp3",0],
    ["Cactus Garden", [37.435612701969426, -122.17147463768667], 100, "delius1.mp3",0],
    ["Stanford Griffins", [37.43487591301868, -122.1680102423321], 40, "sano1.mp3",0]]


points_of_interest =
    [["Stanford Mausoleum", [45.37779628811677, -75.67558200575988], 20, "haydn1.mp3",0],
    ["Angel of Grief", [45.37738595903921, -75.6744895594049], 50, "bach1.mp3",0],
    ["Cactus Garden", [45.376213573838925, -75.67429989857938],20, "sano1.mp3",0],
    ["Stanford Griffins", [45.37624554830319, -75.67533165347018], 40, "sano1.mp3",0]]


// to be played on a continuous loop while you are not near a point-of-interest    
playlist = ["bach1.mp3", "haydn1.mp3", "delius1.mp3", "sano1.mp3"]

// takes as input a filename
// returns a function that, when called,
// removes the current audio element, adds a new audio element
// and starts playing it
// also adds a listener to advance to the next song in the playlist when the track ends
function audioPlayFactory(name) {
    return function () {
        audio = document.getElementById("audio");

        if (audio) {
            audio.remove();
        }

        audio = new Audio('audio/' + name);
        audio.setAttribute("id", "audio");
        audio.onended = playNext;
        document.body.appendChild(audio);
        audio.play();
    };
}

// called when you press forward or when an audio track ends
function playNext() {
    playlist_position = (playlist_position + 1) % playlist.length;
    f = audioPlayFactory(playlist[playlist_position]);
    f();
};

// play the intro (for now the first song in the playlist, soon the intro + directions)
function tourStart() {
    f = audioPlayFactory(playlist[playlist_position]);
    f();
    document.getElementById("start-button").remove();
}

// compare latlng
function nearPointOfInterestTrigger(user_position) {
    for (i = 0; i < points_of_interest.length; i++) {
        item = points_of_interest[i];
        latlng = new L.LatLng(item[1][0], item[1][1]);
        
         //for debugging - show radius at each point 
        L.circle(latlng, item[2]).addTo(map);
        
        // if you're within the radius 
        // and not already playing the file
        // then play the file
        if (user_position.distanceTo(latlng) < item[2]) {
            audio = document.getElementById("audio")
            if (audio) {
                if ((audio.getAttribute("src") != "audio/" + item[3]) && item[4] == 0)
                {
                    item[4] = 1;
                    f = audioPlayFactory(item[3]); 
                    f();
                } 
            }
            return;
        }
    }
}

tmp = 0 

var user_circle = undefined;

function updateUserPosition(e){
    if(user_circle) {
        map.removeLayer(user_circle);
    }
    user_circle = L.circleMarker(e.latlng).addTo(map); 
}

function onLocationFound(e) { 
    //tmp = e.latlng; 
    // iterate over the points_of_interest
    // if you are within a radius of

    updateUserPosition(e)
    nearPointOfInterestTrigger(e.latlng);
};

function onLocationError(e) { alert(e.message);};

var map = L.map('map').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianJpdGNoIiwiYSI6ImNrbDE5YWp1YzByNTUydm1pemp4NWo2NGcifQ.UqOkdnWMNCF3tWfPTB_4UQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Icons © <a href="https://thenounproject.com/"> The Noun Project</a> ',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
}).addTo(map);

//map.locate({ setView: true, maxZoom: 16 });
//
//map.on('locationerror', onLocationError);

//map.setView(new L.LatLng(37.437417408658916, -122.16877133597302), 16);
map.setView(new L.LatLng(45.37785682716759, -75.6749549661014), 16);

omnivore.kml('soundwalk.kml').addTo(map);

map.locate({setView: false, maxZoom: 16, watch: true, enableHighAccuracy: true});
map.on('locationfound', onLocationFound);

// add points of interest to tour
for (i = 0; i < points_of_interest.length; i++) {
    item = points_of_interest[i];
    latlng = new L.LatLng(item[1][0], item[1][1]);
    L.marker(latlng).addTo(map).bindPopup(item[0]).on('click', audioPlayFactory(item[3]));
}

// add button behavior
document.getElementById("start-button").addEventListener("click", tourStart)
document.getElementById("forward").addEventListener("click", playNext)

document.getElementById("play").addEventListener("click", function () { 
    audio = document.getElementById("audio"); audio.play(); })

document.getElementById("pause").addEventListener("click", function () { 
    audio = document.getElementById("audio"); audio.pause(); })