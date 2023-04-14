const User = require('../models/user');

module.exports.postUserDetails = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (!name || !email || !password) {
            throw new Error('Missing some data');
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