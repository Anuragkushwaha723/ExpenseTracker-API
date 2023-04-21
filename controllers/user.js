const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports.postUserSignUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (!name || !email || !password) {
            return res.status(500).json({ message: 'Missing some data' });
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            try {
                await User.create({ name: name, email: email, password: hash });
                res.status(201).json({ message: 'Successfully create new user' });
            } catch (error) {
                res.status(500).json({ message: 'Please try again' });
            }
        })
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, '12mffffhfn565swdoetxdjkdoc7654358gfhyre5gfr5dd5hb4d');
}
module.exports.postUserLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(500).json({ message: 'Missing some data' });
        }

        let responseData = await User.findAll({ where: { email: email } });
        if (responseData.length > 0) {
            bcrypt.compare(password, responseData[0].password, async (err, result) => {
                if (err) {
                    res.status(201).json({ message: 'Something went wrong' });
                }

                if (result === true) {
                    res.status(201).json({ message: 'User logged in successfully', token: generateAccessToken(responseData[0].id) });
                } else {
                    res.status(500).json({ message: 'Password is incorrect' });
                }

            })
        } else {
            res.status(500).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};