var map;
var infoWindow;
var markers = []; // Creates a new blank array for all the listing markers.

// Creates placemarkers array to use in multiple
// functions to have control over the number of places that show.
var placeMarkers = [];

var vm;
var marker;

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

    vm = new ViewModel();

    ko.applyBindings(vm);
};




var Location = function(data) {

    // store a reference to this so if it changes, we can still
    // access every property of the instance
    var self = this;

    self.title = data.title;

    self.marker = new google.maps.Marker({
        map: map,
        position: data.location,
        title: data.title,
        animation: google.maps.Animation.DROP,
        //icon: defaultIcon
    });

    /* 
    // Push the marker to array of markers
    markers.push(self.marker);
    // Create an onclick event to open the large infowindow at each marker.
    self.marker.addListener('click', function() {
        populateInfoWindow(self, infowindow);
    });

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
    }

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    self.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    self.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    // create an event listener for the newly created marker.
    // the function will run when the marker is clicked
    google.maps.event.addListener(self.marker, 'click', function() {
      // update the contents of the infowindow object when the marker is clicked
      
      infoWindow.setContent(self.wikiText);
      // open the infowinow object at the position of the marker
      infoWindow.open(map, self.marker);
    });
    */

    // TODO:
    // 1) call the wikipedia API using $.ajax()
    
    /* // Wikipedia code AJAX request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        ViewModel.wikiError("failed to get Wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response){
            var articleList = response[1];
            articleList.forEach(function(articleStr){
                var url = 'http://wikipedia.org/wiki/' + articleStr;
                viewModel.wikiArray.push({url: url, article: articleStr});
                return(response);
            }
        }
    })
    // 2) WHEN it returns (inside the success:) update self.wikiText with something you retreived from wikipedia
    // This means that when the marker is clicked, it will open with info you received from wikipedia (because it opens with self.wikiText)

    self.handleClick = function(){
        //.....
    }
    self.wikiText = url; */

    self.wikiText = data.title;

};

// View Model

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

    // add the list view items' click event handler method there

    
  // use the 'current item' aka first parameter to activate the corresponding map marker
  // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function

};


            //#sourceUrl=hoodknockout4.js