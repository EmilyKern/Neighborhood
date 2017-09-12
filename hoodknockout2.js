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
    });

};

var ViewModel = function() {
  //this.locations = ko.observableArray(locations);

  this.locations = ko.observableArray();

  for (var i = 0; i < locations.length; i++) {
    this.locations.push(new Location(locations[i])); 
  }

  // add the list view items' click event handler method there
  // use the 'current item' aka first parameter to activate the corresponding map marker
  // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
  function MyViewModel() {
    var self = this;
      self.locations = ko.observableArray();
 
      // The current item will be passed as the first parameter, so we know which place to remove
      self.removePlace = function(place) {
        self.places.remove(place)
        }
  }
  ko.applyBindings(new MyViewModel());
};


//#sourceUrl=hoodknockout2.js