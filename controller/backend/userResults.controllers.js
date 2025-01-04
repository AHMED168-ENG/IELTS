const { tryError, returnWithMessage } = require("../../Helper/helper");
const UsersResult = require("../../models/usersresult");

const showAllUserResult = async (req, res, next) => {
  try {
    const AllUserResult = await UsersResult.find({ success: null })
      .populate({
        path: 'userId', // مرجع إلى users
        model: 'User',
        as: 'ResultUser',
      })
      .populate({
        path: 'test', // مرجع إلى Testing
        model: 'Testing',
        as: 'ResultTesting',
        populate: {
          path: 'disability', // مرجع إلى disability داخل Testing
          model: 'Disability',
          as: 'TestingDisability',
        },
      });


    res.render("backEnd/userResults/showAll", {
      title: "all User result",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      AllUserResult,
      validationError: req.flash("validationError")[0],
    });
  } catch (error) {
    tryError(res, error);
  }
};

const correctResultPage = async (req, res, next) => {
  try {
    const UserResult = await UsersResult.findOne({ _id: req.params.id })
      .populate({
        path: 'userId', // مرجع إلى users
        model: 'User',
        as: 'ResultUser',
      })
      .populate({
        path: 'test', // مرجع إلى Testing
        model: 'Testing',
        as: 'ResultTesting',
        populate: {
          path: 'disability', // مرجع إلى disability داخل Testing
          model: 'Disability',
          as: 'TestingDisability',
        },
      });

    res.render("backEnd/userResults/correctResult", {
      title: "correct Result",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      UserResult,
      validationError: req.flash("validationError")[0],
      correctResultPage,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const resultOfExam = async (req, res, next) => {
  try {
    await UsersResult.findByIdAndUpdate(
      req.params.id,
      { success: req.query.result === "success" ? true : false },
      { new: true }
    );

    returnWithMessage(
      req,
      res,
      "/dashboard/showAllUserResult",
      "تم ارسال الاجابه بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  showAllUserResult,
  correctResultPage,
  resultOfExam,
};
