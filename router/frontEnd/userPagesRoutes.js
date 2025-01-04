const {
  homePage,
  userProfile,
  changePassword,
  ourService,
  EditPersonalInformation,
  EditPersonalInformationPost,
  allTesting,
  resultPage,
  contactUs,
  contactUsPost,
  enterExam,
  sendResult,
  ExamVoice,
} = require("../../controller/frontEnd/userPages.controller");
const { signUpUserValidation } = require("../../validation/frontEnd/authUser");
const {
  userAuthonticat,
} = require("../../middel_ware/frontEnd/userAuthonticate");
const {
  changePasswordValidation,
} = require("../../validation/frontEnd/changePassword");
const { uploade_img } = require("../../Helper/helper");
const multer = require("multer");
const { userAuthenticateApi } = require("../../middel_ware/frontEnd/userAuthonticateApi");

const router = require("express").Router();

router.get("/", homePage);
router.get("/userProfile", userAuthonticat, userProfile);
router.post(
  "/changePassword",
  userAuthonticat,
  changePasswordValidation(),
  changePassword
);
router.get("/ourService", ourService);
router.get("/ExamVoice", userAuthonticat, ExamVoice);
router.get(
  "/editPersonalInformation",
  userAuthonticat,
  EditPersonalInformation
);
router.post(
  "/editPersonalInformation",
  userAuthonticat,
  uploade_img("public/backEnd/assets/img/users", "image"),
  signUpUserValidation(),
  EditPersonalInformationPost
);
router.get("/allTesting", userAuthonticat, allTesting);
router.get("/enterExam/:id", userAuthonticat, enterExam);
router.post(
  "/sendResult/:examId",
  userAuthenticateApi,
  sendResult
);
router.get("/resultPage", userAuthonticat, resultPage);
router.get("/contactUs", userAuthonticat, contactUs);
router.post("/contactUs", userAuthonticat, contactUsPost);

module.exports = {
  userRoutes: router,
};
