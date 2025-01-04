/*--************ start helpper functions --**********/

const multer = require("multer");
const fs = require("fs");

/*----------------- start try error -------------------*/
const tryError = async (res, message = null) => {
  (message = message
    ? message
    : "هناك خطا ما في الاتصال ويجب عليك مراجعه مبرمج الموقع"),
    res.render("error", { message: message });
};
/*----------------- end try error -------------------*/

/*----------------- start return with message -------------------*/
const returnWithMessage = async (
  req,
  res,
  url = "",
  message = "",
  type = ""
) => {
  message = message ? message : "هناك خطا ما ويرجي التحقق من الكود";
  type = type ? type : "danger";
  req.flash("notification", { message: message, type: type });
  res.redirect(url);
};
/*----------------- end return with message -------------------*/

/*------------------------------------ start getDate -------------------------------*/
function getDate(time, type = "") {
  var date = time.toString().split(" ");
  if (!type) {
    date = date[1] + " " + date[2] + " " + date[3] + " " + date[4] + " ";
  } else if (type == "time") {
    date = date[4] + " ";
  } else {
    date = date[1] + " " + date[2] + " " + date[3];
  }

  return date;
}
/*------------------------------------ end getDate -------------------------------*/

/*------------------------------------ start handel validation errors -------------------------------*/
var handel_validation_errors = (req, res, errors, path, errorOnly) => {
  var param = [];
  var newError = {};
  errors.forEach((element) => {
    if (!param.includes(element.path)) {
      param.push(element.path);
      newError[element.path] = [element];
    } else {
      newError[element.path].push(element);
    }
  });
  if (errorOnly) {
    return newError;
  } else {
    console.log(newError)
    req.flash("validationError", newError);
    res.redirect(path);
  }
};
/*------------------------------------ end handel validation errors -------------------------------*/

/*------------------------------------ start uploade image -------------------------------*/
const uploade_img = (path, image) => {
  return multer({ dest: path }).array(image);
};
const uploade_img_multi_fild = (array, dest) => {
  return multer({ dest: dest }).fields(array);
};
/*--------------------------------------------------*/

const Rename_uploade_img_multiFild = (fields) => {
  var fileds_img = {};
  var image = "";
  fields.forEach((element) => {
    if (element) {
      element.forEach((element, i) => {
        var randomNumber = Math.random(1000, 9000);
        var newPath =
          element.destination + "/" + randomNumber + element.originalname;
        fs.renameSync(element.path, newPath);
        image += randomNumber + element.originalname + "--";
      });
      fileds_img[element[0].fieldname] = image;
      image = "";
    }
  });
  return fileds_img;
};
/*--------------------------------------------------*/

/*--------------------------------------------------*/

const Rename_uploade_img = (req) => {
  var image = "";
  req.files.forEach((element) => {
    var randomNumber = Math.random(1000, 9000);
    var newPath =
      element.destination + "/" + randomNumber + element.originalname;
    fs.renameSync(element.path, newPath);
    image += randomNumber + element.originalname + "--";
  });
  return image;
};
/*--------------------------------------------------*/

const removeImgFiled = (fields) => {
  fields.forEach((element) => {
    if (element) {
      element.forEach((element, i) => {
        fs.unlinkSync(element.path);
      });
    }
  });
};
/*--------------------------------------------------*/

/*--------------------------------------------------*/

const removeImg = (req, folder, imgname = "") => {
  if (!imgname) {
    req.files.forEach((element) => {
      fs.unlinkSync(element.path);
    });
  } else {
    var imgname = imgname.split("--");
    for (var i = 0; i < imgname.length - 1; i++) {
      fs.unlinkSync("public/backEnd/assets/img/" + folder + imgname[i]);
    }
  }
};

const removeFiles = (req, file = "") => {
  if (!file) {
    req.files.forEach((element) => {
      fs.unlinkSync(element.path);
    });
  } else {
    fs.unlinkSync("public/backEnd/assets/sound/question/" + file);
  }
};
/*------------------------------------ end uploade image -------------------------------*/

/*------------------------------------ get default Language -------------------------------*/
const defaultLanguage = () => {
  return "en";
};
/*------------------------------------ get default Language -------------------------------*/
/*--------------------- start formate date ---------------------*/
function formateDate(date, type = "date") {
  if (type == "date") {
    return require("moment")(date).format("YYYY-MM-DD");
  } else {
    return require("moment")(date).format("hh-mm-ss");
  }
}
/*--------------------- end formateDate ---------------------*/

/*--------------------- start get catigory ---------------------*/
// const getMainCatigory = async (id) => {
//   var db = require("../models");
//   var catigoryFullName = "";
//   var test = true;
//   while (test) {
//     var catData = await db.catigorys.findOne({
//       where: {
//         id: id,
//       },
//     });
//     if (!catData) {
//       test = false;
//     } else {
//       id = catData.catigoryId;
//       catigoryFullName += "___" + catData["name_" + defaultLanguage()];
//     }
//   }
//   catigoryFullName = catigoryFullName.split("___").reverse().join(" -- ");
//   return catigoryFullName;
// };
/*--------------------- end get catigory ---------------------*/

/*--------------------- start formate date ---------------------*/
function formateDate(date, type = "date") {
  if (type == "date") {
    return require("moment")(date).format("YYYY-MM-DD");
  } else {
    return require("moment")(date).format("hh-mm-ss");
  }
}
/*--------------------- end formateDate ---------------------*/

/*--------------------- start formate date ---------------------*/
function getSumOfArray(array) {
  var sum = 0;
  array.forEach((element) => {
    if (element) {
      sum += parseInt(element);
    }
  });
  return sum;
}
/*--------------------- end formateDate ---------------------*/

module.exports = {
  returnWithMessage,
  getDate,
  tryError,
  handel_validation_errors,
  uploade_img,
  Rename_uploade_img,
  removeImg,
  uploade_img_multi_fild,
  Rename_uploade_img_multiFild,
  removeImgFiled,
  defaultLanguage,
  formateDate,
  getSumOfArray,
  removeFiles
};
