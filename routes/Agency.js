const express = require("express")
const router = express.Router()


const { sendOTP,register,login,verify } = require('../controllers/Auth');
const { getNearby } = require('../controllers/Nearby');
const {sendRequestToAgency} = require('../controllers/SendersAction');
const {addResource} = require('../controllers/ResourceAdd');
const {getAllAgencies} = require('../controllers/testing');

router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/get-nearby", getNearby);
router.post('/verifyOtp', verify);
router.post('/senders-action', sendRequestToAgency);
router.post('/add-resource', addResource);
router.get('/testing/getAllAgencies',getAllAgencies);


module.exports = router;