var map;
      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(13, 80),
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
      }