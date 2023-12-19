const mongoose = require("mongoose");

const ResourcesSchema = {
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
};

module.exports = mongoose.model("Resources", ResourcesSchema);
