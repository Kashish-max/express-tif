const { check, param } = require('express-validator');
const Community = require('../models/community');
const User = require('../models/user');
const Role = require('../models/role');
const Member = require('../models/member');

exports.createMemberValidator = [
  check('community')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .custom((val, { req }) =>
      Community.findOne({ _id: val }).then((community) => {
        if (!community) {
          return Promise.reject({
            code: 'RESOURCE_NOT_FOUND',
            message: 'Community not found.',
          });
        } else {
          const { user_id } = req.session;
          if (user_id.toString() != community.owner.toString()) {
            return Promise.reject({
              code: 'NOT_ALLOWED_ACCESS',
              message: 'You are not authorized to perform this action.',
            });
          }
        }
        return true;
      })
    ),

  check('user')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .custom((val, { req }) =>
      User.findOne({ _id: val }).then((user) => {
        if (!user) {
          return Promise.reject({
            code: 'RESOURCE_NOT_FOUND',
            message: 'User not found.',
          });
        } else {
          return Member.findOne({
            community: req.body.community,
            user: val,
          }).then((member) => {
            if (member) {
              return Promise.reject({
                code: 'RESOURCE_EXISTS',
                message: 'User is already added in the community.',
              });
            }
            return true;
          });
        }
      })
    ),

  check('role')
    .notEmpty()
    .withMessage({ code: 'INVALID_INPUT', message: 'This field is required' })
    .custom((val) =>
      Role.findOne({ _id: val }).then((role) => {
        if (!role) {
          return Promise.reject({
            code: 'RESOURCE_NOT_FOUND',
            message: 'Role not found.',
          });
        }
        return true;
      })
    ),
];

exports.deleteMemberValidator = [
  param('id').custom((val, { req }) =>
    Member.findOne({ _id: val }).then((member) => {
      if (!member) {
        return Promise.reject({
          code: 'RESOURCE_NOT_FOUND',
          message: 'Member not found.',
        });
      } else {
        const { user_id } = req.session;
        Member.findOne({ _id: user_id, community: member.community }, { role: 1 }).populate('role', { name: 1 }).then((owner) => {
          if (
            owner.role.name != 'Community Admin' ||
            owner.role.name != 'Community Moderator'
          ) {
            return Promise.reject({
              code: 'NOT_ALLOWED_ACCESS',
              message: 'You are not authorized to perform this action.',
            });
          }  
        });
      }
      return true;
    })
  ),
];
