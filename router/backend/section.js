const {
  AllSectionController,
  EditSectionController,
  activeSection,
  deleteSection,
  EditSectionControllerPost,
  addSectionController,
  addSectionControllerPost,
} = require("../../controller/backend/section");
const { uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");

const { SectionValidation } = require("../../validation/backEnd/Section");
const {
  EditUserValidation,
} = require("../../validation/backEnd/user.validation");

const router = require("express").Router();

router.get("/AllSection", isAuthonticate, AllSectionController);
router.get("/addSection", isAuthonticate, addSectionController);
router.post(
  "/addSection",
  isAuthonticate,
  SectionValidation(),
  addSectionControllerPost
);
router.get("/EditSection/:id", isAuthonticate, EditSectionController);
router.post(
  "/EditSection/:id",
  isAuthonticate,
  SectionValidation(),
  EditSectionControllerPost
);
router.get("/activeSection/:id", isAuthonticate, activeSection);
router.post("/deleteSection/:id", isAuthonticate, deleteSection);

module.exports = {
  SectionRouter: router,
};
