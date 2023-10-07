const express = require('express');

const Member = require('../models/member');
const { authenticate } = require('../middleware/authenticate');
const { createMemberResponseData } = require('../utils/utils');
const {
  createMemberValidator,
  deleteMemberValidator,
} = require('../utils/memberValidator');
const { validatorMiddleware } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/',
  authenticate,
  createMemberValidator,
  validatorMiddleware,
  async (req, res) => {
    try {
      const { community, user, role } = req.body;
      const member = new Member({
        community,
        user,
        role,
      });

      await member.save();

      res.status(201).json(createMemberResponseData(member));
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

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findOne({ _id: id });
    if (!member) {
      throw {
        status: false,
        errors: [
          {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Member not found.',
          },
        ],
      };
    } else {
      const { user_id } = req.session;
      const owner = await Member.findOne(
        { user: user_id, community: member.community },
        { role: 1 }
      ).populate('role', { name: 1 });

      if (
        owner &&
        owner?.role?.name != 'Community Admin' &&
        owner?.role?.name != 'Community Moderator'
      ) {
        throw {
          status: false,
          errors: [
            {
              code: 'NOT_ALLOWED_ACCESS',
              message: 'You are not authorized to perform this action.',
            },
          ],
        };
      }
    }

    await Member.findByIdAndDelete({ _id: id });
    res.status(204).json({ status: true });
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
