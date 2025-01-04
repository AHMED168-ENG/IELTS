const { check } = require("express-validator");

const GideValidation = () => {
    return [
        check("title").notEmpty().withMessage("ادخل لمحه عن الارشاد"),
        check("disability").notEmpty().withMessage("ادخل اسم الاعاقه"),
        check("otherDisabilities")
            .custom(async (value, { req }) => {
                if (!value && req.body.isOther) {
                    throw new Error();
                }
                return true;
            })
            .withMessage("يجب ادخال الاعاقات المشترك فيها هذا الكتاب"),
        check("isOther")
            .custom(async (value, { req }) => {
                if (!value && req.body.otherDisabilities != "") {
                    throw new Error();
                }
                return true;
            })
            .withMessage("يجب تفعيل هذا الاختيار"),
        check("image")
            .custom(async (value, { req }) => {
                if (
                    !req.files.image &&
                    (req.url == "/addGide" || req.url == "/addSound")
                ) {
                    throw new Error("");
                }
                return true;
            })
            .withMessage("يجب ادخال صوره معبره عن الارشاد")
            .custom(async (value, { req }) => {
                if (!req.files.image) return true;
                req.files.image.forEach((element) => {
                    var arrayExtention = ["jpg", "png", "jpeg", "gif", "svg"];
                    var originalname = element.originalname.split(".");
                    var imgExtension =
                        originalname[originalname.length - 1].toLowerCase();
                    if (!arrayExtention.includes(imgExtension)) {
                        throw new Error("");
                    }
                });
            })
            .withMessage(
                `يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`
            )
            .custom(async (value, { req }) => {
                if (!req.files.image) return true;
                req.files.image.forEach((element) => {
                    if (element.size > 2000000) {
                        throw new Error("");
                    }
                });
            })
            .withMessage("الصوره يجب الا تزيد عن 2000000 kb"),
        check("pdf")
            .custom(async (value, { req }) => {
                if (
                    !req.files.pdf &&
                    (req.url == "/addGide" || req.url == "/addSound")
                ) {
                    throw new Error("");
                }
                return true;
            })
            .withMessage("يجب ادخال ملف pdf")
            .custom(async (value, { req }) => {
                if (!req.files.pdf) return true;
                req.files.pdf.forEach((element) => {
                    var arrayExtention = ["pdf"];
                    var originalname = element.originalname.split(".");
                    var imgExtension =
                        originalname[originalname.length - 1].toLowerCase();
                    if (!arrayExtention.includes(imgExtension)) {
                        throw new Error("");
                    }
                });
            })
            .withMessage(`يجب ان يكون امتداد الملف pdf`),
    ];
};

module.exports = {
    GideValidation,
};
