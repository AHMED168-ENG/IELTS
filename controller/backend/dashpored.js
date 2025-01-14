const { tryError } = require("../../Helper/helper");
const User = require("../../models/users");
const Testing = require("../../models/testing");
const Section = require("../../models/sections");

const dashboard_page_controller = async (req, res, next) => {
    try {
        var users = await User.find({});
        var testing = await Testing.find({});
        var training = await Section.find({});

        res.render("backEnd/dashboard", {
            title: "dashboard",
            URL: req.url,
            users,
            Testing: testing,
            training,
            notification: req.flash("notification")[0],
            admin: req.cookies.User,
        });
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    dashboard_page_controller,
};
