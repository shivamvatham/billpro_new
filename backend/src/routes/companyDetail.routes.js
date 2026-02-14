const express = require("express");
const {
  createCompanyDetail,
  getCompanyDetail,
  updateLogo,
  getCompanyLogo,
  removeCompanyLogo,
} = require("../controllers/companyDetail.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.route("/").post(createCompanyDetail).get(getCompanyDetail);
router
  .post("/logo", upload.single("logo"), updateLogo)
  .get("/logo", getCompanyLogo)
  .delete("/logo", removeCompanyLogo);

module.exports = router;
