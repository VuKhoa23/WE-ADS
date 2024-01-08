const express = require('express');
const router = express.Router();
const Officer = require("../model/officer")
const District = require("../model/district")
const Ward = require("../model/ward") 
const Advertisement = require("../model/advertisement")

router.get('/department/create', (req, res) => {
  res.render("department/create-account", {
    username: res.locals.user.username,
    emailMessage: null,
    usernameMessage: null,
    body: null
  })
});

router.post('/department/create', async (req, res) => {
  let emailMessage = null;
  const tempOfficerEmail = await Officer.findOne({email: req.body.email})
  if(tempOfficerEmail){
    emailMessage = "This email already exists"
  }

  let usernameMessage = null;
  const tempOfficerUsername = await Officer.findOne({username: req.body.username})
  if(tempOfficerUsername){
    usernameMessage = "This username already exists"
  }

  if(usernameMessage === null && emailMessage === null){
    const officer = await Officer.create(req.body)
    console.log(req.body.role)
    res.redirect("/weads/home?createSuccess=true")
    return
  }

  res.render("department/create-account", {
    emailMessage: emailMessage,
    usernameMessage: usernameMessage,
    body: req.body,
    username: res.locals.user.username,
  })
})

router.get("/create-account", async (req, res)=>{
  await Officer.create({
    username: "youngHT",
    password: "12345678",
    email: "hohuutam287@gmail.com",
    phone: "0932715653",
    role: "Department",
    district: "12",
    ward: "12",
  })
  res.send("OK")
})

router.post('/department/places/addDistrict', async function(req, res) {
  try {
    const isExist = await District.findOne({name: req.body.name});

    if(isExist){
      res.status(400).json({ message: 'This district already exists' });
    } else {
      const district = await District.create(req.body);
      const districts = await District.find({});

      res.render("department/district/viewAllDistrict", {
        announce: 'create',
        districts: districts,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/department/places/allDistrict', async function (req, res) {
  const districts = await District.find({});

  res.render("department/district/viewAllDistrict", {
    announce: null,
    districts: districts,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,

  })
})

router.post('/department/places/editDistrict/:_id', async function(req, res) {
  try {

      const id = req.params._id;
      const district = await District.findOne({_id: id});
      const name = req.body.name;
      

      if(district){
          await District.findByIdAndUpdate(district._id, {name: name});

          const districts = await District.find({});
          res.render("department/district/viewAllDistrict", {
            announce: 'edit',
            districts: districts,
            username: res.locals.user ? res.locals.user.username : null,
            role: res.locals.user ? res.locals.user.role : null,
          })
      }
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

router.get('/department/places/deleteDistrict/:_id', async function(req, res) {
  try {
      const district = await District.findOne({_id: req.params._id});
      if(!district){
          return res.status(404).json({message: `cannot find any district with ID ${req.params._id}`})
      } else {
          await District.findByIdAndDelete(district._id);
          const districts = await District.find({});

          res.render("department/district/viewAllDistrict", {
            announce: 'delete',
            districts: districts,
            username: res.locals.user ? res.locals.user.username : null,
            role: res.locals.user ? res.locals.user.role : null,
          })
      }
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

router.post('/department/places/addWard/:oid', async function(req, res) {
  try {
    const isExist = await Ward.findOne({name: req.body.name, district: req.params.oid});

    if(isExist){
      res.status(400).json({ message: 'This ward already exists' });
    } else {

      const district = await District.findOne({_id: req.params.oid});
      const ward = await Ward.create({name: req.body.name, district: req.params.oid});
      const wards = await Ward.find({district: req.params.oid});

      res.render("department/ward", {
        announce: 'create',
        wards: wards,
        district_name: district.name,
        district_id: district._id,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      });
    }
  } catch (error) {
    console.error('Error fetching ward:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/department/places/allWard/:_id', async function(req, res) {
  try {
      const districtId = req.params._id;

      const district = await District.findOne({_id: districtId});

      const wards = await Ward.find({district: districtId});

      res.render("department/ward", {
        announce: null,
        wards: wards,
        district_name: district.name,
        district_id: district._id,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      });

  } catch (error) {
    console.error('Error fetching ward:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/department/places/editWard/:_id', async function(req, res) {
  try {
    const id = req.params._id;
    const ward = await Ward.findOne({_id: id});
    const name = req.body.name;

    if(ward){
      await Ward.findByIdAndUpdate(ward._id, {name: name});

      const district = await District.findOne({_id: ward.district});

      const wards = await Ward.find({district: ward.district});

      res.render("department/ward", {
        announce: 'edit',
        wards: wards,
        district_name: district.name,
        district_id: district._id,
        username: res.locals.user ? res.locals.user.username : null,
        role: res.locals.user ? res.locals.user.role : null,
      });
    }
  } catch (error) {
    console.error('Error fetching ward:', error);
    res.status(500).send('Internal Server Error');
  }
})

router.get('/department/places/deleteWard/:_id', async function(req, res) {
  try {
      const ward = await Ward.findOne({_id: req.params._id});
      if(!ward){
          return res.status(404).json({message: `cannot find any ward with ID ${req.params._id}`})
      } else {
          await Ward.findByIdAndDelete(ward._id);

          const wards = await Ward.find({district: ward.district});

          const district = await District.findOne({_id: ward.district});
          res.render("department/ward", {
            announce: 'delete',
            wards: wards,
            district_name: district.name,
            district_id: district._id,
            username: res.locals.user ? res.locals.user.username : null,
            role: res.locals.user ? res.locals.user.role : null,
          });
      }
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})


router.post('/department/advertisement/addType', async function(req, res) {
  try {
    const isExist = await Advertisement.findOne({name: req.body.name});

    if(isExist){
      res.status(400).json({ message: 'This type already exists' });
    } else {
      const type = await Advertisement.create(req.body);
      const types = await Advertisement.find({});

      res.render("department/advertisement/viewAllType", {
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

router.get('/department/advertisement/allType', async function (req, res) {
  const types = await Advertisement.find({});

  res.render("department/advertisement/viewAllType", {
    announce: null,
    types: types,
    username: res.locals.user ? res.locals.user.username : null,
    role: res.locals.user ? res.locals.user.role : null,

  })
})

router.post('/department/advertisement/editType/:_id', async function(req, res) {
  try {

      const id = req.params._id;
      const type = await Advertisement.findOne({_id: id});
      const name = req.body.name;
      

      if(type){
          await Advertisement.findByIdAndUpdate(type._id, {name: name});

          const types = await Advertisement.find({});
          res.render("department/advertisement/viewAllType", {
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

router.get('/department/advertisement/deleteType/:_id', async function(req, res) {
  try {
      const type = await Advertisement.findOne({_id: req.params._id});
      if(!type){
          return res.status(404).json({message: `cannot find any type with ID ${req.params._id}`})
      } else {
          await Advertisement.findByIdAndDelete(type._id);
          const types = await Advertisement.find({});

          res.render("department/advertisement/viewAllType", {
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