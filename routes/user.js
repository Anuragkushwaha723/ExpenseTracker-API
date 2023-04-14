const express = require('express');
const userController = require('../controllers/user');
const route = express.Router();

route.post('/signUp', userController.postUserDetails);
module.exports = route;