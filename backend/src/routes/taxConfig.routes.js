const express = require("express");
const {
  createTaxConfig,
  getTaxConfig,
} = require("../controllers/taxConfig.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes protected and tenant-scoped automatically
router.use(protect); // Requires login

// Optional: restrict to admin only
// router.use(authorize('admin'));

router.route("/").post(createTaxConfig).get(getTaxConfig);

module.exports = router;
