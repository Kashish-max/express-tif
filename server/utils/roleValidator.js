const { check } = require('express-validator');
const Role = require('../models/role');

exports.createRoleValidator = [
  check('name')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isLength({ min: 2 })
    .withMessage({
      code: 'INVALID_INPUT',
      message: 'Name should be at least 2 characters.',
    })
    .custom((val) =>
      Role.findOne({ name: val }).then((role) => {
        if (role) {
          return Promise.reject({
            code: 'RESOURCE_EXISTS',
            message: 'Role already exists.',
          });
        }
        return true;
      })
    ),
];
