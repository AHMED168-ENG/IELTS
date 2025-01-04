const {
  showAllUserResult,
  correctResultPage,
  resultOfExam,
} = require("../../controller/backend/userResults.controllers");

const router = require("express").Router();
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
router.get("/showAllUserResult", isAuthonticate, showAllUserResult);
router.get("/correctResultPage/:id", isAuthonticate, correctResultPage);
router.get("/resultOfExam/:id", isAuthonticate, resultOfExam);

module.exports = {
  allUserResult: router,
};
