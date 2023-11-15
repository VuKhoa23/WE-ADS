// Initialize and add the map
let map;
let marker;

const markers = [
  {
    address: "Pho Di Bo Nguyen Hue",
    description: "Quang cao tren pho di bo",
  },
  {
    address: "Cau Ba Son Quan 1",
    description: "Quang cao tren cau Ba Son",
  },
];

const markerIcon =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Map_pin_icon_green.svg/800px-Map_pin_icon_green.svg.png";

const { Size } = await google.maps.importLibrary("core");

const icon = {
  url: markerIcon, // url
  scaledSize: new Size(50, 50), // scaled size
};

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

async function initMarkers() {
  const { Marker } = await google.maps.importLibrary("marker");
  markers.forEach(async (mark) => {
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?" +
        new URLSearchParams({
          address: mark.address,
          key: API_KEY,
        })
    );
    const result = await response.json();
    const position = result.results[0].geometry.location;
    const marker = new Marker({
      position: position,
      map: map,
      title: mark.address,
      icon: icon,
    });
  });
}

// event handlers
$(document).ready(async function () {
  await initMap();
  await initMarkers();
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
