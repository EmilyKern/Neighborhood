
var map;
var markers =[];  // Creates a new blank array for all the listing markers.

// Creates placemarkers array to use in multiple 
// functions to have control over the number of places that show.
var placeMarkers = [];


function initMap() {
	map = new google.maps.Map(document.getElementById('map'),{
	center: {lat: 40.7697, lng: -111.894402},
	zoom: 14,
	//styles: styles,
	mapTypeControl: false
});	

}

/*
	// Create a searchbox in order to execute a place search
	var searchBox = new google.maps.places.SearchBox(
		document.getElementById('places-search'));
	// Limit the searchbox to within the bounds of the map.
	searchBox.setBounds(map.getBounds());

	var largeInfowindow = new google.maps.InfoWindow();

	//  Marker icon with style
	var defaultIcon = makeMarkerIcon('0091ff');
	
	// Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // Uses the location array to create an array of markers on initialize
    for (var i = 0; < locations.length; i++) {
    	// Get position from location array
    	var position = locations[i].location;
    	var title = locations[i].title;
    	// create marker per location then put into markers array
    	var marker = new google.maps.Marker({
    		position: position,
    		title: title,
    		animation: google.maps.Animation.DROP,
    		icon: defaultIcon,
    		id: i
    	});
    	
    	// Push marker to array of markers
    	markers.push(marker);
    	// Create onCLick event to open the large infowindow at each marker
    	marker.addListener('click', function() {
    		populateInfoWindow(this, largeInfowindow);
    	});
    	// Event listeners: mouseover, mouseout
    	// change color
    	marker.addListener('mouseover', function() {
    		this.setIcon(highlightedIcon);
    	});
    	marker.addListener('mouseout', function() {
    		this.setIcon(defaultIcon);
    	});
    }

    document.getElementById('show-listings').addEventListener('click', showListings);

    document.getElementById('hide-listings').addEventListener('click', function() {
          hideMarkers(markers);
    });

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
        searchBoxPlaces(this);
    });

    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);

*/

// Model

// These are the tourist spots listings that will be shown to the user.
// Normally we'd have these in a database instead.
 var locations = [
   {title: 'Salt Lake Temple', location: {lat: 40.770448, lng: -111.891908}},
   {title: 'Temple Square', location: {lat: 40.769351, lng: -111.894539}},
   {title: 'Church History Museum', location: {lat: 40.770874, lng: -111.89442}},
   {title: 'Church Hisotry Library', location: {lat: 40.77208, lng: -111.890406 }},
   {title: 'Conference Center', location: {lat: 40.772623, lng: -111.892351}}
 ];

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          	// Make sure the marker property is cleared if the infowindow is closed.
          	infowindow.addListener('closeclick', function() {
            	infowindow.marker = null;
          	});
		}
}

// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
    	markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}


// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

// This function fires when the user selects a searchbox picklist item.
// It will do a nearby search using the selected query string or place.
function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        window.alert('We did not find any places matching that search!');
    } else {
        // For each place, get the icon, name and location.
        createMarkersForPlaces(places);
    }
}

// This function firest when the user select "go" on the places search.
// It will do a nearby search using the entered query string or place.
function textSearchPlaces() {
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: document.getElementById('places-search').value,
        bounds: bounds
    }, function(results, status) {
        	if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
        	}
      	});
}

// This function creates markers for each place found in either places search.
function createMarkersForPlaces(places) {
  	var bounds = new google.maps.LatLngBounds();
  	for (var i = 0; i < places.length; i++) {
    	var place = places[i];
    	var icon = {
      		url: place.icon,
      		size: new google.maps.Size(35, 35),
      		origin: new google.maps.Point(0, 0),
      		anchor: new google.maps.Point(15, 34),
      		scaledSize: new google.maps.Size(25, 25)
    	};
		// Create a marker for each place.
		var marker = new google.maps.Marker({
  			map: map,
  			icon: icon,
  			title: place.name,
  			position: place.geometry.location,
  			id: place.place_id
		});
        // Create a single infowindow to be used with the place details information
        // so that only one is open at once.
        var placeInfoWindow = new google.maps.InfoWindow();
        // If a marker is clicked, do a place details search on it in the next function.
        marker.addListener('click', function() {
        	if (placeInfoWindow.marker == this) {
              console.log("This infowindow already is on this marker!");
            } else {
              getPlacesDetails(this, placeInfoWindow);
            }
        });
        placeMarkers.push(marker);
        if (place.geometry.viewport) {
        	// Only geocodes have viewport.
        	bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
	var service = new google.maps.places.PlacesService(map);
  	service.getDetails({
    	placeId: marker.id
  	}, function(place, status) {
     	if (status === google.maps.places.PlacesServiceStatus.OK) {
        	// Set the marker property on this infowindow so it isn't created again.
          	infowindow.marker = marker;
          	var innerHTML = '<div>';
          	if (place.name) {
            	innerHTML += '<strong>' + place.name + '</strong>';
          	}
          	if (place.formatted_address) {
            	innerHTML += '<br>' + place.formatted_address;
          	}
          	if (place.formatted_phone_number) {
            	innerHTML += '<br>' + place.formatted_phone_number;
          	}
          	if (place.opening_hours) {
            	innerHTML += '<br><br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6];
          	}
          	if (place.photos) {
            	innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                	{maxHeight: 100, maxWidth: 200}) + '">';
          		}
        	innerHTML += '</div>';
          	infowindow.setContent(innerHTML);
          	infowindow.open(map, marker);
          	// Make sure the marker property is cleared if the infowindow is closed.
          	infowindow.addListener('closeclick', function() {
            	infowindow.marker = null;
          	});
        }
    });
}

//  View Model

var ViewModel = function() {
	this.locations=locations;
}

ko.applyBindings(new ViewModel());

//#sourceUrl=hoodknockout.js