const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isLength({ min: 2 })
    .withMessage({
      code: 'INVALID_INPUT',
      message: 'Name should be at least 2 characters.',
    }),

  check('email')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isEmail()
    .withMessage({ code: 'INVALID_INPUT', message: 'Invalid email address' })
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject({
            code: 'RESOURCE_EXISTS',
            message: 'User with this email address already exists.',
          });
        }
        return true;
      })
    ),

  check('password')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isLength({ min: 6 })
    .withMessage({
      code: 'INVALID_INPUT',
      message: 'Password should be at least 6 characters.',
    }),
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isEmail()
    .withMessage({ code: 'INVALID_INPUT', message: 'Invalid email address' }),

  check('password')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isLength({ min: 6 })
    .withMessage({
      code: 'INVALID_INPUT',
      message: 'Password should be at least 6 characters.',
    })
    .custom((password, { req }) =>
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return Promise.reject({
            code: 'INVALID_CREDENTIALS',
            message: 'The credentials you provided are invalid.',
          });
        } else {
          return bcrypt.compare(password, user.password).then((validated) => {
            if (!validated) {
              return Promise.reject({
                code: 'INVALID_CREDENTIALS',
                message: 'The credentials you provided are invalid.',
              });
            }
            return true;
          });
        }
      })
    ),
];
