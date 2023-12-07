const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
  },
  resource: {
    name: [{
      type: String,
      required: true,
      trim: true,
    }],
    quantity:[ {
      type: Number,
      required: true,
      min: 0,
    }],
  },

});

