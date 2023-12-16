const express = require("express")
const router = express.Router()


const { sendOTP,register,login,verify } = require('../controllers/Auth');
const { getNearby } = require('../controllers/Nearby');
const {sendRequestToAgency} = require('../controllers/RequestAgency');
const {addResource} = require('../controllers/ResourceAdd');

router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/get-nearby", getNearby);
router.post('/verifyOtp', verify);
router.post('/send-request', sendRequestToAgency);
router.post('/add-resource', addResource);

module.exports = router;