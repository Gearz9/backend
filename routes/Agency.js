const express = require("express")
const router = express.Router()


const { sendOTP,register,login } = require('../controllers/Auth');
const { getNearby } = require('../controllers/Nearby');

router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/get-nearby", getNearby);

module.exports = router;