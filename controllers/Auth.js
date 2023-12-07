const agency = require('../models/AgencySchema');
const OTP  = require('../models/OTPSchema');
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
    const checkAgencyPresent = await agency.findOne({email});

    if(checkAgencyPresent){
        return res.status(401).json({
            success:false,
            message:'Agency Already Registered',
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

exports.register = async(req,res) => {
    try{ //data fetch from request body 
     // validate kro
     
     const {
         Name,
         email,
         password,
         confirmPassword,
         agencyType,
         contactNumber,
         lat,
         lng,
         address,
         otp,
     } = req.body;
     if(!Name ||!email ||!password ||!confirmPassword ||!otp){
         return res.status(403).json({
             success:false,
             message:'All fields Are Required',
             
         })
     }
     //password match
     if(password != confirmPassword){
         return res.status(200).json({
             success:false,
             message:'Password and Confirm Password are not same',
         })
     }
 
     //check if agency already exist
     const existingagency = await agency.findOne({email});
 
     if(existingagency){
         return res.status(200).json({
             success:false,
             message:'agency is Already registerd',
         })
     }
 
 
     //find most recent OTP stored for the agency
     const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
     if(recentOtp.length === 0){
         return res.status(400).json({
             success:false,
             message:'Otp Not found',
         })
     }
     else if(otp != recentOtp[0].otp){
         return res.status(400).json({
             success:false,
             message:'Otp doesnt match',
         })
     }
     //hash password 
     const hashedPassword = await bcrypt.hash(password,10);
     //store password
     
 
     const Agency = await agency.create({
         name:Name,
         email,
         password: hashedPassword,
         agencyType: agencyType,
         contactNumber:contactNumber,
         lat:lat,
         lng:lng,
         address:address,
     });
 
     return res.status(200).json({
         success:true,
         message:'agency created successfuly',
         Agency
     })
 
 
 }
     
 
     
 
     catch(err){
        console.log(err);
         return res.status(500).json({
             success:false,
             message:'user cannot be registered',
             error:err.message
         })
     }
 
 }

 exports.login = async(req,res) => {
    try{
        ///get data from req body
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All field are required',
            })
        }
        //validation data
        //user check exist or not
        const Agency = await agency.findOne({email});
        if(!Agency){
            return res.status(401).json({
                success:false,
                message:'Agency is not registered',
            })
        }
        //generate jwt token after password matches
        if(await bcrypt.compare(password,Agency.password)){
            const payload = {
                email:Agency.email,
                id:Agency._id,
                accountType:Agency.accountType,
            }
            const token  = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h'
            })
            Agency.token = token;
            Agency.password = undefined;

            const options = {
                expires:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie('token',token,options).status(200).json({
                success:true,
                token,
                Agency,
                message:'Logged in successfully',
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'password is incorrect'
            })
        }
        //create a cookie and send response
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Error while logging in',
            error:err.message,
            
        })
    }
}

