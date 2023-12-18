const express = require("express");
const router = express.Router();
const Agency = require("../models/AgencySchema");
const Resources = require("../models/ResourcesSchema");

exports.addResource = async (req, res) => {
 try {
    const { agencyId, resourceName, resourceQuantity } = req.body;
    console.log(req.body);

    // Create a new Resources document
    const newResource = new Resources({
      name: resourceName,
      quantity: resourceQuantity,
    });

    // Save the new resource to the database
    await newResource.save();

    // Find the agency by ID
    const agency = await Agency.findById(agencyId);
    if(!agency){
      return res.status(500).json({
        success:false,
        error:"Agency not found",
      })
    }

    // Add the _id of the new resource to the resources array of the agency
    agency.resources.push(newResource._id);

    // Save the updated agency document
    await agency.save();

    res.status(201).json({
      success: true,
      message: "Resource added to the agency successfully",
      resource: newResource,
    });
  } catch (error) {
    console.error("Error adding resource to the agency:", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
}