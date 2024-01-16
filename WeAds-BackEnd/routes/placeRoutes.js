const express = require('express');
const router = express.Router();
const Place = require("../model/places")
const Ad = require("../model/ads")
const Officer = require("../model/officer");
const AdTypes = require("../model/advertisement");
const UpdateRequest = require("../model/updateRequest");
const { ObjectId } = require('mongodb');
const AdType = require("../model/advertisement");
const LocationType = require("../model/locationType");
const AdFormat = require("../model/adFormat");
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
        adType: place.adType,
        ward: place.ward,
        locationType: place.locationType,
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
  let id = null;
  if(res.locals.user){
    id = res.locals.user._id;
  }
  if (!id) {
    res.redirect('/weads/home');
    return;
  }
  try {
    const officer = await Officer.findById(id);
    let places = null;
    if (officer.role == 'Ward') {
      places = await Place.find({ ward: officer.ward, district: officer.district });
    }
    else if (officer.role == 'District') {
      places = await Place.find({ district: officer.district });
    }
    else {
      places = await Place.find({});
    }
    res.render("department/adPlacement", {
      announce: null,
      adPlacements: places,
      username: res.locals.user ? res.locals.user.username : null,
      role: res.locals.user ? res.locals.user.role : null,
    })
  }
  catch (err) {
    console.log(err.message);
    res.status(400).send("Some error occurred");
  }
});

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

  const adTypes = await AdFormat.find({});
  const locationTypes = await LocationType.find({});
  res.render("department/createAdPlacement", {
    lat: req.query.lat,
    lng: req.query.lng,
    adTypes: adTypes,
    locationTypes: locationTypes,
    ward: req.query.ward,
    district: req.query.district,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })

})


router.post('/addAdPlacement', async function(req, res) {
  try {
      const coordinates = req.body.coordinates;
      let coordinatesArray = coordinates.split(',').map(coord => parseFloat(coord.trim()));
      coordinatesArray = coordinatesArray.reverse();

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
          // Adjusted code to handle locationType as an array
          const locationTypes = Array.isArray(req.body.locationType) ? req.body.locationType : [req.body.locationType];
          
          await Place.create({ ...req.body, coordinates: coordinatesArray, locationType: locationTypes });

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
  const adTypes = await AdFormat.find({});
  const LocationTypes = await LocationType.find({});

  res.render("department/editAdPlacementForm", {
    adPlacement: adPlacement,
    adTypes: adTypes,
    locationTypes: LocationTypes,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})

router.post('/editAdPlacementForm/:_id', async function(req, res) {
  const adPlacement = await Place.findOne({_id: new ObjectId(req.params._id)});
  const { adType, locationType, adPlanned, reason } = req.body;
  const role = res.locals.user ? res.locals.user.role : null;
  const officerId = res.locals.user ? res.locals.user._id : null;
  
  if (!adPlacement) {
    res.status(404).json({ success: false, error: 'place not found' });
    return;
  }
  
  try {
    if (role == 'Department') {
      await Place.updateOne({_id: new ObjectId(req.params._id) }, { adType, locationType, adPlanned });
      res.status(200).json({ success: true });
    }
    else {
      await UpdateRequest.create({ targetId: new ObjectId(req.params._id), createBy: new ObjectId(officerId), updateFor: 'Place', state: 0, reason, ward: adPlacement.ward, district: adPlacement.district, adType, locationType, adPlanned });
      res.status(200).json({ success: true });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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

router.get('/viewAllLocationType', async function(req, res) {
  const types = await LocationType.find({});
  res.render("department/viewAllLocationType", {
    announce: null,
    types: types,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})

router.post('/addType', async function(req, res) {
  try {
    const isExist = await LocationType.findOne({name: req.body.name});

    if(isExist){
      const types = await LocationType.find({});
      res.render("department/viewAllLocationType", {
        announce: 'exist',
        types: types,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      })
    } else {
      await LocationType.create(req.body);
      const types = await LocationType.find({});

      res.render("department/viewAllLocationType", {
        announce: 'create',
        types: types,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/editType/:_id', async function(req, res) {
  try {

      const id = req.params._id;
      const type = await LocationType.findOne({_id: id});
      const name = req.body.name;
      const isExist = await LocationType.findOne({name: name});
      console.log(isExist); 

      if(isExist){
        const types = await LocationType.find({});
        res.render("department/viewAllLocationType", {
          announce: 'exist',
          types: types,
          username: res.locals.user ? res.locals.user.username : null,
          role: res.locals.user ? res.locals.user.role : null,
        })
      } else {
        await LocationType.findByIdAndUpdate(type._id, {name: name});
        const types = await LocationType.find({});
        res.render("department/viewAllLocationType", {
          announce: 'edit',
          types: types,
          username: res.locals.user ? res.locals.user.username : null,
          role: res.locals.user ? res.locals.user.role : null,
        })
      }
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

router.get('/deleteType/:_id', async function(req, res) {
  try {
      const type = await LocationType.findOne({_id: req.params._id});
      if(!type){
          return res.status(404).json({message: `cannot find any type with ID ${req.params._id}`})
      } else {
          await LocationType.findByIdAndDelete(type._id);
          const types = await LocationType.find({});

          res.render("department/viewAllLocationType", {
            announce: 'delete',
            types: types,
            username: res.locals.user ? res.locals.user.username : null,
            role: res.locals.user ? res.locals.user.role : null,
          })
      }
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})
module.exports = router