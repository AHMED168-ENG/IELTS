const {
    AllTestingController,
    EditTestingController,
    activeTesting,
    deleteTesting,
    EditTestingControllerPost,
    addTestingController,
    addTestingControllerPost,
    uploadFile
} = require("../../controller/backend/testing");
const multer = require('multer');
const path = require('path');

const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const examSchema = require("../../validation/backEnd/Testing.validation");
const validateRequest = require("../../middel_ware/backEnd/validateRequest");
const { userAuthenticateApi } = require("../../middel_ware/frontEnd/userAuthonticateApi");

const router = require("express").Router();

router.get("/AllTesting", isAuthonticate, AllTestingController);

router.get("/addTesting", isAuthonticate, addTestingController);

router.post(
    "/addTesting",
    isAuthonticate,
    validateRequest(examSchema),
    addTestingControllerPost
);

router.get(
    "/EditTesting/:id", 
    isAuthonticate, 
    EditTestingController
);

router.post(
    "/EditTesting/:id",
    isAuthonticate,
    validateRequest(examSchema),
    EditTestingControllerPost
);
router.post(
    "/activeTesting/:id", 
    isAuthonticate, 
    activeTesting
);
router.delete("/deleteTesting/:id", isAuthonticate, deleteTesting);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/backEnd/assets/sound/question'); // المسار لحفظ الملفات
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let fileExtension = path.extname(file.originalname);
        if (!fileExtension) {
            const mimeToExt = {
                'audio/ogg': '.ogg',
                'audio/mpeg': '.mp3',
                'audio/wav': '.wav'
            };
            fileExtension = mimeToExt[file.mimetype] || '.ogg'; 
        }

        cb(null, uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['audio/ogg', 'audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadSingleFile = upload.single('file'); 
router.post('/upload-test-file', (req, res) => {
    userAuthenticateApi,
    uploadSingleFile(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileName = req.file.filename;
        res.status(200).json({
            message: 'File uploaded successfully',
            fileName: fileName
        });
    });
});


module.exports = {
    TestingRouter: router,
};
