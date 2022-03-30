const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
// const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../validation/validation');

exports.register = async (req, res) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // Checks for the validation.
    const { error } = registerValidation(req.body);
    if (error) {
        return res.render('register', {
            title: 'Library MS | Register',
            error: error.details[0].message
        });
    }
    // Check if email exists in DB.
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
        return res.render('register', {
            title: 'Library MS | Register',
            message: 'Email already exists.'
        })
    } else if (password != confirmPassword) {
        return res.render('register', {
            title: 'Library MS | Register',
            passMessage: 'Passwords should match.'
        })
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 8);

    const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        // res.send({ user: user._id, firstName: user.firstName, lastName: user.lastName });
        res.render('login', {
            title: 'Library MS | Login',
        })
    } catch (err) {
        console.log(err);
    }
}