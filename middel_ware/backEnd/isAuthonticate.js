/*--------------------------- start check if user is admin or not ---------------------*/
const isAuthonticate = async (req, res, next) => {
  var User = req.cookies.User;
  console.log(User)
  if ((User && !User.isAdmin) || !User) {
    res.redirect("/signIn");
  } else {
    next();
  }
};
/*--------------------------- end check if user is admin or not ---------------------*/

module.exports = {
  isAuthonticate,
};
