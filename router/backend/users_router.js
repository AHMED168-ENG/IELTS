const {
  AllUsersController,
  EditUsersController,
  EditUsersControllerPost,
  activeUser,
  deleteUser,
} = require("../../controller/backend/users.controller");
const { uploade_img } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const {
  EditUserValidation,
} = require("../../validation/backEnd/user.validation");

const router = require("express").Router();

router.get("/allUsers", isAuthonticate, AllUsersController);
router.get("/EditUsers/:id", isAuthonticate, EditUsersController);
router.post(
  "/EditUsers/:id",
  isAuthonticate,
  uploade_img("public/backEnd/assets/img/users", "image"),
  EditUserValidation(),
  EditUsersControllerPost
);
router.get("/activeUser/:id", isAuthonticate, activeUser);
router.post("/deleteUser/:id", isAuthonticate, deleteUser);

module.exports = {
  usersRouter: router,
};
