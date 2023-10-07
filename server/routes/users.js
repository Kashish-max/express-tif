const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Session = require('../models/session');
const { authenticate } = require('../middleware/authenticate');
const { initSession, createUserResponseData } = require('../utils/utils');
const { signupValidator, loginValidator } = require('../utils/authValidator');
const { validatorMiddleware } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/signup',
  signupValidator,
  validatorMiddleware,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = new User({ name, email, password });
      const persistedUser = await user.save();
      const user_id = persistedUser._id;

      const session = await initSession(user_id);
      const success_message = createUserResponseData(persistedUser);

      res
        .cookie('token', session.token, {
          httpOnly: true,
          sameSite: true,
          maxAge: 1209600000,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(201)
        .json(success_message);
    } catch (err) {
      res.status(400).json({
        status: false,
        errors: [
          {
            code: 'SERVER_ERROR',
            message: err.message,
          },
        ],
      });
    }
  }
);

router.post(
  '/signin',
  loginValidator,
  validatorMiddleware,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      const user_id = user._id;

      const session = await initSession(user_id);
      const success_message = createUserResponseData(user);

      res
        .cookie('token', session.token, {
          httpOnly: true,
          sameSite: true,
          maxAge: 1209600000,
          secure: process.env.NODE_ENV === 'production',
        })
        .json(success_message);
    } catch (err) {
      res.status(401).json({
        errors: [
          {
            code: 'SERVER_ERROR',
            message: err.message,
          },
        ],
      });
    }
  }
);

router.get('/me', authenticate, async (req, res) => {
  try {
    const { user_id } = req.session;
    const user = await User.findById({ _id: user_id }, { password: 0 });

    const success_message = createUserResponseData(user);

    res.json(success_message);
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          code: 'SERVER_ERROR',
          message: err.message,
        },
      ],
    });
  }
});

router.put('/logout', authenticate, async (req, res) => {
  try {
    const { session } = req;
    await session.expireToken(session.token);
    res.clearCookie('token');

    res.json({
      status: true,
      content: {
        message: 'You have been successfully logged out.',
      },
    });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          code: 'SERVER_ERROR',
          message: err.message,
        },
      ],
    });
  }
});

module.exports = router;
