const express = require('express');

const Role = require('../models/role');
const { createRoleResponseData } = require('../utils/utils');
const { createRoleValidator } = require('../utils/roleValidator');
const { validatorMiddleware } = require('../middleware/validator');

const router = express.Router();

router.post('/', createRoleValidator, validatorMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const role = new Role({ name });
    await role.save();

    res.status(201).json(createRoleResponseData(role));
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

router.get('/', async (req, res) => {
  try {
    const roles = await Role.find(
      {},
      { name: 1, created_at: 1, updated_at: 1 }
    );

    const metaData = {
      total: roles.length,
      pages: Math.ceil(roles.length / 10),
      page: 1,
    };

    res.status(200).json({
      status: true,
      content: {
        meta: metaData,
        data: roles,
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
