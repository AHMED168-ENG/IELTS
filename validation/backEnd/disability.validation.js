const { check } = require("express-validator");

const disabilityValidation = () => {
  return [
    check("description").notEmpty().withMessage("ادخل وصف الاعاقه"),
    check("name").notEmpty().withMessage("ادخل اسم الاعاقه"),
    check("image")
      .custom(async (value, { req }) => {
        if (!req.files.length && req.url == "/addDisability") {
          throw new Error("");
        }
        return true;
      })
      .withMessage("ادخل الصوره الخاصه بالاعاقه")
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
  disabilityValidation,
};
