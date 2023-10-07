const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  const error_messages = errors.array().map((err) => {
    return {
      param: err.path,
      message: err.msg.message,
      code: err.msg.code,
    };
  });
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: error_messages,
    });
  }
  next();
};

module.exports = { validatorMiddleware };
