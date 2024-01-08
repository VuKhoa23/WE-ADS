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


module.exports = router