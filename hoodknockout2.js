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
var locations = [
  {
    title: 'Salt Lake Temple',
    location: 
    {
      lat: 40.770448,
      lng: -111.891908
    }
  },
  {
    title: 'Temple Square',
    location: 
    {
      lat: 40.769351,
      lng: -111.894539
    }
  },
  {
    title: 'Church History Museum',
    location: 
    {
      lat: 40.770874,
      lng: -111.89442
    }
  },
  {
    title: 'Church History Library',
    location: 
    {
      lat: 40.77208,
      lng: -111.890406
    }
  },
  {
    title: 'Conference Center',
    location: 
    {
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

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}

//  Location Constructor
var TouristSpot = function(data) {

  this.title = data.title;

  this.marker = new google.maps.Marker({
    map: map,
    position: data.location,
    title: data.title,
    animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(this.marker, 'click', function() {
    // where I have added .html to the marker object.
    infowindow.setContent(this.title);
    infowindow.open(map, this);
  });

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');
  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  this.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });

  this.marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
};

var ViewModel = function() {

  var self = this;

  this.touristSpots = ko.observableArray();

  for (var i = 0; i < locations.length; i++) {
    this.touristSpots.push(new TouristSpot(locations[i]));
  }

  // add the list view items' click event handler method there
  // use the 'current item' aka first parameter to activate the corresponding map marker
  // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function

  this.placesList = function(attraction) {
    console.log(attraction);
    console.log(attraction.marker);
    google.maps.event.trigger(attraction.marker, 'click');
      
    // do something with attraction.marker here, for example, open the marker's infowindow
  

    // Wikipedia AJAX request
    // Reference: https://classroom.udacity.com/nanodegrees/nd004/parts/135b6edc-f1cd-4cd9-b831-1908ede75737/modules/271165859175460/lessons/3310298553/concepts/31621285890923
    /*
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.title + '&format=json&callback=wikiCallback';
    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      success: function(response) {
        var articleList = response[1];
          for(var i = 0; i < articleList.length; i++) {
            var articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
          };
        }
      });
    };
    */
  };
};
