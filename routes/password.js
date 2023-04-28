const express = require('express');
const passwordControllers = require('../controllers/password');
const route = express.Router();

route.post('/forgotpassword', passwordControllers.postForgotPassword);
module.exports = route;