
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

/*// Create a searchbox in order to execute a place search
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
    });*/


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


//  View Model

var ViewModel = function() {
	this.locations=locations;
}

ko.applyBindings(new ViewModel());

//#sourceUrl=hoodknockout.js