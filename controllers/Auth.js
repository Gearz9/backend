const User = require('../models/AgencySchema');
const OTP  = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const Profile = require('../models/Profile');
require('dotenv').config();



exports.sendOTP = async(req,res) => {
    try{
        const {email} = req.body;
        console.log(email);
    //check if user already exist
    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:'User Already Registered',
        })
    }

    //generate otp
    var otp =  otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })

    //check unique otp or not 
    var result = await OTP.findOne({otp:otp});

    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
         result = OTP.findOne({otp:otp});
    }

    const otpPayload = {
        email,otp
    }
    //create an entry in db for OTP 
    const otpBody = await OTP.create(otpPayload);

    //return response Successfull 
    return res.status(200).json({
        success:true,
        message:'Otp Sent Successfully',
        otp,
    })
}
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
    }   
    
}