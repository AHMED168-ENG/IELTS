const {
  dashboard_page_controller,
} = require("../../controller/backend/dashpored");

const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");

const router = require("express").Router();

router.get("/dashboard", isAuthonticate, dashboard_page_controller);

module.exports = {
  dashpordRouter: router,
};
