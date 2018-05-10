/* -- Load the datasets --*/


var URLS={"neighborhood_names" : "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD",
    "geoshapes" : "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson",
    "crime" : "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD",
    "housing" : "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD"
};

var boroughs = [
    {name:"Manhattan",color: "#06e908"},//1
    {name:"Bronx",color: "#134bdb"},//2
    {name:"Brooklyn",color:"#d7480b"},//3
    {name:"Queens",color: "#c211ee"},//4
    {name:"Staten Island",color: "#dbd318"}//5
];
var datasets = {};

function loadData(){
    for(let key in URLS){
        $.get(URLS[key],function(){})
            .done(function(data){
                switch (key) {
                    case Object.keys(URLS)[0]:
                        datasets[key] = data.data;
                    break;
                    case Object.keys(URLS)[1]:
                        datasets[key] = data;
                    break;
                    case Object.keys(URLS)[2]:
                        datasets[key] = data;
                    break;
                    case Object.keys(URLS)[3]:
                        datasets[key] = data;
                    break;
                    default:
                }
            })
            .fail(function(error){console.error(error);});
    }
}

/*-- Google maps interaction scripts -- */

var mapTop;
var coordNYU = {lat: 40.729218, lng: -73.996492}

function onGoogleMapResponse(){
    mapTop = new google.maps.Map(document.getElementById('mapContainer'),{
        center: coordNYU,
        zoom: 10,
        gestureHandling: 'greedy', // avoid ctrl + scroll
        zoomControl: true,
        zoomControlOptions:{
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false
    });
    var fixedMarker = new google.maps.Marker({
        position: coordNYU,
        map: mapTop,
        title: 'NYU!',
    });
    mapTop.data.loadGeoJson("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson");
    mapTop.data.setStyle({
        visible : false
    });
}

function showBoroughs(){
    mapTop.data.setStyle(function(feature){
        let boroCD = Math.floor(feature.getProperty("BoroCD")/100.0);
        let color = boroughs[boroCD-1].color;
        let vi =true;
        if(boroCD != boroughChosen) vi = false;
        return ({
            strokeColor : color,
            strokeWeight : 2,
            visible : vi
        });
    });
}


/*-- Buttons and other interactions -- */
$(document).ready(function(){
    loadData();

    /*Populate location lists*/
    for(var i = 0 ; i<5;i++){
        $('#location-map').append('<option value="' + (i+1) + '">' + boroughs[i].name + '</option>');
    }
});


var boroughChosen = 0;
$("#location-map").change(function(){
    boroughChosen = this.value;
    if(boroughChosen != 0){
        $("#location-com-map").prop("disabled",false);
        showBoroughs();
    }else{
        $("#location-com-map").empty();
        $("#location-com-map").append('<option value="0">Seleccione...</option>');
        $("#location-com-map").prop("disabled",true);
        showBoroughs(); // with 0 there is no boroughs
    }
});

/*Padding for the navigation bar*/
$("#navigationMenu").resize(function(){
    $("navBarSpacing").height($("#navigationMenu").height()+10);
});
