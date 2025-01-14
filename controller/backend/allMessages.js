const e = require("connect-flash");
const { tryError, returnWithMessage } = require("../../Helper/helper");
const { sendEmail } = require("../../emails/sendEmails");

const AllMessageController = async (req, res, next) => {
  try {
    const Message = await ContactUsModel.find()
      .populate({
        path: 'userId', // مرجع إلى users
        model: 'User',
        as: 'contactUsUser',
      });

    res.render("backEnd/Message/showAll", {
      title: "All Message",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.User,
      Message: Message,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const responsMessage = async (req, res, next) => {
  try {
    const message = await ContactUsModel.findById(req.params.id)
      .populate({
        path: 'userId', // مرجع إلى users
        model: 'User',
        as: 'contactUsUser',
      });


    res.render("backEnd/Message/responsMessage", {
      title: "All Message",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.User,
      message,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const responsMessagePost = async (req, res, next) => {
  try {
    sendEmail(
      req.body.email,
      null,
      req.body.name,
      `سؤالك هو (${req.body.userMessage}) والاجابه هي : ` + req.body.message,
      null
    );
    returnWithMessage(
      req,
      res,
      "/dashboard/responsMessage/" + req.params.id,
      `تم الرد علي ${req.body.name} بنجاح`,
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
const deleteMessage = async (req, res, next) => {
  try {
    await ContactUsModel.findByIdAndDelete(req.params.id);

    returnWithMessage(
      req,
      res,
      "/dashboard/AllMessage",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  AllMessageController,
  deleteMessage,
  responsMessage,
  responsMessagePost,
};
