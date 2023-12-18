const Agency = require('../models/AgencySchema');


exports.getAllAgencies = async(req,res) => {
    try{
        const agencies = await Agency.find().populate('resources').exec();
        res.status(200).json({
            success:true,
            agencies,
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}