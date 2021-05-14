// modified from: https://leafletjs.com/examples/mobile/

// global variable keeps track of the position in the playlist
//playlist_position = 0;

// to be played when you click on the marker or are in the proper position
points_of_interest =
    [
        ["Stanford Mausoleum", [37.4364654, -122.1698852], 20, "stanford_mausoleum",0],
        ["Cactus Garden", [37.43592311670526, -122.17107926201443], 38, "cactus_garden",0],
        ["Angel of Grief", [37.4373239, -122.1688938], 20, "angel_of_grief",0]
    ]
    
images = 
    [
        ["icons/tour-start-square.png","The view from the start of the tour"],
        ["icons/palm-drive-square.jpeg","The view as you walk down Palm Drive"],
        ["icons/griffin-square.jpg","Turn right, off Palm Drive, at the Griffins"],
        ["icons/mausoleum-square.jpeg","Location A: The Stanford Mausoleum"],
        ["icons/cactus-square.png","Location B: The Arizona Cactus Garden"],
        ["icons/angel-of-grief-square.jpg","Location C: The Angel of Grief"],
        ["icons/return-square.png","Follow the arrow to return to the start point"],
    ]

image_index = 0;

document.getElementById("left_arrow").addEventListener("click", function () {
    if (image_index == 0) {return;}
    else {
        image_index = image_index - 1;
        update_image();
    }
})

document.getElementById("right_arrow").addEventListener("click", function () {
    if (image_index == images.length - 1) {return;}
    else {
        image_index = image_index + 1;
        update_image();
    }
})

function  update_image() {
    image = document.getElementById("gallery_image");
    image.setAttribute("src",images[image_index][0]);
    caption = document.getElementById("gallery_caption");
    caption.innerHTML = images[image_index][1];
}



var iframeElement   = document.querySelector('iframe');
var widget         = SC.Widget(iframeElement);

widget.bind(SC.Widget.Events.PLAY, function() {
    if (audio) {
        //playNext(null);
        audio.pause();
    }
});

function audioPlayFactory(name) {
    return function () {
        
        audio = document.getElementById(name);
        map = document.getElementById("map");
        map_holder = document.getElementsByClassName("map-holder")[0];
        curtain = document.getElementsByClassName("curtain")[0];
        stop_button = document.getElementById("stop-button")

        curtain.setAttribute("style","display:block;")
        stop_button.setAttribute("style","visibility:auto;")

        audio.onended = playNext;
        
        audio.setAttribute("controls","true")
        audio.setAttribute("style","position:absolute; left: " + (map_holder.clientWidth - audio.clientWidth ) / 2 + "px; top: " + (map.clientHeight - audio.clientHeight ) / 2 + "px;")

        widget.pause()
        audio.play();
    };
}

function removePlayer () {
    curtain = document.getElementsByClassName("curtain")[0];
    curtain.setAttribute("style","display:none;")
    
    stop_button = document.getElementById("stop-button")
    stop_button.setAttribute("style","visibility:hidden;")


    audio.removeAttribute("controls")
    audio.pause();
}

// called when you press forward or when an audio track ends
function playNext() {
    removePlayer();
    widget.play();
};


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
    maxZoom: 17,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
}).addTo(map);


map.setView(new L.LatLng(37.4386, -122.1684), 16);
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
    iconUrl: 'icons/start.svg',
    iconSize:   [19, 19], // point of the icon which will correspond to marker's location
    iconAnchor:   [19/2, 19/2], // point of the icon which will correspond to marker's location
});

L.marker(new L.LatLng(37.44174,-122.1656), {icon:new_icon}).addTo(map);

document.getElementById("stop-button").addEventListener("click", removePlayer)


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

if (!rightTime()) {
    document.getElementById("alert").style.display = "block"

}

url = window.location.href

// if (url.includes("#start")) {
//     audioPlayFactory("stanford_mausoleum")()
//     elmnt = document.getElementById("map");
//     elmnt.scrollIntoView();
// }

// if (url.includes("#1")) {
//     alert("#1")
//     audioPlayFactory("stanford_mausoleum")()
//     elmnt = document.getElementById("map");
//     elmnt.scrollIntoView();
// }


// if (url.includes("#2")) {
//     alert("#2")
// }


// if (url.includes("#3")) {
//     alert("#3")
// }


// if (url.includes("#4")) {
//     alert("#4")
// }