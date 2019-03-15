$(document).ready(function() {
    var infowindow = new google.maps.InfoWindow({
           });
    
            $.getJSON("http://localhost:3000/list", function(json1) {
              $.each(json1, function(key, data) {
                
                
                var latLng = new google.maps.LatLng(data.latitude,data.longitude); 
                
                var marker = new google.maps.Marker({
                    position: latLng,
    
                    title: data.title
                });
                marker.setMap(map);
     marker.addListener('click', function() {
    var des="<div style='float:left'>";
    des =des + "<img src= ";
    des =des +data.imgsrc;
    des =des +" 	height=70 > ";
    des =des +"</div><div style='float:right; padding: 10px;'><b>";
    des =des + data.title;
    des =des +"</b><br/> ";
    des =des +data.description;
    des =des +" <br/>";
    des =des +data.City;
    des =des +" <br/>";
    des =des +data.State;
    des =des +",";
    des =des +data.Country;   
    des =des +`<form action= "directions.html" >
    <input type="hidden" name="faddress" id="custId" name="custId" value=`
    
    var str=data.faddress;
    str = str.replace(/\s+/g,'');
    console.log(str);
    console.log(data.faddress);
    des =des +str;
    des =des +`> 
    <button type="submit">Get Directions</button>
  </form>`
    des =des +"</div>"
    infowindow.setContent(des);        
    infowindow.open(map, marker);
          });
    });
            });
          });
