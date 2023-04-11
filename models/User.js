const mongoose =require ('mongoose');

const UserSchema= new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true,
    },
    password:String,
    logintype:String,
});

const userModel=mongoose.model('user', UserSchema );

module.exports=userModel;