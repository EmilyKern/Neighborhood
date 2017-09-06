var map;
var infoWindow;
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

    vm = new ViewModel();

    ko.applyBindings(vm);
};


//  View Model

var Location = function(data) {

    // store a reference to this so if it changes, we can still
    // access every property of the instance
    var self = this;

    self.title = data.title;

    self.marker = new google.maps.Marker({
        map: map,
        position: data.location,
        title: data.title,
        animation: google.maps.Animation.DROP
    });

    self.wikiText = "loading";

    // create an event listener for the newly created marker.
    // the function will run when the marker is clicked
    google.maps.event.addListener(self.marker, 'click', function() {
      // update the contents of the infowindow object when the marker is clicked
      infoWindow.setContent(self.wikiText);
      // open the infowinow object at the position of the marker
      infoWindow.open(map, self.marker);
    });

    // TODO:
    // 1) call the wikipedia API using $.ajax()
    // 2) WHEN it returns (inside the success:) update self.wikiText with something you retreived from wikipedia
    // This means that when the marker is clicked, it will open with info you received from wikipedia (because it opens with self.wikiText)
};


var ViewModel = function() {
    //this.locations = ko.observableArray(locations);

    this.locations = ko.observableArray();

    // create a new infowindow object and assign it to the global infoWindow variable
    infoWindow = new google.maps.InfoWindow({
        content: "holding..."
    });

    for (var i = 0; i < locations.length; i++) {
        this.locations.push(new Location(locations[i]));
    }
};


            //#sourceUrl=hoodknockout2.js