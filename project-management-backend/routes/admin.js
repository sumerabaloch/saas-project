const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  dashboardStats,
  getAllUsers,
  assignUserRole,
  assignTask
} = require("../controllers/adminController");

// protect all admin routes
router.use(protect, adminOnly);

// existing routes
router.get("/stats", dashboardStats);
router.get("/users", getAllUsers);

// assign role
router.put("/assign-role", assignUserRole);

// assign task
router.post("/assign-task", assignTask);

module.exports = router;