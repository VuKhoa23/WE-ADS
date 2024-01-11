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

router.post('/createAd/:adPlacementId', async (req, res) => {
  const adPlacementId = req.params.adPlacementId;
  const adPlacement = await Place.findOne({_id: adPlacementId});
  const adData = {
      adType: req.body.adType,
      adName: req.body.adName,
      adScale: `${req.body.width}m x ${req.body.height}m`,
      adImages: [req.body['ads-images-url']],
      companyName: req.body.companyName,
      companyPhone: req.body.companyPhone,
      companyEmail: req.body.companyEmail,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      licensed: false, 
      place: adPlacementId,
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

  const adPlacement = await Place.findOne({_id: ad.place});
  res.render("department/editAdForm", {
    ad: ad,
    adPlacement: adPlacement,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,
  })
})

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