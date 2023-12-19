const express = require("express");
const router = express.Router();
const Agency = require("../models/AgencySchema");
const Resources = require("../models/ResourcesSchema");
const { default: mongoose } = require("mongoose");

exports.addResource = async (req, res) => {
  try {
    const { agencyId, resourceName, resourceQuantity } = req.body;
    const agencyData = await Agency.findById(agencyId);

    if (!agencyData) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    // Check if the agency has a resources document, create one if not
    let resourcesData = agencyData.resources;

    if (!resourcesData) {
      resourcesData = new Resources();
      console.log(resourcesData);
      agencyData.resources = resourcesData._id;
      await Agency.findByIdAndUpdate(agencyId, agencyData);
    }

    console.log("resourceData", resourcesData);

    // finding resources object id

    let resourcesObjectId = agencyData.resources._id || resourcesData._id;
    let resourcesObject = await Resources.findById(resourcesObjectId);

    for (let i = 0; i < resourcesObject.name.length; i++) {
      if (resourcesObject.name[i] === resourceName) {
        return res.status(400).json({
          success: false,
          message:
            "Resource already exists for this agency. Go for Updating Reourses Quantity Please",
        });
      }
    }

    // Push the new resource into the array
    resourcesObject.name.push(resourceName);
    resourcesObject.quantity.push(resourceQuantity);

    // Save the updated resources data
    await Resources.findByIdAndUpdate(resourcesObjectId, resourcesObject);

    return res.status(201).json({
      success: true,
      message: "Resource added to the agency successfully",
      resource: resourcesData,
    });
  } catch (error) {
    console.error("Error adding resource to the agency:", error);

    if (error.name === "ValidationError") {
      // Handle validation errors
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    } else {
      // Handle other errors
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { agencyId, resourceName, resourceQuantity } = req.body;
    const agencyData = await Agency.findById(agencyId);

    if (!agencyData) {
      return res.status(404).json({
        success: false,
        message: "Agency not found",
      });
    }

    let resourcesObjectId = agencyData.resources._id;
    let resourcesObject = await Resources.findById(resourcesObjectId);

    // finding resources object id and updating it

    for (let i = 0; i < resourcesObject.name.length; i++) {
      if (resourcesObject.name[i] === resourceName) {
        resourcesObject.quantity[i] += resourceQuantity;

        break;
      }
    }

    await Resources.findByIdAndUpdate(resourcesObjectId, resourcesObject);

    return res.status(201).json({
      success: true,
      message: "Updated Resources  of the agency successfully",
    });
  } catch (error) {
    console.error("Error UPDATING a resource of the agency:", error);

    if (error.name === "ValidationError") {
      // Handle validation errors
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    } else {
      // Handle other errors
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};
