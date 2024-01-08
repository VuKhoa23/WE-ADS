const express = require('express');
const router = express.Router();
const Place = require("../model/places")
const Ad = require("../model/ads")

// router.get('/create-demo', async (req, res) => {
//   const place = await Place.findOne({district: "Quận Bình Thạnh"})
//   await Ad.create({
//     adType: "Trụ treo băng rôn dọc",
//     adScale: "2.5m x 5.4m",
//     adName: "Landmark 81",
//     adImages: [
//         "https://brandcom.vn/wp-content/uploads/2020/09/quang-cao-truyen-hinh-1-1080x675.jpg",
//     ],
//     place: place._id
//   })
//   res.send("OK")
// });

router.get("/geojson", async (req, res)=>{
  const places = await Place.find({})
  const geojson = {
    type: "FeatureCollection",
    features: []
  }
  for(let place of places){
    let thePlace = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: place.coordinates,
      },
      properties:{
        ads: [],
        ward: place.ward,
        district: place.district,
        adPlanned: place.adPlanned
      }
    }

    const ads = await Ad.find({
      place: place._id
    })

    ads.forEach((ad)=>{
      const theAd = {
        adType: ad.adType,
        adScale: ad.adScale,
        adName: ad.adName,
        adImages: []
      }
      ad.adImages.forEach(img=>{
        theAd.adImages.push({url: img})
      })
      thePlace.properties.ads.push(theAd)
    })

    geojson.features.push(thePlace)
    console.log(geojson)
  }
  res.json(geojson)
})

module.exports = router