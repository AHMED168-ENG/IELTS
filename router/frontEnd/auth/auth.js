const {
  userNotAuthonticat,
} = require("../../../middel_ware/frontEnd/usernotAuthonticat");
const {
  signInUser,
  signUpUser,
  signInUserPost,
  signUpUserPost,
  activeUserPage,
  signOutUser,
} = require("../../../controller/frontEnd/auth/auth");
const { uploade_img } = require("../../../Helper/helper");
const {
  signUpUserValidation,
} = require("../../../validation/frontEnd/authUser");
const {
  authAdminValidation,
} = require("../../../validation/backEnd/auth.validation");
const {
  userAuthonticat,
} = require("../../../middel_ware/frontEnd/userAuthonticate");

const router = require("express").Router();

router.get("/signIn", userNotAuthonticat, signInUser);
router.post(
  "/signIn",
  userNotAuthonticat,
  authAdminValidation(),
  signInUserPost
);

router.get("/signUp", userNotAuthonticat, signUpUser);
router.post(
  "/signUp",
  userNotAuthonticat,
  uploade_img("public/backEnd/assets/img/users", "image"),
  signUpUserValidation(),
  signUpUserPost
);
router.get("/activeUserPage/:id", userNotAuthonticat, activeUserPage);
router.get("/signOutUser", userAuthonticat, signOutUser);

module.exports = {
  authUserRoutes: router,
};
