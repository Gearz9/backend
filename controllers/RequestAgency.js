const Request = require('../models/RequestSchema');
const Agency = require('../models/AgencySchema');

exports.sendRequestToAgency = async (req, res) => {
  try {
    const { selectedAgencyId, userId, lat, lng, resource, status } = req.body;

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

    // Check if the target agency has enough resources
    const hasEnoughResources = resource.every(requestedResource => {
      const availableResource = targetAgency.resources.find(
        resource => resource.name === requestedResource.name
      );
      return (
        availableResource &&
        availableResource.quantity >= requestedResource.quantity
      );
    });

    if (!hasEnoughResources) {
      return res.status(400).json({
        success: false,
        message: 'Not enough resources available for the request',
      });
    }

    // Update the target agency's resources
    resource.forEach(requestedResource => {
      const resourceIndex = targetAgency.resources.findIndex(
        resource => resource.name === requestedResource.name
      );
      if (resourceIndex !== -1) {
        targetAgency.resources[resourceIndex].quantity -= requestedResource.quantity;
      }
    });

    // Save the updated target agency document
    await targetAgency.save();

    // Create a new request document
    const newRequest = new Request({
      lat,
      lng,
      to: targetAgency._id, // Set the target agency
      from: requestingAgency._id, // Set the requesting agency
      resource,
      status,
    });

    // Check if the status is 'Accepted' and update the requesting agency's status
    if (status === 'Accepted') {
      requestingAgency.status = 'Accepted';
      await requestingAgency.save();
    }

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
