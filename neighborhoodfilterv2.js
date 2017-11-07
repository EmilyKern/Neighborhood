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
        placeId: 'ChIJqTIfcAj1UocRVHnhNYcscio',
        location: {
            lat: 40.770448,
            lng: -111.891908
        }
    },
    {
        title: 'Temple Square',
        placeId: 'ChIJdRMqtQf1UocRwPPJ_lV5i7w',
        location: {
            lat: 40.769351,
            lng: -111.894539
        }
    },
    {
        title: 'Church History Museum',
        placeId: 'ChIJOYAsxwf1UocR9gZqf4IFV1k',
        location: {
            lat: 40.770874,
            lng: -111.89442
        }
    },
    {
        title: 'Church History Library',
        placeId: 'ChIJc7GXOgj1UocRm4_VAuIb8xA',
        location: {
            lat: 40.77208,
            lng: -111.890406
        }
    },
    {
        title: 'LDS Conference Center',
        placeId: 'ChIJOcRQ_Kf1UocRR_64Qy1RXUo',
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
        mapTypeControl: false
    });

    infowindow = new google.maps.InfoWindow({
        content: "holding..."
    });

    vm = new ViewModel();

    ko.applyBindings(vm);
}

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
    //console.log(data);

    this.title = data.title;

    this.placeId = data.placeId;

    this.marker = new google.maps.Marker({
        map: map,
        position: data.location,
        title: data.title,
        animation: google.maps.Animation.DROP,
        id: data.place_id,
    });

    var placeId = this.placeId;
    var marker = this.marker;
    google.maps.event.addListener(this.marker, 'click', function(event) {
        // where I have added .html to the marker object.
      //  console.log(placeId);
        getPlacesDetails(marker, infowindow, placeId);
        getData(data);
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
    this.wikiData = ko.observable('');
    
    this.query = ko.observable('');

    for (var i = 0; i < locations.length; i++) {
        this.touristSpots.push(new TouristSpot(locations[i]));
    }

    // add the list view items' click event handler method there
    // use the 'current item' aka first parameter to activate the corresponding map marker
    // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function

    this.placesList = function(attraction) {
      //  console.log(attraction);
      //  console.log(attraction.marker);
        google.maps.event.trigger(attraction.marker, 'click');
        getData(attraction.marker);
    };

    // Filtering/Search
    this.searchList = ko.computed(function() {
        var query = self.query().toLowerCase()
        var filteredTouristSpots = []

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
         searchBox.setBounds(map.getBounds());
        
        // remove all the current touristSpots, which removes them from the view

        for(var x in self.touristSpots()) {
            var touristSpot = self.touristSpots()[x];

            console.log(query, touristSpot)
            // touristSpot.title 
            // touristSpot.marker
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
            filteredTouristSpots.push(touristSpot) // push only matching touristSpots to filteredTouristSpots
        }
        return filteredTouristSpots

        // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

        // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
            map.fitBounds(bounds);
      }

    });
};


    /*
    // Reference: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    //filter the items using the filter text
    this.filteredItems = ko.computed(function() {
        var filter = this.filter().toLowerCase();
            if (!filter) {
            return this.items();
        } else {
            return ko.utils.arrayFilter(this.items(), function(item) {
                return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
            });
        }
    }, this);
    */
//};

// Wikipedia API
function getData(data) {

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + data.title + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
          //  console.log(response);
            //console.log(response[2][0])
            var description = response[2][0];
            var contentString = '<p class="description">' + description + '</p>';
            vm.wikiData(contentString);
        }
    });
}

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow, placeId) {
   // console.log(placeId);
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: placeId
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
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
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

