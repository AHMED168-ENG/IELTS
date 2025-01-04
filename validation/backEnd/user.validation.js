const { check } = require("express-validator");
const { Op } = require("sequelize");
const User = require("../../models/users");

const EditUserValidation = () => {
  return [
    check("name").notEmpty().withMessage("يجب ادخال الاسم الخاص بك"),
    check("age").notEmpty().withMessage("يجب ادخال العمر الخاص بك"),
    check("email")
      .notEmpty()
      .withMessage("ادخل الايميل")
      .isEmail()
      .withMessage("ادخل الايميل صحيح")
      .custom(async (value, { req }) => {
        var user = await User.findOne({
          where: {
            email: value,
            id: {
              [Op.ne]: req.params.id,
            },
          },
        });
        if (user) {
          throw new Error();
        }
        return true;
      })
      .withMessage("هذا الايميل موجود بالفعل"),
    check("image")
      .custom(async (value, { req }) => {
        if (!req.files.length) return true;
        req.files.forEach((element) => {
          var arrayExtention = ["jpg", "png", "jpeg", "gif", "svg"];
          var originalname = element.originalname.split(".");
          var imgExtension =
            originalname[originalname.length - 1].toLowerCase();
          if (!arrayExtention.includes(imgExtension)) {
            throw new Error("");
          }
        });
      })
      .withMessage(`The image extension must be jpg, jpeg, png, gif, svg`)
      .custom(async (value, { req }) => {
        if (!req.files.length) return true;
        req.files.forEach((element) => {
          if (element.size > 2000000) {
            throw new Error("");
          }
        });
      })
      .withMessage("The image must not be more than 200000 kb"),
  ];
};

module.exports = {
  EditUserValidation,
};
