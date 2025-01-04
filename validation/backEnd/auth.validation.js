const { check } = require("express-validator");

const authAdmin = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage("يجب ادخال الايميل الخاص بك")
      .isEmail()
      .withMessage("هذا الحقل يستقبل ايميل فقط"),
    check("password").notEmpty().withMessage("يجب ادخال الرقم السري الخاص بك"),
  ];
};

module.exports = {
  authAdminValidation: authAdmin,
};
