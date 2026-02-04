const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const generateToken = (id, tenantId, role) => {
  return jwt.sign(
    { id, tenantId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, 'Please provide username and password'));
  }

  const user = await User.findOne({ username }).select('+password').populate('tenant');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError(401, 'Invalid username or password'));
  }

  const token = generateToken(user._id, user.tenant._id, user.role);

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant._id,
          name: user.tenant.name
        }
      }
    }
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('tenant');

  res.status(200).json({
    success: true,
    data: { user }
  });
});