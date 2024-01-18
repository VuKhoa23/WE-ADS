const response = await fetch("http://localhost:3000/weads/place/geojson")
const geojson = await response.json();