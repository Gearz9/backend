const mongoose = require("mongoose");

const agencySchema = {
  // Email address for the Agency
   name:{
    type:String,
    required:true
   },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: true,
  },
  agencyType:{
    type: String,
    enum :[ 'Fire-Brigade', 'Hospital', 'Police', 'CRPF', 'NDRF', 'SRPF' , 'Army'],
    required: true,
  }
  ,
  resources:{
    type: mongoose.Schema.Types.ObjectId,
    ref :'Resources',
  }
};

module.exports = mongoose.model("Agency", agencySchema);
