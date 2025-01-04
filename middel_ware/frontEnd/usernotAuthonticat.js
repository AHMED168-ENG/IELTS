const { tryError } = require("../../Helper/helper")



const userNotAuthonticat = async (req , res , next) => {
    try {
        if(req.cookies.User) {
            res.redirect("/")
        } else {
            next()
        }
    } catch (error) {
        tryError(res)
    }
}










module.exports = {
    userNotAuthonticat
}