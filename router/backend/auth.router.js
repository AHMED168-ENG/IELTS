const {
  signInAdmin,
  signInPage,
  signOutAdmin,
} = require("../../controller/backend/auth/signInUser.controller");
const {
  dashboard_page_controller,
} = require("../../controller/backend/dashpored");

const {
  isNotAuthonticate,
} = require("../../middel_ware/backEnd/ifNotAuthonticate");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const {
  authAdminValidation,
} = require("../../validation/backEnd/auth.validation");

const router = require("express").Router();

router.get("/signIn", isNotAuthonticate, signInPage);
router.post("/signIn", isNotAuthonticate, authAdminValidation(), signInAdmin);
router.get("/signOutAdmin", isAuthonticate, signOutAdmin);

module.exports = {
  authAdmin: router,
};
