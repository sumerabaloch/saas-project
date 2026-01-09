const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { getActivities } = require("../controllers/activityController");

router.get("/", protect, getActivities);

module.exports = router;