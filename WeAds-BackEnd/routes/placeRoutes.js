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
        adPlanned: place.adPlanned,
        placeId: place._id
      }
    }

    const ads = await Ad.find({
      place: place._id,
      licensed: true
    })

    ads.forEach((ad)=>{
      const theAd = {
        adType: ad.adType,
        adScale: ad.adScale,
        adName: ad.adName,
        adImages: [],
        adId: ad._id
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

router.get("/details/:placeId", async (req, res)=>{
  const place = await Place.findById(req.params.placeId)
  const result = {
    place: place
  }
  res.json(result)
})

router.get("/view-all", async (req, res)=>{
  const places = await Place.find({})

  let username = null
  createMessage = null
  if(req.query.createSuccess){
    createMessage = "Account created"
  }
  if(res.locals.user){
    username = res.locals.user.username
  }

  let role = null
  if(res.locals.user){
    role = res.locals.user.role
  }

  res.render("viewPlaces", {
    places: places,
    role: role,
    username: username,
    createMessage: createMessage,
    ward: res.locals.user ? res.locals.user.ward : null,
    district: res.locals.user ? res.locals.user.district : null
  })
})

router.get("/view-by-ward", async (req, res)=>{
  const places = await Place.find({ward: res.locals.user.ward})
  
  let username = null
  createMessage = null
  if(req.query.createSuccess){
    createMessage = "Account created"
  }
  if(res.locals.user){
    username = res.locals.user.username
  }

  let role = null
  if(res.locals.user){
    role = res.locals.user.role
  }

  res.render("viewPlaces", {
    places: places,
    role: role,
    username: username,
    createMessage: createMessage,
    ward: res.locals.user ? res.locals.user.ward : null,
    district: res.locals.user ? res.locals.user.district : null
  })
})



router.get('/allAdPlacement', async function(req, res) {
  const adPlacements = Place.find({});
  res.render("department/adPlacement", {
    announce: null,
    adPlacements: adPlacements,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})



module.exports = router