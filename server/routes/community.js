const express = require('express');
const slugify = require('slugify');

const Role = require('../models/role');
const Community = require('../models/community');
const User = require('../models/user');
const Member = require('../models/member');
const { authenticate } = require('../middleware/authenticate');
const { createCommunityResponseData } = require('../utils/utils');
const { createCommunityValidator } = require('../utils/communityValidator');
const { validatorMiddleware } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/',
  authenticate,
  createCommunityValidator,
  validatorMiddleware,
  async (req, res) => {
    try {
      const { name } = req.body;
      const { user_id } = req.session;
      const user = await User.findById({ _id: user_id }, { _id: 1 });
      const slug = slugify(name, { lower: true });

      const community = new Community({
        name,
        slug,
        owner: user._id,
      });
      await community.save();

      const role = await Role.findOne({ name: 'Community Admin' }, { _id: 1 });
      const member = new Member({
        community: community._id,
        user: user._id,
        role: role._id,
      });
      await member.save();

      res.status(200).json(createCommunityResponseData(community));
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

router.get('/', async (req, res) => {
  try {
    const communities = await Community.find(
      {},
      { name: 1, slug: 1, owner: 1, created_at: 1, updated_at: 1 }
    ).populate('owner', { _id: 1, name: 1 });

    const metaData = {
      total: communities.length,
      pages: Math.ceil(communities.length / 10),
      page: 1,
    };

    res.status(200).json({
      status: true,
      content: {
        meta: metaData,
        data: communities,
      },
    });
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
});

router.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findOne(
      { slug: id.toString() },
      { _id: 1 }
    );
    const members = await Member.find(
      { community: community._id },
      { community: 1, user: 1, role: 1, created_at: 1 }
    )
      .populate('user', { _id: 1, name: 1 })
      .populate('role', { _id: 1, name: 1 });

    const metaData = {
      total: members.length,
      pages: Math.ceil(members.length / 10),
      page: 1,
    };

    res.status(201).json({
      status: true,
      content: {
        meta: metaData,
        data: members,
      },
    });
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
});

router.get('/me/owner', authenticate, async (req, res) => {
  try {
    const { user_id } = req.session;
    const user = await User.findById({ _id: user_id }, { _id: 1 });

    const communities = await Community.find(
      { owner: user._id },
      { name: 1, slug: 1, owner: 1, created_at: 1, updated_at: 1 }
    );

    const metaData = {
      total: communities.length,
      pages: Math.ceil(communities.length / 10),
      page: 1,
    };

    res.status(200).json({
      status: true,
      content: {
        meta: metaData,
        data: communities,
      },
    });
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
});

router.get('/me/member', authenticate, async (req, res) => {
  try {
    const { user_id } = req.session;
    const member_of_communities = await Member.find(
      { user: user_id },
      { community: 1 }
    );

    const communities = await Community.find(
      { _id: { $in: member_of_communities.map((member) => member.community) } },
      { name: 1, slug: 1, owner: 1, created_at: 1, updated_at: 1 }
    ).populate('owner', { _id: 1, name: 1 });
    console.log(user_id);
    const metaData = {
      total: communities.length,
      pages: Math.ceil(communities.length / 10),
      page: 1,
    };

    res.status(200).json({
      status: true,
      content: {
        meta: metaData,
        data: communities,
      },
    });
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
});

module.exports = router;
