const { tryError } = require("../../Helper/helper");

const userAuthenticateApi = async (req, res, next) => {
  try {
    const user = req.cookies.User; 

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    next();
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  userAuthenticateApi,
};
