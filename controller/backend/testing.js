const {
    tryError,
    removeFiles,
} = require("../../Helper/helper");
const Testing = require("../../models/testing");
const Section = require("../../models/sections");
const Question = require("../../models/question");
const Block = require("../../models/block");

const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const AllTestingController = async (req, res, next) => {
    try {
        const testing = await Testing.find().sort({ "createdAt": -1 })
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
        const { examName, examType, shuffle, sections } = req.body;

        if (!examName || !examType || !sections) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: examName, examType, or sections.",
            });
        }

        // إنشاء الامتحان
        const newExam = await Testing.create({
            name: examName,
            type: examType,
            shuffle: shuffle === true,
        });
        console.log(newExam)
        console.log(sectionPromises)

        // معالجة الأقسام (sections)
        const sectionPromises = Object.entries(sections).map(async ([sectionId, sectionData]) => {
            if (!sectionData.blocks || !Array.isArray(sectionData.blocks)) {
                throw new Error(`Invalid or missing blocks for section: ${sectionId}`);
            }

            // معالجة الكتل (blocks) داخل القسم
            const blockPromises = sectionData.blocks.map(async (blockData, blockIndex) => {
                const newBlock = await Block.create({
                    description: blockData.description,
                    section: sectionId,
                    order: blockIndex,
                    exam: newExam._id,
                });

                // معالجة الأسئلة داخل الـ block
                if (blockData.questions && Array.isArray(blockData.questions)) {
                    const questionPromises = blockData.questions.map(async (questionData, questionIndex) => {
                        return await Question.create({
                            questionText: questionData.text,
                            type: questionData.type,
                            degree: questionData.degree,
                            choices: questionData.choices || [],
                            correctAnswer: questionData.correctAnswer,
                            file: questionData.file || null,
                            section: sectionId,
                            exam: newExam._id,
                            block: newBlock._id,
                            order: questionIndex,
                        });
                    });

                    await Promise.all(questionPromises);
                }

                return newBlock;
            });

            return await Promise.all(blockPromises);
        });

        await Promise.all(sectionPromises);

        res.status(201).json({
            success: true,
            message: "Exam, blocks, and questions created successfully.",
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
                    _id: new mongoose.Types.ObjectId(examId), // تحديد الامتحان المطلوب
                },
            },
            {
                $lookup: {
                    from: "blocks",
                    localField: "_id",
                    foreignField: "exam",
                    as: "blocks",
                },
            },
            {
                $unwind: {
                    path: "$blocks",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "sections",
                    localField: "blocks.section",
                    foreignField: "_id",
                    as: "blocks.sectionData",
                },
            },
            {
                $unwind: {
                    path: "$blocks.sectionData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "blocks._id",
                    foreignField: "block",
                    as: "blocks.questions",
                },
            },
            {
                $group: {
                    _id: "$blocks.sectionData._id",
                    sectionName: { $first: "$blocks.sectionData.section" },
                    blocks: {
                        $push: {
                            _id: "$blocks._id",
                            description: "$blocks.description",
                            order: "$blocks.order",
                            questions: "$blocks.questions",
                        },
                    },
                    examName: { $first: "$name" },
                    examId: { $first: "$_id" },
                    examType: { $first: "$type" },
                    examShuffle: { $first: "$shuffle" },
                    examActive: { $first: "$active" },
                    examCreatedAt: { $first: "$createdAt" },
                    examUpdatedAt: { $first: "$updatedAt" },
                },
            },
            {
                $sort: {
                    sectionName: 1,
                },
            },
            {
                $group: {
                    _id: "$examName",
                    name: { $first: "$examName" },
                    examId: { $first: "$examId" },
                    type: { $first: "$examType" },
                    shuffle: { $first: "$examShuffle" },
                    active: { $first: "$examActive" },
                    createdAt: { $first: "$examCreatedAt" },
                    updatedAt: { $first: "$examUpdatedAt" },
                    sections: {
                        $push: {
                            _id: "$_id",
                            section: "$sectionName",
                            order: "$sectionOrder",
                            blocks: "$blocks",
                        },
                    },
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

// const EditTestingControllerPost = async (req, res) => {
//     try {
//         const { examName, examType, questions, shuffle } = req.body;
//         const examId = req.params.id;

//         const existingExam = await Testing.findById(examId);

//         if (!existingExam) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Exam not found.",
//             });
//         }

//         const oldQuestions = await Question.find({ exam: examId }).select('_id file');
//         const deleteFilesPromises = oldQuestions.map(question => {
//             // if (question.file && question.file.length > 0) removeFiles(req, question.file);
//         });
//         await Promise.all(deleteFilesPromises);

//         const deleteQuestionsPromises = oldQuestions.map(question => Question.findByIdAndDelete(question._id));
//         await Promise.all(deleteQuestionsPromises);

//         await Testing.updateOne({ _id: examId }, {
//             name: examName,
//             type: examType,
//             shuffle: shuffle === "true",
//         });

//         if (questions && typeof questions === 'object') {
//             const sectionPromises = Object.entries(questions).map(([sectionId, sectionQuestions]) =>
//                 Question.insertMany(sectionQuestions.map((questionData, index) => ({
//                     ...questionData,
//                     section: sectionId,
//                     exam: examId,
//                     order: index
//                 })))
//             );
//             await Promise.all(sectionPromises);
//         }

//         res.status(200).json({
//             success: true,
//             message: "Exam and questions updated successfully.",
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

const EditTestingControllerPost = async (req, res) => {
    try {
        const { examName, examType, shuffle, sections } = req.body;
        const examId = req.params.id;
        console.log(shuffle)
        // التحقق من المدخلات
        if (!examName || !examType || !sections) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: examId, examName, examType, or sections.",
            });
        }
        console.log(examId)
        // التحقق من وجود الامتحان
        const existingExam = await Testing.findById(examId);
        if (!existingExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found.",
            });
        }

        // خطوة 1: حذف الكتل والأسئلة المرتبطة بالامتحان
        console.log("Deleting existing blocks and questions...");
        await Promise.all([
            Block.deleteMany({ exam: examId }),
            Question.deleteMany({ exam: examId }),
        ]);

        // خطوة 2: تحديث بيانات الامتحان
        console.log("Updating exam data...");
        existingExam.name = examName;
        existingExam.type = examType;
        existingExam.shuffle = shuffle == true;
        console.log(existingExam)
        await existingExam.save();

        const sectionPromises = Object.entries(sections).map(
            async ([sectionId, sectionData]) => {
                // التحقق من الكتل
                if (!sectionData.blocks || !Array.isArray(sectionData.blocks)) {
                    throw new Error(`Invalid or missing blocks for section: ${sectionId}`);
                }

                const blockPromises = sectionData.blocks.map(
                    async (blockData, blockIndex) => {
                        const newBlock = await Block.create({
                            description: blockData.description,
                            section: sectionId,
                            order: blockIndex,
                            exam: examId,
                        });

                        if (blockData.questions && Array.isArray(blockData.questions)) {
                            const questionPromises = blockData.questions.map(
                                async (questionData, questionIndex) => {
                                    return Question.create({
                                        questionText: questionData.text,
                                        type: questionData.type,
                                        degree: questionData.degree,
                                        choices: questionData.choices || [],
                                        correctAnswer: questionData.correctAnswer,
                                        file: questionData.file || null,
                                        section: sectionId,
                                        exam: examId,
                                        block: newBlock._id,
                                        order: questionIndex,
                                    });
                                }
                            );
                            await Promise.all(questionPromises);
                        }
                        return newBlock;
                    }
                );

                return await Promise.all(blockPromises);
            }
        );
        await Promise.all(sectionPromises);
        res.status(200).json({
            success: true,
            message: "Exam, blocks, and questions updated successfully.",
            examId: examId,
        });
    } catch (error) {
        console.error("Error updating exam:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while updating the exam.",
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
            Block.deleteMany({ exam: req.params.id }),
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
