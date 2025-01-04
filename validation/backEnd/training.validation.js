const { check } = require("express-validator");

const trainingValidation = () => {
    return [
        check("content").notEmpty().withMessage("ادخل محتوي التدريب"),
        check("title").notEmpty().withMessage("ادخل لمحه عن التدريب"),
        check("disability").notEmpty().withMessage("ادخل اسم الاعاقه"),
        check("otherDisabilities")
            .custom(async (value, { req }) => {
                if (!value && req.body.isOther) {
                    throw new Error();
                }
                return true;
            })
            .withMessage("يجب ادخال الاعاقات المشترك فيها هذا التدريب"),
        check("isOther")
            .custom(async (value, { req }) => {
                if (!value && req.body.otherDisabilities != "") {
                    throw new Error();
                }
                return true;
            })
            .withMessage("يجب تفعيل هذا التدريب"),

        check("image")
            .custom(async (value, { req }) => {
                if (!req.files.image && req.url == "/addTraining") {
                    throw new Error("");
                }
                return true;
            })
            .withMessage("يجب ادخال صوره معبره عن التدريب")
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
        check("video")
            .custom(async (value, { req }) => {
                if (!req.files.video) return true;
                req.files.video.forEach((element) => {
                    var arrayExtention = [
                        "dvd",
                        "avi",
                        "mkv",
                        "mv4",
                        "mp4",
                        "mp3",
                        "flv",
                        "wmv",
                    ];
                    var originalname = element.originalname.split(".");
                    var imgExtension =
                        originalname[originalname.length - 1].toLowerCase();
                    if (!arrayExtention.includes(imgExtension)) {
                        throw new Error("");
                    }
                });
            })
            .withMessage(
                `يجب ان يكون امتداد الصور dvd , avi , mkv , mv4 , mb4 , mp3 , flv`
            ),
    ];
};

module.exports = {
    trainingValidation,
};
