const { check } = require("express-validator");

const SectionValidation = () => {
    return [
        check("section").notEmpty().withMessage("ادخل القسم "),
        // check("startTime").notEmpty().withMessage("ادخل بدايه الوقت الاعاقه"),
        check("duration").notEmpty().withMessage("ادخل عدد دقائق السكشن"),
    ];
};

module.exports = {
    SectionValidation,
};
