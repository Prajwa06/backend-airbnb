const mongoose=require('mongoose');
const Place=require('./Place');
const bookingSchema=new mongoose.Schema({
    place:{type:mongoose.Schema.Types.ObjectId,
        required:true,
         ref:Place},
    checkIn:{type:Date, required:true},
    checkOut:{type:Date, required:true},
    name:{type:String, required:true},
    mobile:{type:String,  required:true},
    price:Number,
    noOfGuests:Number,
    owner:String,
})
const BookingModel=mongoose.model('booking',bookingSchema);

module.exports=BookingModel;