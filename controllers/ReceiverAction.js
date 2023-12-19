const Request = require("../models/RequestSchema");
const Agency = require("../models/AgencySchema");
const Resources = require("../models/ResourcesSchema");

////////////////////////////////////////////////////////////////

// Below code is for gettin pending requests for the agency

// it cand be also be done by just using "      agency_id && status = "pending"        "

// Get pending requests for a specific agency
exports.receiverPendingRequests = async (req, res) => {
  try {
    const { agencyID } = req.body;

    const requests = await Request.find({ to: agencyID, status: "Pending" });

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

    const receiver_id = request.to;
    const receiver_resources_id = (await Agency.findById(receiver_id))
      ?.resources;
    const resources = await Resources.findById(receiver_resources_id);

    if (action === "Accepted") {
      for (let i = 0; i < request.resource.length; i++) {
        const requestedResource = request.resource[i];

        const resourceIndex = resources.name.findIndex(
          (name) => name === requestedResource.name
        );

        if (resourceIndex !== -1) {
          if (resources.quantity[resourceIndex] >= requestedResource.quantity) {
            resources.quantity[resourceIndex] -= requestedResource.quantity;
          } else {
            // Handle insufficient quantity, if needed
            // TO BE DISCUSSED AND DONE
          }
        }
      }

      // Update the request status to "Accepted"
      request.status = "Accepted";
      await request.save();

      // Update the Resources availability of the receiver Agency
      await Resources.findByIdAndUpdate(receiver_resources_id, resources);
    } else if (action === "Completed") {
      for (let i = 0; i < request.resource.length; i++) {
        const requestedResource = request.resource[i];

        const resourceIndex = resources.name.findIndex(
          (name) => name === requestedResource.name
        );

        if (resourceIndex !== -1) {
          resources.quantity[resourceIndex] += requestedResource.quantity;
        }
      }

      // Update the request status to "Accepted"
      request.status = "Completed";
      await request.save();
    } else {
      // Handle other actions if needed
      // For now, assuming that any action other than "Accepted" is considered as rejection
      request.status = "Rejected";
      await request.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
