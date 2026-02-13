const express = require("express");
const {
  createCompanyDetail,
  getCompanyDetail,
  updateLogo,
} = require("../controllers/companyDetail.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.route("/").post(createCompanyDetail).get(getCompanyDetail);
router.post("/logo", upload.single("logo"), updateLogo);

module.exports = router;
