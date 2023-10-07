const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

const RoleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 64,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Role', RoleSchema);
