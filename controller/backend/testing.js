const {
    tryError,
    removeFiles,
} = require("../../Helper/helper");
const Testing = require("../../models/testing");
const Section = require("../../models/sections");
const Question = require("../../models/question");

const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const AllTestingController = async (req, res, next) => {
    try {
        const testing = await Testing.find()
        res.render("backEnd/testing/showAll", {
            title: "All Testing",
            URL: req.url,
            notification: req.flash("notification")[0],
            admin: req.cookies.User,
            Testing: testing,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addTestingController = async (req, res, next) => {
    try {
        const sections = await Section.find();
        res.render("backEnd/testing/addTesting", {
            title: "add Testing",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.User,
            sections,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addTestingControllerPost = async (req, res) => {
    try {
        const { examName, examType, questions, shuffle } = req.body;

        const newExam = await Testing.create({ name: examName, type: examType, shuffle: shuffle == "true" });
        if (questions && typeof questions === 'object' && Object.keys(questions).length > 0) {
            const sectionPromises = Object.entries(questions).map(async ([sectionId, sectionQuestions]) => {
                const questionPromises = sectionQuestions.map(async (questionData, index) => {
                    return await Question.create({
                        ...questionData,
                        section: sectionId,
                        exam: newExam._id,
                        order: index
                    });
                });
                return await Promise.all(questionPromises);
            });

            await Promise.all(sectionPromises);
        }

        res.status(201).json({
            success: true,
            message: "Exam and questions created successfully.",
            examId: newExam._id,
        });
    } catch (error) {
        console.error("Error creating exam:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while creating the exam.",
        });
    }
};

const EditTestingController = async (req, res, next) => {
    try {
        const examId = req.params.id;
        const sections = await Section.find();
        const examData = await Testing.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(examId),
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
                                order: 1
                            }
                        }
                    ]
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

        res.render("backEnd/testing/editTesting", {
            title: "edit Testing",
            URL: req.url,
            notification: req.flash("notification")[0],
            admin: req.cookies.User,
            Testing: examData[0],
            sections: sections,
            validationError: req.flash("validationError")[0],
        });
    } catch (error) {
        tryError(res, error);
    }
};

const EditTestingControllerPost = async (req, res) => {
    try {
        const { examName, examType, questions, shuffle } = req.body;
        const examId = req.params.id;

        const existingExam = await Testing.findById(examId);

        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found.",
            });
        }

        const oldQuestions = await Question.find({ exam: examId }).select('_id file');
        const deleteFilesPromises = oldQuestions.map(question => {
            // if (question.file && question.file.length > 0) removeFiles(req, question.file);
        });
        await Promise.all(deleteFilesPromises);

        const deleteQuestionsPromises = oldQuestions.map(question => Question.findByIdAndDelete(question._id));
        await Promise.all(deleteQuestionsPromises);

        await Testing.updateOne({ _id: examId }, {
            name: examName,
            type: examType,
            shuffle: shuffle === "true",
        });

        if (questions && typeof questions === 'object') {
            const sectionPromises = Object.entries(questions).map(([sectionId, sectionQuestions]) =>
                Question.insertMany(sectionQuestions.map((questionData, index) => ({
                    ...questionData,
                    section: sectionId,
                    exam: examId,
                    order: index
                })))
            );
            await Promise.all(sectionPromises);
        }

        res.status(200).json({
            success: true,
            message: "Exam and questions updated successfully.",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const activeTesting = async (req, res, next) => {
    try {
        await Testing.updateOne({ _id: req.params.id }, { active: req.query.isActive == "true" ? false : true });
        res.status(200).json({
            success: true,
            message: `Exam is ${req.query.isActive == "true" ? "dis active" : "active"}`,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const deleteTesting = async (req, res, next) => {
    try {
        const exam = await Testing.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found.",
            });
        }

        const questions = await Question.find({ exam: req.params.id });

        const fileDeletionPromises = questions.map((question) => {
            if (question.file) {
                return removeFiles(req, question.file);
            }
            return Promise.resolve();
        });

        await Promise.all([
            Promise.all(fileDeletionPromises),
            Question.deleteMany({ exam: req.params.id }),
            Testing.findByIdAndDelete(req.params.id),
        ]);

        res.status(200).json({
            success: true,
            message: "Exam and associated questions deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting exam:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the exam.",
        });
    }
};


module.exports = {
    AllTestingController,
    addTestingController,
    EditTestingControllerPost,
    EditTestingController,
    addTestingControllerPost,
    activeTesting,
    deleteTesting,
};
