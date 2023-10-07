const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const roleRoute = require('./server/routes/role');
const usersRoute = require('./server/routes/users');
const communityRoute = require('./server/routes/community');
const memberRoute = require('./server/routes/member');

const dotenv = require('dotenv');
dotenv.config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/v1/role', roleRoute);
app.use('/v1/auth', usersRoute);
app.use('/v1/community', communityRoute);
app.use('/v1/member', memberRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
