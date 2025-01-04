const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
} = require("../../../Helper/helper");
const UserModel = require("../../../models/users");

const { sendEmail } = require("../../../emails/sendEmails");
const { Op } = require("sequelize");

const signInUser = async (req, res, next) => {
  try {
    res.render("frontEnd/auth/signIn", {
      title: "signIn User",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res);
  }
};
const signInUserPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    var userData = req.body;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "signIn");
      return;
    }
    const user = await UserModel.findOne({ email: userData.email });

    if (user) {
      var password = bcrypt.compareSync(userData.password, user.password);
      if (!password) {
        returnWithMessage(
          req,
          res,
          "signIn",
          "الرقم السري اللذي ادخلته خاطا",
          "danger"
        );
      } else {
        if (!user.active) {
          returnWithMessage(
            req,
            res,
            "signIn",
            "هذا الايميل موجود ولاكن يجب تفعيله لقد قمنا بارسال رساله علي الجميل الخاص بك",
            "danger"
          );
        } else {
          var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};
          var message = userData.rememberMe
            ? "You have successfully logged in."
            : "You have successfully logged in. " + "ولاكن سوف يتم تسجيل خروجك بعد 24 ساعه";
          res.cookie("User", user, expire);
          returnWithMessage(req, res, "/", message, "success");
        }
      }
    } else {
      returnWithMessage(
        req,
        res,
        "signIn",
        "هذا الايميل لا يمتلك اي حساب",
        "danger"
      );
    }
  } catch (error) {
    tryError(res);
  }
};

const signUpUser = async (req, res, next) => {
  try {

    res.render("frontEnd/auth/signUp", {
      title: "signUp User",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      user: req.cookies.User,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const signUpUserPost = async (req, res, next) => {
  try {
    var errors = await validationResult(req).errors;
    if (errors.length > 0) {
      console.log(errors)
      removeImg(req);
      handel_validation_errors(req, res, errors, "/signUp");
      return;
    }
    var file = Rename_uploade_img(req);
    var Password = bcrypt.hashSync(req.body.password, 10);
    req.body.password = Password;
    req.body.image = file;
    req.body.gender = req.body.gender == "1" ? true : false;
    req.body.isDoctor = false;
    req.body.isAdmin = false;
    req.body.active = false;

    await UserModel.create(req.body).then((result) => {
      // sendEmail(
      //   result.email,
      //   result.id,
      //   result.name,
      //   "يجب تفعيل الاكونت الخاص بك اولا",
      //   "activeUserPage"
      // );
    });
    returnWithMessage(
      req,
      res,
      "/signUp",
      "تم تسجيل بياناتك لقد قمنا بارسال رساله علي الجميل الخاص بك لتفعيل الحساب",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
}; /*----------------------------------- start active user page ------------------------------*/
const activeUserPage = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { active: true },
      { new: true }
    );
    returnWithMessage(
      req,
      res,
      "/signIn",
      "تم تفعيلك كمستخدم جديد قم بالتسجيل",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------------------- end active user page ------------------------------*/

/*-----------------------------------  ------------------------------*/
const signOutUser = async (req, res, next) => {
  try {
    res.clearCookie("User");
    res.redirect("/signIn");
  } catch (error) { }
};
/*----------------------------------- start sign Out ------------------------------*/

module.exports = {
  signInUser,
  signUpUser,
  signUpUserPost,
  signInUserPost,
  signOutUser,
  activeUserPage,
};
