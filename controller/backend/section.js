const { validationResult } = require("express-validator");
const {
    tryError,
    handel_validation_errors,
    returnWithMessage,
} = require("../../Helper/helper");
const SectionModel = require("../../models/sections");

const AllSectionController = async (req, res, next) => {
    try {
        const sections = await SectionModel.find()
        res.render("backEnd/sections/showAll", {
            title: "All sections",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            sections,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addSectionController = async (req, res, next) => {
    try {
        const sections = await SectionModel.find({ active: true });
        res.render("backEnd/sections/addSection", {
            title: "add section",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            sections,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const EditSectionController = async (req, res, next) => {
    try {
        const section = await SectionModel.findById(req.params.id);
        res.render("backEnd/sections/editSection", {
            title: "update section",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            section,
        });
    } catch (error) {
        tryError(res);
    }
};

const addSectionControllerPost = async (req, res, next) => {
    try {

        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(req, res, errors, "/dashboard/addSection");
            return;
        }
        const startTime = new Date(req.body.startTime);
        const endTime = new Date(req.body.endTime);

        if (!startTime || !endTime) {
            returnWithMessage(req, res, "/dashboard/addSection", "تاريخ البداية أو النهاية غير صالح", "danger");
            return;
        }
        req.body.active = true;
        await SectionModel.create(req.body);
        returnWithMessage(
            req,
            res,
            "/dashboard/Allsection",
            "تم اضافه بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const EditSectionControllerPost = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(
                req,
                res,
                errors,
                "/dashboard/editSection/" + req.params.id
            );
            return;
        }
        req.body.active = req.body.active ? true : false;
        console.log(req.body)
        await SectionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        returnWithMessage(
            req,
            res,
            "/dashboard/editSection/" + req.params.id,
            "تم تعديل بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const activeSection = async (req, res, next) => {
    try {
        await SectionModel.findByIdAndUpdate(
            req.params.id,
            { active: req.query.isActive === "true" ? false : true },
            { new: true }
        );

        returnWithMessage(
            req,
            res,
            "/dashboard/AllSection",
            req.query.isActive == "false"
                ? "تم التفعيل بنجاح"
                : "تم الغاء التفعيل بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const deleteSection = async (req, res, next) => {
    try {
        await SectionModel.findByIdAndDelete(req.params.id);
        returnWithMessage(
            req,
            res,
            "/dashboard/AllSection",
            "تم الحذف بنجاح",
            "danger"
        );
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    addSectionController,
    EditSectionController,
    EditSectionControllerPost,
    addSectionControllerPost,
    AllSectionController,
    activeSection,
    deleteSection,
};
