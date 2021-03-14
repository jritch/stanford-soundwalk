// modified from: https://leafletjs.com/examples/mobile/

// global variable keeps track of the position in the playlist
//playlist_position = 0;

// to be played when you click on the marker or are in the proper position
points_of_interest =
    [["Cactus Garden", [37.43592311670526, -122.17107926201443], 38, "cactus_garden.mp3",0],
    ["Stanford Mausoleum", [37.4364654, -122.1698852], 20, "stanford_mausoleum.mp3",0],
    ["Angel of Grief", [37.4373239, -122.1688938], 20, "angel_of_grief.mp3",0],
    ]
    

// points_of_interest =
//     [["Stanford Mausoleum", [45.37779628811677, -75.67558200575988], 20, "stanford_mausoleum.mp3",0],
//     ["Angel of Grief", [45.37738595903921, -75.6744895594049], 50, "angel_of_grief.mp3",0],
//     ["Cactus Garden", [45.376213573838925, -75.67429989857938],20, "cactus_garden.mp3",0],
//     ["Palm Drive and Campus Drive", [45.37624554830319, -75.67533165347018], 40, "campus_drive.mp3",0]]


var iframeElement   = document.querySelector('iframe');
var widget         = SC.Widget(iframeElement);

widget.bind(SC.Widget.Events.PLAY, function() {
    document.getElementById("curtain").setAttribute("style","display:none");
    if (audio) {
        audio.remove()
    }
});


// to be played on a continuous loop while you are not near a point-of-interest    
//playlist = ["1_bach1.mp3","2_haydn1.mp3","3_sano1.mp3","4_delius1.mp3","5_evans1.mp3","6_haydn2.mp3","7_bach2.mp3","8_sano2.mp3","9_haydn3.mp3","10_walker1.mp3","11_bach3.mp3"];

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
    
        widget.pause()
        audio.play();
    };
}

// called when you press forward or when an audio track ends
function playNext() {
    //playlist_position = (playlist_position + 1) % playlist.length;
    //f = audioPlayFactory(playlist[playlist_position]);
    //f();
   widget.play()
};

// play the intro (for now the first song in the playlist, soon the intro + directions)
// function tourStart() {
//     f = audioPlayFactory(playlist[playlist_position]);
//     f();
//     document.getElementById("start-button").remove();
//     document.getElementById("curtain").remove();
// }

// compare latlng
// function nearPointOfInterestTrigger(user_position) {
//     for (i = 0; i < points_of_interest.length; i++) {
//         item = points_of_interest[i];
//         latlng = new L.LatLng(item[1][0], item[1][1]);
        
//          //for debugging - show radius at each point 
//         //L.circle(latlng, item[2]).addTo(map);
        
//         // if you're within the radius 
//         // and not already playing the file
//         // then play the file
//         if (user_position.distanceTo(latlng) < item[2]) {
//             audio = document.getElementById("audio")
//             if (audio) {
//                 if ((audio.getAttribute("src") != "audio/" + item[3]) && item[4] == 0)
//                 {
//                     item[4] = 1;
//                     f = audioPlayFactory(item[3]); 
//                     f();
//                 } 
//             }
//             return;
//         }
//     }
// }

tmp = 0 

var user_circle = undefined;

function updateUserPosition(e){
    if(user_circle) {
        map.removeLayer(user_circle);
    }
    user_circle = L.circleMarker(e.latlng, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5, radius: 5}).addTo(map); 
}


function time_to_minutes(time){
    time_array = time.split(":");
    return 60 * Number(time_array[0]) + Number(time_array[1]);
}

function rightTime(){
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.ipgeolocation.io/astronomy?apiKey=ea030b10276047c1afb849582b0bb749&lat=37.4341&long=-122.1661", false);
    xmlHttp.setRequestHeader("Content-Type", "application/JSON");
    xmlHttp.send(null);
    info = JSON.parse(xmlHttp.responseText);
    after_sunrise = time_to_minutes(info["current_time"]) >=  time_to_minutes(info["sunrise"]);
    before_sunset = time_to_minutes(info["current_time"]) <  time_to_minutes(info["sunset"]);
    return (after_sunrise && before_sunset);
}

function onLocationFound(e) { 
    updateUserPosition(e)
    //nearPointOfInterestTrigger(e.latlng);
};

//function onLocationError(e) { alert(e.message);};

var map = L.map('map').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianJpdGNoIiwiYSI6ImNrbDE5YWp1YzByNTUydm1pemp4NWo2NGcifQ.UqOkdnWMNCF3tWfPTB_4UQ', {
    attribution: '',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
}).addTo(map);


map.setView(new L.LatLng(37.438417408658916, -122.1684), 16);
//map.setView(new L.LatLng(45.37785682716759, -75.6749549661014), 16);

omnivore.kml('soundwalk.kml').addTo(map);

map.locate({setView: false, maxZoom: 16, watch: true, enableHighAccuracy: true});
map.on('locationfound', onLocationFound);
//map.on('locationerror', onLocationError);


// add points of interest to tour
for (i = 0; i < points_of_interest.length; i++) {
    item = points_of_interest[i];
    latlng = new L.LatLng(item[1][0], item[1][1]);
    //L.circle(latlng, {color: null,fillOpacity: 0.5, radius: item[2]}).addTo(map);

    var new_icon = L.icon({
        iconUrl: 'icons/icon-' + i +'.png',
        iconSize:   [25, 40], // point of the icon which will correspond to marker's location
        iconAnchor:   [12.5, 40], // point of the icon which will correspond to marker's location
    });

    L.marker(latlng, {icon:new_icon}).addTo(map).on('click', audioPlayFactory(item[3]));
}


var new_icon = L.icon({
    iconUrl: 'icons/arrow.png',
    iconSize:   [25, 40], // point of the icon which will correspond to marker's location
    iconAnchor:   [12.5, 40], // point of the icon which will correspond to marker's location
});

L.marker(new L.LatLng(37.44174,-122.1656), {icon:new_icon}).addTo(map);


// // add button behavior
// document.getElementById("start-button").addEventListener("click", tourStart)
// document.getElementById("forward").addEventListener("click", playNext)

// document.getElementById("play").addEventListener("click", function () { 
//     audio = document.getElementById("audio"); audio.play(); })

// document.getElementById("pause").addEventListener("click", function () { 
//     audio = document.getElementById("audio"); audio.pause(); })



document.getElementById("button").addEventListener("click", function () {
    if  (document.getElementById("player").getAttribute("style")=="") {
        document.getElementById("player").setAttribute("style","height:400px");
        //document.getElementById("button").setAttribute("style","bottom:400px");
    }
    else {
        document.getElementById("player").setAttribute("style","");
       // document.getElementById("button").setAttribute("style","");
    }
});

var elements = document.getElementsByClassName("rounded-circle")

for (let index = 0; index < elements.length; index++) {
    element = elements[index];
    element.addEventListener("click", function (event) {
        event.target.parentNode.classList.add("clicked")
    });
}

// if (!rightTime()) {
//     alert("Soundwalk is only available during daylight hours")
//     document.getElementById("map").remove()
//     document.getElementById("player").remove()

// }