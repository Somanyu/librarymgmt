const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation/userValidation');


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

// Create JWT for login
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

exports.login = async (req, res) => {
    try {

        // Checks for the validation.
        const { error } = loginValidation(req.body);
        if (error) {
            return res.render('login', {
                title: 'Library MS | Login',
                error: error.details[0].message
            })
        }

        // Check if email exists in DB.
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.render('login', {
                title: 'Library MS | Login',
                message: 'Email is not registered.'
            })
        }

        // Check if password is correct.
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.render('login', {
                title: 'Library MS | Login',
                passMessage: 'Inavlid Password or Email.'
            })
        }

        // const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRES_IN
        // });
        // console.log("The token is -- "+token);
        // const cookieOptions = {
        //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
        //     httpOnly: true
        // }
        // res.cookie('jwt', token, cookieOptions);
        // res.status(200).redirect('/users/profile');
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).redirect('/users/profile');
        // res.status(200).json({ user: user._id });

    } catch (error) {
        console.log(error);
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }