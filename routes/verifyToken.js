const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = function (req, res, next) {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).redirect('/login');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        User.findOne({_id: req.user});
    
        next();
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}