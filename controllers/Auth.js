const agency = require('../models/AgencySchema');
const OTP  = require('../models/OTPSchema');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { parse } = require('dotenv');
const nodemailer = require("nodemailer");

// Rest of your code using nodemailer

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
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ID, // Replace with your email
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: "surakshaservices100.1@gmail.com",
        to: email,
        subject: "Your OTP for Login",
        text: `Your OTP is: ${otp}`,
      };
     

    const otpPayload = {
        email,otp
    }
    //create an entry in db for OTP 
    const otpBody = await OTP.create(otpPayload);
    await transporter.sendMail(mailOptions);

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
     } = req.body;
     if(!Name ||!email ||!password ||!confirmPassword){
        console.log(Name,email,password,confirmPassword)
        console.log("All fields are required")
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
     
     //hash password 
     const hashedPassword = await bcrypt.hash(password,10);
     //store password
     
    //  const resourcesDataReference = new Resources();

 
     const Agency = await agency.create({
         name:Name,
         email,
         password: hashedPassword,
         agencyType: agencyType,
         contactNumber:contactNumber,
         lat:lat,
         lng:lng,
         location:{
            type:"Point",
            coordinates:[parseFloat(lat),parseFloat(lng)]
        },
         address:address,
        //  resources: resourcesDataReference._id,
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
        const Agency = await agency.findOne({email}).populate('resources');
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
            // res.cookie('token',token,options).status(200).json({
            //     success:true,
            //     token,
            //     Agency,
            //     message:'Logged in successfully',
            // })
            return res.status(200).json({
                success:true,
                token:token,
                agency:Agency,
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

exports.verify = async(req,res) => {
    try{
        const {email,otp} = req.body;
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if(recentOtp.length === 0){
            console.log("otp not found")
            return res.status(400).json({
                success:false,
                message:'Otp Not found',
            })
        }
        else if(otp != recentOtp[0].otp){
            console.log("otp doent match")
            return res.status(400).json({
                success:false,
                message:'Otp doesnt match',
            })
        }
        return res.status(200).json({
            success:true,
            message:'Otp verified successfully',
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'Error while verifying otp',
            error:err.message,
        })
    }
}
