const Session = require('../models/session');

const initSession = async (user_id) => {
  const token = await Session.generateToken();
  const session = new Session({ token, user_id });
  await session.save();
  return session;
};

const createRoleResponseData = (role) => {
  return {
    status: true,
    content: {
      data: {
        _id: role._id,
        name: role.name,
        created_at: role.created_at,
        updated_at: role.updated_at,
      },
    },
  };
};

const createUserResponseData = (user) => {
  return {
    status: true,
    content: {
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    },
  };
};

const createCommunityResponseData = (community) => {
  return {
    status: true,
    content: {
      data: {
        _id: community._id,
        name: community.name,
        slug: community.slug,
        owner: community.owner,
        created_at: community.created_at,
        updated_at: community.updated_at,
      },
    },
  };
};

const createMemberResponseData = (member) => {
  return {
    status: true,
    content: {
      data: {
        _id: member._id,
        community: member.community,
        user: member.user,
        role: member.role,
        created_at: member.created_at,
      },
    },
  };
};

module.exports = {
  initSession,
  createRoleResponseData,
  createUserResponseData,
  createCommunityResponseData,
  createMemberResponseData,
};
