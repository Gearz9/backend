const express = require("express")
const router = express.Router()


const { sendOTP,register } = require('../controllers/Auth');

router.post("/sendOtp", sendOTP);
router.post("/register", register);

module.exports = router;