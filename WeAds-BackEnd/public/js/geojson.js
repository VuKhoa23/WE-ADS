const response = await fetch("https://weads-backend.vercel.app/weads/place/geojson")
const geojson = await response.json();