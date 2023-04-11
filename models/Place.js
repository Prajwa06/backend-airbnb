const mongoose =require('mongoose');

const PlaceSchema=new mongoose.Schema({
    owner:String,
    title:String,
    address:String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut:Number,
    maxGuests:Number,
    prices:Number,
});

const PlaceModel=mongoose.model('place', PlaceSchema);

module.exports=PlaceModel;