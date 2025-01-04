const { check } = require("express-validator");

const changePasswordValidation = () => {
  return [
    check("password").notEmpty().withMessage("ادخل الرقم السري "),
    check("newPassword")
      .notEmpty()
      .withMessage("ادخل الرقم السري الجدبد")
      .custom((value, { req }) => {
        var count = 0;
        for (var x = 0; x < value.length; x++) {
          if (isNaN(value[x])) {
            count++;
          }
        }
        if (count < 5) {
          throw new Error("");
        }
        return true;
      })
      .withMessage("يجب ان يحتوي الرقم السري علي 5 احرف علي الاقل"),
    check("confirmPassword")
      .notEmpty()
      .withMessage("ادخل الرقم السري الجديد ملره اخري")
      .custom((value, { req }) => {
        if (req.body.newPassword != req.body.confirmPassword) {
          throw new Error("");
        }
        return true;
      })
      .withMessage("يجب التاكد من انا الرقم السري متطابق مع الرقم السري الاول"),
  ];
};

module.exports = {
  changePasswordValidation,
};
