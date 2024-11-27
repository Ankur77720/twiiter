const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

module.exports.authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token

        if (!token) {
            return res.redirect('/login')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)





        req.user = await userModel.findById(decoded.id)

        return next()

    } catch (err) {
        console.log(err)
        res.redirect('/login')
    }
}