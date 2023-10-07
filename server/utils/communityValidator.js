const { check } = require('express-validator');
const slugify = require('slugify');
const Community = require('../models/community');

exports.createCommunityValidator = [
  check('name')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .isLength({ min: 2 })
    .withMessage({
      code: 'INVALID_INPUT',
      message: 'Name should be at least 2 characters.',
    })
    .custom((val) =>
      Community.findOne({ slug: slugify(val, { lower: true }) }).then(
        (community) => {
          if (community) {
            return Promise.reject({
              code: 'RESOURCE_EXISTS',
              message: 'Community with this name already exists.',
            });
          }
          return true;
        }
      )
    ),
];
