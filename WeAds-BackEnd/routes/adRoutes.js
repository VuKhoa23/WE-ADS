const express = require('express');
const router = express.Router();
const Place = require("../model/places");
const Ad = require("../model/ads");
const UpdateRequest = require("../model/updateRequest");
const { ObjectId } = require('mongodb');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


const {
  uploadAds
} = require("../middlewares/fileUploadMiddleware");

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

router.get("/details/:adId", async (req, res)=>{
  const ad = await Ad.findById(req.params.adId)
  const result = {
    ad: ad
  }
  res.json(result)
})

router.get("/allAds/:_id", async function(req, res) {
  const adPlacement = await Place.findOne({_id: req.params._id});

  const ads = await Ad.find({place: req.params._id});
  res.render("department/viewAllAds", {
    announce: null,
    adPlacement: adPlacement,
    ads: ads,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
});

router.get("/addAdsForm/:_id", async function(req, res) {
  const adPlacement = await Place.findOne({_id: req.params._id});
  res.render("department/createAds", {
    adPlacement: adPlacement,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  });
})

router.get('/createAd/:adPlacementId', async (req, res) => {
  const adPlacementId = req.params.adPlacementId;
  const adPlacement = await Place.findOne({_id: adPlacementId});
  const adData = {
    place: adPlacementId,
    licensed: false
  };

  try {
      await Ad.create(adData);
      const ads = await Ad.find({place: req.params.adPlacementId});
      res.render("department/viewAllAds", {
        announce: 'create',
        adPlacement: adPlacement,
        ads: ads,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      })
  } catch (error) {
      res.status(500).send('Internal Server Error');
  }
});

router.get('/editAdForm/:_id', async function(req, res) {
  const ad = await Ad.findOne({_id: req.params._id});
  const startDate = new Date(ad.startDate);
  const endDate = new Date(ad.endDate);

  const adPlacement = await Place.findOne({_id: ad.place});
  res.render("department/editAdForm", {
    ad: ad,
    placeId: ad.place,
    startDate: `${startDate.getDate()}/${startDate.getMonth()+1}/${startDate.getFullYear()}`,
    endDate: `${endDate.getDate()}/${endDate.getMonth()+1}/${endDate.getFullYear()}`,
    adPlacement: adPlacement,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})

router.post('/editAdForm/:id', uploadAds.fields([
  {
    name: "theAdImages",
    maxCount: 5,
  }
]), async function(req, res) {
  const id = req.params.id;
  console.log(req.body);
  let { adType, width, height, adName, adImages, companyName, companyPhone, companyEmail, startDate, endDate, reason } = req.body;
  const adScale = width + "m x " + height + "m";
  const role = res.locals.user ? res.locals.user.role : null;
  const officerId = res.locals.user ? res.locals.user._id : null;

  // handle add image
  const data = req.files;
  const images = Object.values(data)[0]
  if (!adImages)
    adImages = [];
  if (typeof adImages == "string"){
    imageArray = [];
    imageArray.push(adImages);
    adImages = imageArray;
  }
  if (images) {
    for(let image of images){
      const fileName = Date.now() + image.originalname.replace(/ /g, "")
      adImages.push("https://weads.s3.ap-southeast-2.amazonaws.com/" + fileName)
      const params = {
        Bucket: bucket_name,
        Key: fileName,
        Body: image.buffer,
        ContentType: image.mimetype
      }
      const command = new PutObjectCommand(params)
      await s3.send(command)
    }
  }
  if (!id) {
    res.status(400).json({ success: false, error: "Missing id" });
    return;
  }
  
  try {
    const ad = await Ad.findById(id).populate('place');
    if (!ad) {
      res.status(400).json({ success: false, error: "Ads not found" });
      return;
    }

    if (role == 'Department') {
      await Ad.updateOne({ _id: new ObjectId(id)}, { adType, adScale, adName, adImages, companyName, companyPhone, companyEmail, startDate: new Date(startDate), endDate: new Date(endDate) })
      res.status(201).json({ success: true });
    }
    else {
      await UpdateRequest.create({ targetId: new ObjectId(req.params.id), createBy: new ObjectId(officerId), updateFor: 'Ad', state: 0, ward: ad.place.ward, district: ad.place.district, reason, adType, adScale, adName, adImages, companyName, companyPhone, companyEmail, startDate: new Date(startDate), endDate: new Date(endDate) });
      res.status(200).json({ success: true });
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, error: err.message });
    return;
  }
});

router.post('/editAd/:adPlacementId/:adId', async function(req, res) {
  try {

    const adPlacement = await Place.findOne({_id: req.params.adPlacementId});
    const adToUpdate = await Ad.findOne({_id: req.params.adId});

    adToUpdate.adType = req.body.adType;
    adToUpdate.adName = req.body.adName;
    const width = req.body.width || 0; 
    const height = req.body.height || 0; 
    adToUpdate.adScale = `${width}m x ${height}m`;
    const adImages = req.body['ads-image-url'].split(',').map(image => image.trim());
    adToUpdate.adImages = adImages;
    adToUpdate.companyName = req.body.companyName;
    adToUpdate.companyPhone = req.body.companyPhone;
    adToUpdate.companyEmail = req.body.companyEmail;
    adToUpdate.startDate = req.body.startDate;
    adToUpdate.endDate = req.body.endDate;

    await adToUpdate.save();

    // Redirect to the viewAllAds page with the updated data
    const ads = await Ad.find({ place: req.params.adPlacementId });
    res.render("department/viewAllAds", {
      announce: 'edit',
      adPlacement: adPlacement,
      ads: ads,
      username: res.locals.user ? res.locals.user.username : null,
      role: res.locals.user ? res.locals.user.role : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/deleteAd/:_id', async function(req, res) {
  try {
    const ad = await Ad.findOne({_id: req.params._id});
    const adPlacement = await Place.findOne({_id: ad.place});
    await Ad.findByIdAndDelete({_id: req.params._id});
    const ads = await Ad.find({});
    res.render("department/viewAllAds", {
      announce: 'delete',
      ads: ads,
      adPlacement: adPlacement,
      username: res.locals.user ? res.locals.user.username : null,
      role: res.locals.user ? res.locals.user.role : null,
    });
  } catch (error) {
    res.status(500).json({message: error.message})
  } 
});



module.exports = router