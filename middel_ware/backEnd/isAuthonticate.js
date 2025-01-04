/*--------------------------- start check if user is admin or not ---------------------*/
const isAuthonticate = async (req, res, next) => {
  var Admin = req.cookies.Admin;
  if (!Admin) {
    res.redirect("/dashboard/signIn");
  } else {
    next();
  }
};
/*--------------------------- end check if user is admin or not ---------------------*/

module.exports = {
  isAuthonticate,
};
