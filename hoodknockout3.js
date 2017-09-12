var map;
var infowindow;
var markers = []; // Creates a new blank array for all the listing markers.

// Creates placemarkers array to use in multiple 
// functions to have control over the number of places that show.
var placeMarkers = [];

var vm;

// Model

// These are the tourist spots listings that will be shown to the user.
// Normally we'd have these in a database instead.
// locations is an array 
var locations = [{
    title: 'Salt Lake Temple',
    location: {
      lat: 40.770448,
      lng: -111.891908
    }
  },
  {
    title: 'Temple Square',
    location: {
      lat: 40.769351,
      lng: -111.894539
    }
  },
  {
    title: 'Church History Museum',
    location: {
      lat: 40.770874,
      lng: -111.89442
    }
  },
  {
    title: 'Church History Library',
    location: {
      lat: 40.77208,
      lng: -111.890406
    }
  },
  {
    title: 'Conference Center',
    location: {
      lat: 40.772623,
      lng: -111.892351
    }
  }
];


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7697,
      lng: -111.894402
    },
    zoom: 16,
    //styles: styles,
    mapTypeControl: false
  });

  infowindow = new google.maps.InfoWindow({
    content: "holding..."
  });

  vm = new ViewModel();

  ko.applyBindings(vm);
};


//  View Model

var Location = function(data) {

  this.title = data.title;

  this.marker = new google.maps.Marker({
    map: map,
    position: data.location,
    title: data.title,
    animation: google.maps.Animation.DROP  
  });

  // from: http://you.arenot.me/2010/06/29/google-maps-api-v3-0-multiple-markers-multiple-infowindows/
  
  /* now inside your initialise function */
 
    google.maps.event.addListener(this.marker, 'click', function () {
    // where I have added .html to the marker object.
      infowindow.setContent(this.title);
      infowindow.open(map, this);
  

      // Wikipedia code ajax request

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        ViewModel.wikiError("failed to get Wikipedia resources");
    },8000);
    
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function( response) {
            var articleList = response[1];
            articleList.forEach(function(articleStr) {
                var url = 'http://wikipedia.org/wiki/' + articleStr;
                viewModel.wikiArray.push({url: url, article: articleStr});
            });

            clearTimeout(wikiRequestTimeout);
        }
    });
    });

};

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
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
};


var ViewModel = function() {
  //this.locations = ko.observableArray(locations);

  this.locations = ko.observableArray();

  for (var i = 0; i < locations.length; i++) {
    this.locations.push(new Location(locations[i])); 
  }

  // add the list view items' click event handler method there

  // Create an onclick event to open the large infowindow at each marker.
  marker.addListener('click', function() {
    populateInfoWindow(this, infowindow);
  });
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');
  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
 // Listen for the event fired when the user selects a prediction from the
 // picklist and retrieve more details for that place.
 searchBox.addListener('places_changed', function() {
   searchBoxPlaces(this);
 });

 // Listen for the event fired when the user selects a prediction and clicks
 // "go" more details for that place.
 document.getElementById('go-places').addEventListener('click', textSearchPlaces);


  // use the 'current item' aka first parameter to activate the corresponding map marker
  // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
};


//#sourceUrl=hoodknockout3.js