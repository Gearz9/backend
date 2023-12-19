const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  address: {
    type: String,
    required: true
  },
  agencyType: {
    type: String,
    enum: ['Fire-Brigade', 'Hospital', 'Police', 'CRPF', 'NDRF', 'SRPF', 'Army'],
    required: true
  },
    resources: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resources',
    }
  ,
  contactNumber: {
    type: Number,
    required: true,
  },
});

// Add the 2dsphere index to the location field
agencySchema.index({ location: "2dsphere" });

const Agency = mongoose.model("Agency", agencySchema);

Agency.on('index', (error) => {
  if (error) {
    console.error('Error creating index:', error);
  } else {
    console.log('Index created successfully');
  }
});

module.exports = Agency;