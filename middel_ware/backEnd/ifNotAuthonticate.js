/*--------------------------- start check if user is admin or not ---------------------*/
const isNotAuthonticate = async (req, res, next) => {
  var User = req.cookies.User;
  if (User && User.isAdmin) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};
/*--------------------------- end check if user is admin or not ---------------------*/

module.exports = {
  isNotAuthonticate,
};
