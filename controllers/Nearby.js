
const Agency = require("../models/AgencySchema");

exports.getNearby = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const nearby = await Agency.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance",
          maxDistance: 100000000000000, // Maximum distance in meters
          spherical: true,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Nearby Agencies",
      nearby,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
