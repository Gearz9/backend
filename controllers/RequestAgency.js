const Request = require('../models/RequestSchema');
const Agency = require('../models/AgencySchema');

exports.sendRequestToAgency = async (req, res) => {
  try {
    const { selectedAgencyId, userId, lat, lng, resource ,status/*, other data */ } = req.body;

    // Find the requesting agency
    const requestingAgency = await Agency.findById(userId);
    if (!requestingAgency) {
      return res.status(404).json({
        success: false,
        message: 'Requesting agency not found',
      });
    }

    // Find the target agency
    const targetAgency = await Agency.findById(selectedAgencyId);
    if (!targetAgency) {
      return res.status(404).json({
        success: false,
        message: 'Target agency not found',
      });
    }

    // Create a new request document
    const newRequest = new Request({
      lat,
      lng,
      to: targetAgency._id, // Set the target agency
      from: requestingAgency._id, // Set the requesting agency
      resource,
      status
      // Add other relevant data to the request document
    });

    await newRequest.save();

    return res.status(200).json({
      success: true,
      message: 'Request sent successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
