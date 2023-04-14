const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userModel = require('./models/user');
const userRoutes = require('./routes/user');
const sequelize = require('./utils/database');
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use('/user', userRoutes);

sequelize.sync()
    .then((result) => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
