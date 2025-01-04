const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
require("dotenv").config();
const path = require("path");
const paginate = require("express-paginate");
const session = require("express-session");
const flash = require("connect-flash");
const cookies = require("cookie-parser");
const { dashpordRouter } = require("./router/backend/dashpored");
const { authAdmin } = require("./router/backend/auth.router");
const { userRoutes } = require("./router/frontEnd/userPagesRoutes");
const { authUserRoutes } = require("./router/frontEnd/auth/auth");
const { usersRouter } = require("./router/backend/users_router");
const { TestingRouter } = require("./router/backend/testIng.router");
// const { messagesRouter } = require("./router/backend/messages.router");
const { allUserResult } = require("./router/backend/UserResult");
const { SectionRouter } = require("./router/backend/section");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/ieltsExam', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

/*--------------------------- start sockit Io ----------------------------------*/
var activeUser = {};

/* ------------- set seting -------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookies());
app.use(
    session({
        secret: "هذا الاوبشن خاص بالتشفير يطلب منك نص معين يستخدمه هو عند التشفير وكلما زاد هذا النص زاد الحمايه",
        saveUninitialized: false, // معناها انه عند عمل session لاتقوم بحفظها في الداتابيز الا عندما امرك بذالك
        /*cookie : { // السشن ده هو في الاصل عباره عن cookie لذالك انا اقوم بتحديد بعض القيم لتحديد مده الانتهاء الديفولت هو عند اغلاق المتصفح
        //maxAge : 1 * 60 * 60 * 100, 
    },*/
        resave: true,
    })
);
app.use(flash());
app.use(paginate.middleware(10, 20));
/* ------------- set seting -------------------*/
app.use("/", dashpordRouter);
app.use("/dashboard", authAdmin);
app.use("/dashboard", usersRouter);
app.use("/dashboard", TestingRouter);
// app.use("/dashboard", messagesRouter);
app.use("/dashboard", allUserResult);
app.use("/dashboard", SectionRouter);
app.use("/", authUserRoutes);
app.use("/", userRoutes);

app.use((req, res, next) => {
    res.render("error", { message: "this page not hir", title: "Error Page" });
});
/*--------------------------- end route  ----------------------------------*/

server.listen("5000", () => {
    console.log("server strate");
});
