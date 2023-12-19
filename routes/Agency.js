const express = require("express")
const router = express.Router()


const { sendOTP,register,login,verify } = require('../controllers/Auth');
const { getNearby } = require('../controllers/Nearby');
// const {sendRequestToAgency} = require('../controllers/RequestAgency');
const {addResource} = require('../controllers/AddResource');
const {getAllAgencies} = require('../controllers/testing');
const { receiverAction, receiverPendingRequests } = require("../controllers/ReceiverAction");

router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/get-nearby", getNearby);
router.post('/verifyOtp', verify);
// router.post('/send-request', sendRequestToAgency);
router.post('/receiver-pending-requests', receiverPendingRequests)
router.post('/receiver-action', receiverAction)
router.post('/add-resource', addResource);
router.get('/testing/getAllAgencies',getAllAgencies);


module.exports = router;