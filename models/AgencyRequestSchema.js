const mongoose = require('mongoose');

const rescueRequestSchema = new mongoose.Schema({
  senderAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAgency',
    required: true,
  },
  receiverAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAgency',
    required: true,
  },
  requestDetails: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  // Add any other fields you need for the rescue request
}, {
  timestamps: true,
});

module.exports = mongoose.model('AgencyRequest', rescueRequestSchema);