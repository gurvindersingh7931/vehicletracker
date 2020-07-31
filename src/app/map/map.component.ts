import { Component, OnInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    var originCity = { lat: 30.741482, lng: 76.768066};
    var destinationCity = {lat: 30.210995, lng: 74.945473};
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    
    var map = new google.maps.Map(document.getElementById('map'), {
       zoom: 7,
       center: originCity
     });

     directionsDisplay.setMap(map);
     
     calculateAndDisplayRoute(directionsService, directionsDisplay);

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: originCity,
          destination: destinationCity,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);

            var pathLatLng = response.routes[0].overview_path;

            var vehicleMarker = new google.maps.Marker({
              position: originCity,
              map: map,
              icon: '/assets/images/car.png',
              title: 'vehicle',
              draggable: true
            }); 
            vehicleMarker.setMap(map);
            
            let timeSeconds = 0;
            let interval = setInterval(()=> {
              timeSeconds+=2;
              if(timeSeconds == 2) {
                vehicleMarker.setPosition(originCity);
              } else if(timeSeconds < pathLatLng.length) {
                vehicleMarker.setPosition(pathLatLng[timeSeconds/2]);
                const routePath = new google.maps.Polyline({
                  path: pathLatLng.slice(timeSeconds/2),
                  geodesic: true,
                  strokeColor: "purple",
                  strokeOpacity: 1.0,
                  strokeWeight: 5
                });
                routePath.setMap(map);         
              } else if(timeSeconds > pathLatLng.length) {
                vehicleMarker.setPosition(destinationCity);
                clearInterval(interval);
              }
            }, 2000);

          } else {
            window.alert('API request failed due to ' + status);
          }
        });
      }
  }
}
