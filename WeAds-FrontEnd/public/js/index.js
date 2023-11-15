// Initialize and add the map
let map;
let marker;

async function initMap() {
  const response = await fetch(
    "https://maps.googleapis.com/maps/api/geocode/json?" +
      new URLSearchParams({
        address: "Bitexco Quan 1",
        key: API_KEY,
      })
  );
  const result = await response.json();
  // The location of Uluru
  const position = result.results[0].geometry.location;
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: position,
    mapId: "53fd56e871556f80",
  });

  // The marker, positioned at Uluru
  marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "You are here",
  });
}

// event handlers
$(document).ready(function () {
  initMap();
  $("#search-btn").click(async function (event) {
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?" +
        new URLSearchParams({
          address: $("#text-field").val(),
          key: API_KEY,
        })
    );

    const result = await response.json();
    console.log(result);
    // The location of Uluru
    if (result.results.length > 0) {
      const position = result.results[0].geometry.location;
      const latlng = new google.maps.LatLng(position.lat, position.lng);
      map.setCenter(position);
      marker.position = latlng;
    } else {
      alert("Location ko tim thay");
    }
  });
});
