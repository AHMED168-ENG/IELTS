const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const {
    tryError,
    returnWithMessage,
    handel_validation_errors,
} = require("../../../Helper/helper");
const UserModel = require("../../../models/users");

const signInPage = async (req, res, next) => {
    try {
        res.render("backEnd/auth/signInAdmin", {
            title: "signInAdmin",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
        });
    } catch (error) {
        tryError(res);
    }
};

const signInAdmin = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(req, res, errors, "signIn");
            return;
        }
        const user = await UserModel.findOne({ email: req.body.email });

        if (user && user.isAdmin) {
            var compairPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (compairPassword) {
                var expire = !req.body.rememberMe ? { maxAge: 86400000 } : {};
                var message = req.body.rememberMe
                    ? "تم تسجيل الدخول بنجاح"
                    : "تم تسجيل الدخول بنجاح " +
                    "سوف يتم تسجيل خروجك من الموقع بعد 24 ساعه من دخولك";
                res.cookie("Admin", user, expire);
                returnWithMessage(req, res, "/dashboard", message, "success");
            } else {
                returnWithMessage(
                    req,
                    res,
                    "/dashboard/signIn",
                    "الرقم السري اللذي ادخلته غير صحيح",
                    "danger"
                );
            }
        } else {
            returnWithMessage(
                req,
                res,
                "/dashboard/signIn",
                "الايميل اللذي ادخلته غير صحيحي",
                "danger"
            );
        }
    } catch (error) {
        tryError(res, error);
    }
};

/*-----------------------------------  ------------------------------*/
const signOutAdmin = async (req, res, next) => {
    try {
        res.clearCookie("User");
        res.redirect("/signin");
    } catch (error) { }
};
/*----------------------------------- start sign Out ------------------------------*/

module.exports = {
    signInAdmin,
    signInPage,
    signOutAdmin,
};
