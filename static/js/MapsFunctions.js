const markers = new Array();
function myMap() {
  var mapProp= {
  center:new google.maps.LatLng(32.897500, -79.988046),
  zoom:12,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  };
  
  const map_el = document.getElementById("googleMap");
  // If the Map DOM element has a location value, center the map on it
  if(map_el != null && map_el.dataset.coords != null) {
    let latlong = map_el.dataset.coords;
    latlong = latlong.split(",").map(Number);
    let centered = {lat: latlong[0], lng: latlong[1]};
    mapProp.center = centered;
    mapProp.zoom = 18;
    /* Create Map object & Add listeners */
    var map = new google.maps.Map(map_el,mapProp);
    var marker = new google.maps.Marker({
      position: centered,
      map: map,
    });
  }
  else {
    /* Create Map object & Add listeners */
    var map = new google.maps.Map(map_el,mapProp);
  }
  
  map.addListener("click", (e) => {
      /* Expandable Map Marker Shapes */
      // Define a rectangle and set its editable property to true.
      const circle = new google.maps.Circle({
        center: e.latLng,
        editable: true,
        draggable: true,
        radius: 1_000
      });

      circle.setMap(map);

      circle.addListener("rightclick", function() {
        // Remove the marker from the local array and then from the map via its map anchor
        remove_marker(position=circle);
        circle.setMap(null);
      });
      markers.push(circle);
    });

    const form = document.getElementById("checks");
    if (form != null) {
      // Submitting form requires at least one marker location prior to submission
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (markers.length < 1) {
            $('#alert-no-markers').removeClass('d-none');
          return;
        }
        let locations = [];
        for (const shape of markers) {
          let location_dict = JSON.parse(JSON.stringify(shape.center));
          location_dict["radius"] = shape.radius;
          locations.push(JSON.stringify(location_dict));
        }
        form.elements['locations'].value = JSON.stringify(locations);
        form.submit();
      });
    }

  /* Add Generate Map Button */
  // Create the generate button if the function is available
  if (typeof createGenerateBtn === 'function') {
    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement('div');
    // Create the control.
    const centerControl = createGenerateBtn(map);
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);
  }

  // End of myMap() callback container
}

function remove_marker(position) {
  // Based on the marker's position (i.e., e.latlong), remove the marker at that position
  const index = markers.indexOf(position);
  if (index > -1) { // If the marker is found, splice the list to remove it
    markers.splice(index, 1);
  }
}

$('#alert-no-markers').on('close.bs.alert', function (event) {
  event.preventDefault();
  $(this).addClass('d-none');
});
