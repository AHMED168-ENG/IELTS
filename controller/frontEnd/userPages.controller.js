const {
    tryError,
    returnWithMessage,
    handel_validation_errors,
    Rename_uploade_img,
    removeImg,
} = require("../../Helper/helper");
const UsersResultModel = require("../../models/usersresult");
const UserJoinExam = require("../../models/userJoinExam");
const Testing = require("../../models/testing");
const Section = require("../../models/sections");
const ContactUsModel = require("../../models/contactus");
const Question = require("../../models/question");
const natural = require("natural");
const paginate = require("express-paginate");
const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const { sendEmail } = require("../../emails/sendEmails");
const { default: mongoose } = require("mongoose");







const homePage = async (req, res, next) => {
    try {
        res.render("frontEnd/userPage/homePage", {
            title: "home",
            URL: req.url,
            notification: req.flash("notification")[0],
            user: req.cookies.User,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const userProfile = async (req, res, next) => {
    try {
        const userResult = await UsersResultModel.find({
            userId: req.cookies.User.id,
            success: true,
        });
        const userDisability = await UserJoinExam.find({
            _id: { $in: req.cookies.User.Disability },
        });
        res.render("frontEnd/userPage/userProfile", {
            title: "user Profile",
            URL: req.url,
            userDisability,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            userResult,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(req, res, errors, "userProfile");
            return;
        }
        var user = req.cookies.User;
        var compPassword = bcrypt.compareSync(req.body.password, user.password);
        if (compPassword) {
            var newPassword = bcrypt.hashSync(req.body.newPassword, 10);
            await UsersResultModel.findByIdAndUpdate(
                user.id,  // تحديد الـ _id للمستخدم
                { password: newPassword },  // تعيين كلمة السر الجديدة
                { new: true }  // لإرجاع الوثيقة المحدثة
            );
            res.clearCookie("User");
            returnWithMessage(
                req,
                res,
                "/userProfile",
                "تم تغير كلمه السر بنجاح",
                "success"
            );
        } else {
            returnWithMessage(
                req,
                res,
                "/userProfile",
                "الرقم السري اللذي ادخلته خاطا",
                "danger"
            );
        }
    } catch (error) {
        tryError(res, error);
    }
};

const ourService = async (req, res, nest) => {
    try {
        res.render("frontEnd/userPage/ourService", {
            title: "our service",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
        });
    } catch (error) {
        tryError(res);
    }
};




const ExamVoice = async (req, res, nest) => {
    try {
        var { limit, page } = req.query;
        const ExamVoice = await SoundExamModel.find({
            active: true,
            $or: [
                { disability: { $in: req.cookies.User.Disability } }, // تطابق مع الـ Disability
                {
                    otherDisabilities: { $elemMatch: { $in: req.cookies.User.Disability } }, // تطابق مع الـ otherDisabilities
                    isOther: true,
                },
            ],
        })
            .skip((parseInt(page) - 1) * limit) // تخطي العناصر بناءً على الصفحة
            .limit(parseInt(limit)) // تعيين الحد الأقصى للعناصر في الصفحة
            .populate("soundDisability"); // تضمين بيانات "soundDisability"

        res.render("frontEnd/userPage/ExamVoice", {
            title: "my voice exam",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            ExamVoice,
            page,
            pages: paginate.getArrayPages(req)(
                limit,
                Math.ceil(ExamVoice.count / limit),
                page
            ),
        });
    } catch (error) {
        tryError(res, error);
    }
};


const allTesting = async (req, res, nest) => {
    try {
        const allTesting = await Testing.find({ active: true })
        res.render("frontEnd/userPage/allTesting", {
            title: "show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            allTesting,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const enterExam = async (req, res, next) => {
    try {
        const userId = req.cookies.User.id;
        const examId = req.params.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if the user has entered this exam today
        const existingEntry = await UserJoinExam.findOne({
            user: userId,
            exam: examId,
            createdAt: {
                $gte: today,
            },
        });

        // if (existingEntry) {
        //     returnWithMessage(
        //         req,
        //         res,
        //         "/allTesting",
        //         "لقد قمت بدخول هذا الامتحان اليوم. الرجاء المحاولة غداً.",
        //         "danger"
        //     );
        //     return;
        // }

        // If the user has not entered today, allow them to proceed

        // Save the user's entry to the Disability table
        await UserJoinExam.create({
            user: userId,
            exam: examId,
        });

        // Fetch sections and exam details
        const sections = await Section.find();
        const examData = await Testing.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(examId),
                    active: true
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "exam",
                    as: "questions",
                    pipeline: [
                        {
                            $sort: {
                                order: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    questions: {
                        $cond: {
                            if: { $eq: ["$shuffle", true] },
                            then: { $function: { body: `function(arr) { return arr.sort(() => 0.5 - Math.random()); }`, args: ["$questions"], lang: "js" } },
                            else: "$questions",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    type: 1,
                    shuffle: 1,
                    active: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    questions: 1,
                },
            },
        ]);

        if (!examData[0]) return returnWithMessage(req, res, "/allTesting", "الامتحان غير مسجل", "danger")

        res.render("frontEnd/userPage/enterExam", {
            title: "Show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            sections,
            examData: examData[0],
        });
    } catch (error) {
        tryError(res, error);
    }
};


const calculateSimilarity = (correctAnswer, studentAnswer) => {

    const tokenizer = new natural.WordTokenizer();
    const correctTokens = tokenizer.tokenize(correctAnswer.toLowerCase());
    const studentTokens = tokenizer.tokenize(studentAnswer.toLowerCase());

    const correctSet = new Set(correctTokens);
    const studentSet = new Set(studentTokens);

    const intersection = new Set([...correctSet].filter(x => studentSet.has(x)));
    return intersection.size / Math.max(correctSet.size, studentSet.size);
};



const sendResult = async (req, res, next) => {
    try {
        const userId = req.cookies.User._id
        const answers = req.body; // الإجابات تحتوي على sectionId
        const examId = req.params.examId; // examId مأخوذ من البرامز
        if (!userId || !answers || !examId) {
            return res.status(400).json({ error: 'Missing required fields: userId, examId, or answers.' });
        }

        // تحليل البيانات لاستخراج sectionId والإجابات الخاصة به
        const sectionId = Object.keys(answers)[0]; // أول مفتاح هو sectionId
        const sectionAnswers = answers[sectionId]; // الإجابات الخاصة بهذا القسم
        if (!sectionId || !sectionAnswers) {
            return res.status(400).json({ error: 'Invalid answers format.' });
        }

        // جلب الأسئلة الخاصة بالسكشن
        const questions = await Question.find({ section: sectionId, exam: examId });

        let totalDegree = 0; // الدرجة الكلية
        let obtainedDegree = 0; // الدرجة المكتسبة
        const sectionReport = []; // تقرير حول تصحيح الأسئلة

        for (const question of questions) {
            totalDegree += question.degree;
            // console.log(question)
            // console.log(question)

            const studentAnswerObj = sectionAnswers.find(ans => Object.keys(ans)[0] === question._id.toString());
            if (!studentAnswerObj) continue;
            // console.log(studentAnswerObj)
            const studentAnswer = studentAnswerObj[question._id.toString()];
            let isCorrect = false;

            if (question.type === 'multipleChoice' || question.type === 'trueFalse') {
                isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
            } else if (question.type === 'fillInTheBlank') {
                const similarity = calculateSimilarity(question.correctAnswer, studentAnswer || '');
                console.log(similarity)
                isCorrect = similarity >= 0.5;

                console.log(similarity)
            } else if (question.type === 'file' || question.type === 'audio') {
                const similarity = calculateSimilarity(question.correctAnswer, studentAnswer || '');
                isCorrect = similarity >= 0.5;
            }

            if (isCorrect) obtainedDegree += question.degree;

            sectionReport.push({
                questionId: question._id,
                isCorrect,
                correctAnswer: question.correctAnswer,
                studentAnswer,
            });
        }

        // حفظ نتيجة الطالب في قاعدة البيانات
        const userResult = await UsersResultModel.create({
            userId,
            Exam: examId,
            section: sectionId,
            degree: obtainedDegree,
            degreeFrom: totalDegree
        });

        res.status(200).json({
            message: 'تم تصحيح القسم بنجاح',
            obtainedDegree,
            totalDegree,
            sectionReport
        });
    } catch (error) {
        console.error('Error correcting section:', error);
        next(error);
    }
};

const resultPage = async (req, res, next) => {
    try {
        const userId = req.cookies.User._id;
        const userResults = await UsersResultModel.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'sections',
                    localField: 'section',
                    foreignField: '_id',
                    as: 'sectionDetails'
                }
            },
            {
                $lookup: {
                    from: 'exams',
                    localField: 'Exam',
                    foreignField: '_id',
                    as: 'examDetails'
                }
            },
            {
                $unwind: '$sectionDetails'
            },
            {
                $unwind: '$examDetails'
            },
            {
                $group: {
                    _id: {
                        examId: '$Exam',
                        examDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } // تجميع حسب التاريخ
                    },
                    examName: { $first: '$examDetails.name' },
                    sections: {
                        $push: {
                            sectionDate: { $dateToString: { format: '%Y-%m-%d', date: "$createdAt" } },
                            sectionName: '$sectionDetails.section',
                            degreeFrom: '$degreeFrom',
                            obtainedDegree: '$degree'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$_id.examId',
                    examName: { $first: '$examName' },
                    attempts: {
                        $push: {
                            examDate: '$_id.examDate',
                            sections: '$sections'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    examName: 1,
                    attempts: 1
                }
            }
        ]);

        res.render("frontEnd/userPage/resultPage", {
            title: "show exam result",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            AllUserResult: userResults,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const contactUs = async (req, res, nest) => {
    try {
        res.render("frontEnd/userPage/contactUs", {
            title: "show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            allTesting,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const contactUsPost = async (req, res, nest) => {
    try {
        await ContactUsModel.create({
            userId: req.cookies.User.id,
            message: req.body.message,
        });
        returnWithMessage(
            req,
            res,
            "/contactUs",
            "تم ارسال الرساله بنجاح انتظر الرد علي الايميل اللذي قمت بالتسجيل به علي الموقع",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const EditPersonalInformation = async (req, res, nest) => {
    try {
        var disabilitys = await UserJoinExam.find({
            active: true,
        });

        res.render("frontEnd/userPage/editPersonalInformation", {
            title: "Edit Personal Information",
            URL: req.url,
            disabilitys,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
        });
    } catch (error) {
        tryError(res);
    }
};

const EditPersonalInformationPost = async (req, res, nest) => {
    try {
        var errors = await validationResult(req).errors;
        if (errors.length > 0) {
            removeImg(req);
            handel_validation_errors(
                req,
                res,
                errors,
                "/editPersonalInformation"
            );
            return;
        }
        var file = Rename_uploade_img(req);
        if (file) {
            removeImg(req, "users/", req.body.oldImage);
        }
        req.body.image = file ? file : req.body.oldImage;
        req.body.gender = req.body.gender == "1" ? true : false;
        console.log(req.body);
        req.body.Disability =
            req.body.Disability.length == 1
                ? [req.body.Disability]
                : req.body.Disability;
        await UsersResultModel.update(req.body, {
            where: {
                id: req.cookies.User.id,
            },
        });
        res.clearCookie("User");

        returnWithMessage(
            req,
            res,
            "/editPersonalInformation",
            "تم تعديل بياناتك بنجاح قم بتسجيل الدخول مره اخري",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    homePage,
    userProfile,
    changePassword,
    contactUs,
    EditPersonalInformation,
    ourService,
    EditPersonalInformationPost,
    resultPage,
    contactUsPost,
    allTesting,
    enterExam,
    sendResult,
    ExamVoice,
};
