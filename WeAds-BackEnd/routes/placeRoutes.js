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
  const adPlacements = await Place.find({});
  res.render("department/adPlacement", {
    announce: null,
    adPlacements: adPlacements,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})

router.get('/addAdPlacementForm', async function(req, res) {

  res.render("department/createAdPlacement", {
    lat: req.query.lat,
    lng: req.query.lng,
    ward: req.query.ward,
    district: req.query.district,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })

})


router.post('/addAdPlacement', async function(req, res) {
  try {
    const coordinates  = req.body.coordinates;
    const coordinatesArray = coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const isExist = await Place.findOne({ coordinates: coordinatesArray });

    if (isExist) {
      const adPlacements = await Place.find({});
      res.render("department/adPlacement", {
        announce: 'exist',
        adPlacements: adPlacements,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      });
    } else {
      await Place.create({ ...req.body, coordinates: coordinatesArray });
      const adPlacements = await Place.find({});
      res.render("department/adPlacement", {
        announce: 'create',
        adPlacements: adPlacements,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/deleteAdPlacement/:_id', async function(req, res) {
  try {
    await Place.findByIdAndDelete({_id: req.params._id});
    const adPlacements = await Place.find({});
    res.render("department/adPlacement", {
      announce: 'delete',
      adPlacements: adPlacements,
      username: res.locals.user ? res.locals.user.username : null,
      role: res.locals.user ? res.locals.user.role : null,
    });
  } catch (error) {
    res.status(500).json({message: error.message})
  } 
});

router.get('/editAdPlacementForm/:_id', async function(req, res) {
  const adPlacement = await Place.findOne({_id: req.params._id});

  res.render("department/editAdPlacementForm", {
    adPlacement: adPlacement,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })

})

router.post('/editAdPlacement/:_id', async function(req, res) {
  const id = req.params._id;
  const adPlacement = await Place.findOne({_id: id});

  adPlacement.locationType = req.body.locationType;
  adPlacement.adType = req.body.adType;
  adPlacement.adPlanned = req.body.adPlanned;

  await adPlacement.save();

  const adPlacements = await Place.find({});
  res.render("department/adPlacement", {
    announce: 'edit',
    adPlacements: adPlacements,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})

module.exports = router