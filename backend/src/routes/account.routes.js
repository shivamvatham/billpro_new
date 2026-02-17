const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router
  .route("/")
  .post(accountController.createAccount)
  .get(accountController.getAccounts);

router
  .route("/:id")
  .get(accountController.getAccount)
  .put(accountController.updateAccount)
  .delete(accountController.deleteAccount);

module.exports = router;
