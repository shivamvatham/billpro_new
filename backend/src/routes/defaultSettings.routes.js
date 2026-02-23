const express = require("express");
const router = express.Router();
const defaultSettingsController = require("../controllers/defaultSettings.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/", defaultSettingsController.getDefaults);
router.put("/", defaultSettingsController.updateDefaults);

module.exports = router;
