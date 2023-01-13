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
  
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  
  map.addListener("click", (e) => {
      // Create a new marker and add to the current map
      var marker = new google.maps.Marker({
        position: e.latLng,
        map: map,
        title: "Right-Click to remove",
      });
      
      // Double Clicking a marker will delete it
      marker.addListener("rightclick", function() {
        // Remove the marker from the local array and then from the map via its map anchor
        remove_marker(position=marker.position);
        marker.setMap(null);
      });
      // Add the new marker to the list of tracked locations
      markers.push(e.latLng);
      console.log(markers[0]);
    });

  /** Filter Category Control **/
  const categoryForm = checkboxDropDown(map=map, 
                                        title="Categories to exclude", 
                                        formProps=catFormProp, 
                                        optionList=filterOptions)
  // Append the control to the Map
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(categoryForm);

  // End of myMap() callback container
}

function remove_marker(position) {
  // Based on the marker's position (i.e., e.latlong), remove the marker at that position
  const index = markers.indexOf(position);
  if (index > -1) { // If the marker is found, splice the list to remove it
    markers.splice(index, 1);
  }
}

