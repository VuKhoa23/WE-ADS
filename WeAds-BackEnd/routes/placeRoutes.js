const express = require('express');
const router = express.Router();
const Place = require("../model/places")
const Ad = require("../model/ads")
const Officer = require("../model/officer");
const UpdateRequest = require("../model/updateRequest");
const { ObjectId } = require('mongodb');
const LocationType = require("../model/locationType");
const District = require("../model/district");
const Ward = require("../model/ward");
const AdFormat = require("../model/adFormat");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { uploadAds } = require("../middlewares/fileUploadMiddleware");

const bucket_name = process.env.BUCKET_NAME
const bucket_region = process.env.BUCKET_REGION
const access_key = process.env.ACCESS_KEY
const secret_access_key = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials:{
    accessKeyId: access_key,
    secretAccessKey: secret_access_key
  },
  region: bucket_region
})

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
        placeImage: place.placeImage,
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
  let currentDistrict = res.locals.user.district || req.query.district;
  let currentWard = res.locals.user.ward || req.query.ward;
  let adPlacements = [];
  if (currentDistrict && currentWard) {
    adPlacements = await Place.find({ district: currentDistrict, ward: currentWard });
  }
  else if (currentDistrict && !currentWard) {
    adPlacements = await Place.find({ district: currentDistrict });
  }
  else  {
    adPlacements = await Place.find({});
  }

  let wardList = [];
  const districtList = await District.find({});

  if (currentDistrict) {
    wardList = await Ward.find().populate('district');
    wardList = wardList.filter(ward => {
      return ward.district.name == currentDistrict;
    });
  }

  res.render("department/adPlacement", {
    announce: null,
    currentDistrict: currentDistrict? currentDistrict : 'Tất cả',
    districtList,
    wardList,
    currentWard: currentWard? currentWard : 'Tất cả',
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
    locationTypes: locationTypes,
    adTypes: adTypes,
    locationTypes: locationTypes,
    ward: req.query.ward,
    district: req.query.district,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })

})


router.post('/addAdPlacement', uploadAds.fields([
  {
    name: "thePlaceImages",
    maxCount: 1,
  },
]), async function(req, res) {
  try {
      const coordinates = req.body.coordinates;
      let coordinatesArray = coordinates.split(',').map(coord => parseFloat(coord.trim()));
      coordinatesArray = coordinatesArray.reverse();

      const isExist = await Place.findOne({ coordinates: coordinatesArray });

      if (isExist) {
          const adPlacements = await Place.find({});
          res.status(400).json({ success: false, exist: true,error: 'Place is exist' });
      } else {
          // Adjusted code to handle locationType as an array
          const locationTypes = Array.isArray(req.body.locationType) ? req.body.locationType : [req.body.locationType];
          const { type, adType, adPlanned, ward, district } = req.body;
          const data = req.files;
          const images = Object.values(data)[0];
          let placeImage = undefined;
          if (images) {
            for(let image of images){
              const fileName = Date.now() + image.originalname.replace(/ /g, "");
              placeImage = "https://weads.s3.ap-southeast-2.amazonaws.com/" + fileName;
              const params = {
                Bucket: bucket_name,
                Key: fileName,
                Body: image.buffer,
                ContentType: image.mimetype
              }
              const command = new PutObjectCommand(params);
              await s3.send(command);
            }
          }
          
        const thePlace = await Place.create({ type, adType, adPlanned, ward, district, coordinates: coordinatesArray, placeImage, locationType: locationTypes });
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${thePlace.coordinates[0]},${thePlace.coordinates[1]}.json?country=vn&access_token=${process.env.MAP_KEY}`
        );
        const result = await response.json()
        let address = result.features[0].place_name;
        thePlace.address = address;
        await thePlace.save()
        const adPlacements = await Place.find({});
        res.status(201).json({ success: true });
      }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false ,message: error.message });
  }
});


router.get('/deleteAdPlacement/:_id', async function(req, res) {
  let currentDistrict = res.locals.user.district || req.query.district;
  let currentWard = res.locals.user.ward || req.query.ward;
  let adPlacements = [];
  if (currentDistrict && currentWard) {
    adPlacements = await Place.find({ district: currentDistrict, ward: currentWard });
  }
  else if (currentDistrict && !currentWard) {
    adPlacements = await Place.find({ district: currentDistrict });
  }
  else  {
    adPlacements = await Place.find({});
  }

  let wardList = [];
  const districtList = await District.find({});

  if (currentDistrict) {
    wardList = await Ward.find().populate('district');
    wardList = wardList.filter(ward => {
      return ward.district.name == currentDistrict;
    });
  }
  
  try {
    await Place.findByIdAndDelete({_id: req.params._id});
    const adPlacements = await Place.find({});
    res.render("department/adPlacement", {
      announce: 'delete',
      adPlacements: adPlacements,
      username: res.locals.user ? res.locals.user.username : null,
      role: res.locals.user ? res.locals.user.role : null,
      currentDistrict,
      currentWard,
      districtList,
      wardList,
      currentWard: currentWard? currentWard : 'Tất cả',
      currentDistrict: currentDistrict? currentDistrict : 'Tất cả',
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

router.post('/editAdPlacementForm/:_id', uploadAds.fields([
  {
    name: "thePlaceImages",
    maxCount: 1,
  },
]),async function(req, res) {
  const adPlacement = await Place.findOne({_id: new ObjectId(req.params._id)});
  const { adType, adPlanned, reason } = req.body;
  const locationType = Array.isArray(req.body.locationType) ? req.body.locationType : [req.body.locationType];
  console.log(locationType);
  const oldPlaceImage = req.body.oldPlaceImage;
  
  const role = res.locals.user ? res.locals.user.role : null;
  const officerId = res.locals.user ? res.locals.user._id : null;
  
  const data = req.files;
  const images = Object.values(data)[0];
  let newPlaceImage = undefined;
  if (images) {
    for(let image of images){
      const fileName = Date.now() + image.originalname.replace(/ /g, "");
      newPlaceImage = "https://weads.s3.ap-southeast-2.amazonaws.com/" + fileName;
      const params = {
        Bucket: bucket_name,
        Key: fileName,
        Body: image.buffer,
        ContentType: image.mimetype
      }
      const command = new PutObjectCommand(params);
      await s3.send(command);
    }
  }

  let placeImage = undefined;
  
  if (oldPlaceImage !== undefined && oldPlaceImage !== 'undefined')
    placeImage = oldPlaceImage;
  else 
    placeImage = newPlaceImage;

  if (!adPlacement) {
    res.status(404).json({ success: false, error: 'place not found' });
    return;
  }
  
  try {
    if (role == 'Department') {
      await Place.updateOne({_id: new ObjectId(req.params._id) }, { placeImage, adType, locationType, adPlanned });
      res.status(200).json({ success: true });
    }
    else {
      await UpdateRequest.create({ targetId: new ObjectId(req.params._id), createBy: new ObjectId(officerId), updateFor: 'Place', state: 0, reason, placeImage, ward: adPlacement.ward, district: adPlacement.district, adType, locationType, adPlanned });
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