const Request = require("../models/RequestSchema");
const Agency = require("../models/AgencySchema");
const Resources = require("../models/ResourcesSchema");

// Get pending requests for a specific agency
exports.receiverPendingRequests = async (req, res) => {
  try {
    const { agencyID } = req.body;
    console.log("Agency ID : ", agencyID);
    if (!agencyID) {
      return res
        .status(400)
        .json({ message: "Agency ID is required in the request body" });
    }

    const requests = await Request.find({ to: agencyID, status: "Pending" })
      .populate("to")
      .populate("from")
      .exec();

    if (!requests || requests.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending requests found for the given agencyID" });
    }

    return res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

////////////////////////////////////////////////////////////////

// Accept or reject a request and update resources accordingly
exports.receiverAction = async (req, res) => {
  try {
    const { request_id, action } = req.body;

    const request = await Request.findById(request_id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Identify the receiving agency
    const receiver_id = request.to;

    // get the resources id of the receiving agency
    const receiver_resources_id = (await Agency.findById(receiver_id))
      ?.resources._id;

    // finding the resources object in the db
    const resources = await Resources.findById(receiver_resources_id);

    console.log("Resources Object : ", resources);
    // Taking next step as per actions
    if (action === "Accepted") {
      for (let i = 0; i < request.resource.name.length; i++) {
        const requestedResource = request.resource.name[i];
        const resourceIndex = resources.name.findIndex(
          (name) => name === requestedResource
        );
        if (resourceIndex !== -1) {
          if (
            resources.quantity[resourceIndex] >= request.resource.quantity[i]
          ) {
            resources.quantity[resourceIndex] -= request.resource.quantity[i];
          } else {
            // Handling insufficient quantity

            return res.status(400).json({
              success: false,
              message: "Resources Needed are not in sufficient Qunatity",
            });
          }
        }
      }

      // Update the request status to "Accepted"
      request.status = "Accepted";
    } else if (action === "Completed") {
      for (let i = 0; i < request.resource.name.length; i++) {
        const completedResource = request.resource.name[i];

        const resourceIndex = resources.name.findIndex(
          (name) => name === completedResource
        );

        if (resourceIndex !== -1) {
          resources.quantity[resourceIndex] += request.resource.quantity[i];
        }
      }

      // Update the request status to "Accepted"
      request.status = "Completed";
    } else {
      // Handle other actions if needed
      // For now, assuming that any action other than "Accepted" is considered as rejection
      request.status = "Rejected";
    }

    // updating the request status in the DB
    await Request.findByIdAndUpdate(request_id, request);
    // Update the Resources availability of the receiver Agency in the DB

    await Resources.findByIdAndUpdate(receiver_resources_id, resources);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// reciever all requests history
exports.allRequests = async (req, res) => {
  try {
    const { agencyID } = req.body;

    // Use populate to get detailed information about the requesting agency and resources
    try {
      const allRequests = await Request.find({ to: agencyID })
        .populate("to")
        .populate("from")
        .exec();
      res.status(200).json({
        success: true,
        allRequests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(200).json({ success: true, allRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//
