const mongoose = require("mongoose");

// This schema stores all the  requests from the Rescue Agencies
const RequestSchema = new mongoose.Schema(
  {
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },

    // Agecny getting requests
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },

    // Requesting Agency
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },

    resource: {
      name: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],
      quantity: [
        {
          type: Number,
          required: true,
          min: 0,
        },
      ],
    },

    // Status of the Requests
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Requests", RequestSchema);