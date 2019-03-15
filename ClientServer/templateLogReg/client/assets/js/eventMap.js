var marker;
var coords = {};
var service;

initMap = function () {
    geocoder = new google.maps.Geocoder();
    navigator.geolocation.getCurrentPosition(
        function (position) {
            coords = {
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            };
            setMapa(coords);


        },
        function (error) {
            console.log(error);
        });

    }
    


function setMapa(coords) {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(coords.lat, coords.lng),

    });

    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(coords.lat, coords.lng),
        
    });
   

    var infowindow = new google.maps.InfoWindow({
    
    });
    
    // marker.addListener('click', toggleBounce);

    google.maps.event.addListener(marker,'dragend', function (event) {
       
     
        var x;
        document.getElementById("coords").value = marker.getPosition().lat() + "," + this.getPosition().lng();
        document.getElementById("lati").value = marker.getPosition().lat();
        document.getElementById("longi").value = marker.getPosition().lng();
        var des = "<div style='float:left'>";
        des = des + "</div><div style='padding: 70px;'><b> Latitude:";
        des = des + marker.getPosition().lat();
        des = des + "</b><br/> <b> Longitude:";
        des = des + marker.getPosition().lng();
        des = des + " </b><br/> <b> Address:";
        //reverse geocoing method 
        geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
            x=results[0].formatted_address;
            document.getElementById("faddress").value = results[0].formatted_address;
        console.log(results[0].formatted_address);    
        des = des +x;
        des = des + "</b><br/></div>"
        des = des +"<div style='position:absolute;bottom:1px;right:1px;'>"
        infowindow.setContent(des + `<button class="btn btn-primary" onClick="$('#myModal').modal('toggle');">Add Event</button>`+ "</div>");
        infowindow.open(map, marker);
      toggleBounce();
            }
            }
            });
           // console.log(x); 
             //local variable x becomes undefined here so pulled up everything inside the reverse geocoder    
    });

}

function toggleBounce() {

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null); 
        }, 1000);
    }
}