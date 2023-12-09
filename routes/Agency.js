const express = require("express")
const router = express.Router()


const { sendOTP,register,login,verify } = require('../controllers/Auth');
const { getNearby } = require('../controllers/Nearby');
const {sendRequestToAgency} = require('../controllers/RequestAgency');


router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/get-nearby", getNearby);
router.post('/verifyOtp', verify);
router.post('/send-request', sendRequestToAgency);

module.exports = router;