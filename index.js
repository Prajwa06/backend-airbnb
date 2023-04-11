// initialisations
require("dotenv").config();
const express = require("express");
const app = express();
const port = 8080;
const date = new Date();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const secret = bcrypt.genSaltSync(10);
const download = require("image-downloader");
const username = encodeURIComponent("prajwal");
const password = encodeURIComponent(process.env.password);
const multer=require('multer');
const fs=require('fs');
const Place=require('./models/Place');
const Booking=require('./models/Booking');
// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static(__dirname+'/uploads'));
const photosMiddleware=multer({dest:'uploads'});
// database
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.q0nvtjo.mongodb.net/?retryWrites=true&w=majority`
);
const db = mongoose.connection;
// check connection status
db.once("open", () => {
  console.log("Db is connected");
});

//api routes
// test request
app.get("/", (req, res) => {
  res.send("backend has started");
});

// registering user
app.post("/register", async (req, res) => {
  // destructring the body compoents
  const { name, email, password, logintype } = req.body;

  try {
    // creating new user if have unique and non registered email
    const newUser = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, secret),
      logintype: logintype,
    });

    // sending response true;
    let success = true;
    res
      .status(200)
      .json({ success, user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.log(error.message);
    res.status(422).send({ message: "email already exist" });
  }
});

// login user
app.post("/login", async (req, res) => {
  // fetching info from post req
  const { email, password } = req.body;
  try {
    // finding user by email
    const currUser = await User.findOne({ email });
    // if exist
    if (currUser) {
      // comparing passwords
      const comparePassword = await bcrypt.compare(password, currUser.password);
      // matched
      if (comparePassword) {
        // creating jwt token and sending cookie as token and response
        res.json({ currUser: true, message: "Log In Succesful" });
      }
      // not matched
      else {
        res.send({ message: "Incorrect password" });
      }
    }
    // no user found
    else {
      res.send({ message: "No user found please resgister" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal Server Error login Failed" });
  }
});

// uploadbyLink

  



// add yout place
app.post('/places', async(req,res)=>{
  try{
  const{ title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    prices,
    email}=req.body;
  const user= await User.findOne({email});
 
  const placeDoc= await  Place.create({
        owner:user._id,
        title,
    address,
    photos:addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    prices,
    });

    res.json({placeDoc,success:true});
  }catch(err){
    res.json({err,success:false});
  }
    
});
// get all your places
app.post('/getplaces',async (req,res)=>{
  try {
   const{email}=req.body;
  const user=await User.findOne({email});
  const places=await Place.find({owner:user._id});
  res.json({places, success:true});
  } catch (error) {
    res.json(error.message);
  }
  
})


// get particluar place by id

app.get('/places/:id',async (req,res)=>{
  const{id}=req.params;
  res.json(await Place.findById(id));
});



app.put('/places/:id',async(req,res)=>{
  try{
    const {id}=req.params;
    const{ title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      prices,
      email}=req.body;
    const user= await User.findOne({email});
    const placeDoc=await Place.findById(id);
    
    
    if(user._id.toString()===placeDoc.owner.toString()){
    const placeDocc= await  Place.updateMany({
      title,
      address,
      photos:addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      prices,
      });
  
      res.json({success:true});
    }
    else{
      res.json({success:false ,message:"unauthorised user"});
    }
    }catch(err){
      res.json({err,success:false});
    }

});



app.get('/places',async (req,res)=>{
    res.json(await Place.find());
});

app.post('/bookings', async (req,res)=>{
  try {
    const{checkIn,checkOut,place,mobile,name,noOfGuest,price,email}=req.body;
    
  const bookingData=await Booking.create({
    checkIn,checkOut,place,mobile,name,noOfGuest,price,owner:email,
  });
  res.json({ id:bookingData._id,status:true});
  } catch (error) {
    res.json({status:false});
  }
  

})

app.get('/bookings/:email', async(req,res)=>{
  try {
    const{email}=req.params;
  const bookings=await Booking.find({owner:email}).populate('place');
  res.json({bookings,success:true});
  } catch (error) {
    res.json({success:false});
    
  }
  
})


// listen
app.listen(port, () => {
  console.log(
    "app is running on port " + port + " at " + date.toLocaleString()
  );
});


module.exports=app;