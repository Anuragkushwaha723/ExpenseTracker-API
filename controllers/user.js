const User = require('../models/user');

module.exports.postUserSignUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (!name || !email || !password) {
            res.status(500).json({ error: 'Missing some data' });
        }

        let responseData = await User.create({
            name: name,
            email: email,
            password: password
        });
        res.status(201).json(responseData);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports.postUserLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            res.status(500).json({ message: 'Missing some data' });
        }

        let responseData = await User.findAll({ where: { email: email } });
        if (responseData.length > 0) {
            if (responseData[0].password === password) {
                res.status(201).json({ message: 'User logged in successfully' });
            } else {
                res.status(500).json({ message: 'Password is incorrect' });
            }

        } else {
            res.status(500).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};