const express = require("express");
const router = express.Router();

const { sendOTP, register, login, verify } = require("../controllers/Auth");
const { getNearby } = require("../controllers/Nearby");
// const {sendRequestToAgency} = require('../controllers/RequestAgency');
const {
  addResource,
  updateResource,
  deleteResource,
} = require("../controllers/AddUpdateDeleteResource");
const { getAllAgencies } = require("../controllers/testing");
const {
  receiverAction,
  receiverPendingRequests,
  allRequests,
} = require("../controllers/ReceiverAction");
const { allRequestsSend, sendRequestToAgency } = require("../controllers/SendersAction");

router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/get-nearby", getNearby);
router.post("/verifyOtp", verify);

router.post("/all-requests-send", allRequestsSend);
router.post("/send-request", sendRequestToAgency);

// router.post('/sender-Action', senderAction);
router.post("/receiver-pending-requests", receiverPendingRequests);
router.post("/receiver-action", receiverAction);
router.post("/receiver-all-requests", allRequests);
router.post("/delete-resource", deleteResource);
router.post("/add-resource", addResource);
router.post("/update-resource", updateResource);
router.get("/testing/getAllAgencies", getAllAgencies);

module.exports = router;
