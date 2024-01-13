const express = require('express');
const router = express.Router();
const Place = require("../model/places");
const Ad = require("../model/ads");
const { ObjectId } = require('mongodb');

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

// router.get('/view-all', async (req, res) => {
//   let id = null;
//   if(res.locals.user){
//     id = res.locals.user._id;
//   }
//   if (!id) {
//     res.redirect('/weads/home');
//     return;
//   }
//   try {
//     const officer = await Officer.findById(id);
//     let ads = null;
//     if (officer.role == 'Ward') {
//       ads = Ad.find({ licensed: false }).populate({
//         path: 'place',
//         match: { ward: officer.ward, district: officer.district }
//       });
//     }
//     else if (officer.role == 'District') {
//       ads = Ad.find({ licensed: false }).populate({
//         path: 'place',
//         match: { district: officer.district }
//       });
//     }
//     else {
//       ads = await Ad.find({ licensed: false}).populate('place');
//     }
//     let username = null
//     createMessage = null
//     if(req.query.createSuccess){
//       createMessage = "Account created"
//     }
//     if(res.locals.user){
//       username = res.locals.user.username
//     }

//     let role = null
//     if(res.locals.user){
//       role = res.locals.user.role
//     }

//     res.render("viewAllAds", {
//       ads,
//       role: role,
//       username: username,
//       createMessage: createMessage,
//       ward: res.locals.user ? res.locals.user.ward : null,
//       district: res.locals.user ? res.locals.user.district : null
//     })
//   }
//   catch (err) {
//     console.log(err.message);
//     res.status(400).send("Some error occurred");
//   }
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

router.post('/editAdForm/:id', async function(req, res) {
  const id = req.params.id;
  const { adType, width, height, adName, adImages, companyName, companyPhone, companyEmail, startDate, endDate } = req.body;
  const adScale = width + "m x " + height + "m";
  console.log(req.body);

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

    await Ad.updateOne({ _id: new ObjectId(id)}, { adType, adScale, adName, adImages, companyName, companyPhone, companyEmail, startDate: new Date(startDate), endDate: new Date(endDate) })
    res.status(201).json({ success: true });
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