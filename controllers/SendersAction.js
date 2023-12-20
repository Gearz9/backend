// controllers/requestController.js
const Request = require("../models/RequestSchema");
const Agency = require("../models/AgencySchema");
const Resources = require("../models/ResourcesSchema");
const { default: mongoose } = require("mongoose");
const{ObjectId} = require('mongodb');

// Assuming you have the necessary imports for Agency, Resources, and Request

exports.sendRequestToAgency = async (req, res) => {
  try {
    let { selectedAgencyId, userId, lat, lng ,resource} = req.body;

    // console.log("first " + selectedAgencyId + " second " + userId + " third " + lat + " fourth " + lng + " fifth " + resource)
    // console.log("REsource" , resource.name[0] , resource.quantity[0])

    // console.log("userId" , userId)

    // const selectedAgencyId1 =   mongoose.Types.ObjectId(selectedAgencyId);
    
    // Find the requesting agency.
    const requestingAgency = await Agency.findById(userId);
    if (!requestingAgency) {
      return res.status(404).json({
        success: false,
        message: "Requesting agency not found",
      });
    }

    // Find the target agency
    const targetAgency = await Agency.findById(selectedAgencyId);
    if (!targetAgency) {
      return res.status(404).json({
        success: false,
        message: "Target agency not found",
      });
    }

    // Check if the target agency has enough resources
    const resources = await Resources.findById(targetAgency.resources._id);

    for (let i = 0; i < resource.name.length; i++) {
      const requestedResource = resource.name[i];

      // Find the index of the requested resource in the resources array
      const resourceIndex = resources.name.findIndex(
        (name) => name === requestedResource
      );

      if (resourceIndex !== -1) {
        // Check if the quantity is sufficient
        if (resources.quantity[resourceIndex] < resource.quantity[i]) {
          return res.status(400).json({
            success: false,
            message: "Resources needed are not in sufficient quantity",
          });
        }
      }
    }

    // Create a new request document
    const newRequest = new Request({
      lat,
      lng,
      to: targetAgency._id, // Set the target agency
      from: requestingAgency._id, // Set the requesting agency
      resource,
      status: "Pending", // Set the status to 'Pending' by default
    });

    // Save the new request
    await newRequest.save();

    return res.status(200).json({
      success: true,
      message: "Request sent successfully",
      newRequest: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};



exports.allRequestsSend = async (req, res) => {
  try {
    const { agencyId } = req.body;

    // Find the requesting agency
    const requestingAgency = await Agency.findById(agencyId);
    if (!requestingAgency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    const allRequests = await Request.find({ from: agencyId })
      .populate("to")
      .populate("from")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All requests received Successfully",
      allRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in allRequestSend",
    });
  }
}