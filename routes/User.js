const express = require("express")
const router = express.Router()


const { sendOTP,register,login } = require('../controllers/Auth');

router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);

module.exports = router;