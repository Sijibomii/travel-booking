const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel');

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (//checks for a token and check the Bearer keyword
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      //check to make sure deleted at is null
      req.user = await User.query().findById(decoded.id).select('id', 'email', 'name','phone_no','is_admin');
      
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})
const admin = (req, res, next) => {

  if (req.user && req.user.is_admin) {
    next()
  } else {  
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

module.exports= { protect, admin }
