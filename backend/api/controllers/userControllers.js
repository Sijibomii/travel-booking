const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

//create a generate token futions in utils file
//create a private and admin middleware


// desc: Auth the user and get a token
// POST req to api/v1/users/login 
//access public
const authUser = asyncHandler(async(req, res) =>{
  const  { email, password}= req.body
 // gets the user that has that email
 try {
  const user = await User.query().where({ email }).first();
  if (!user) {
    const error = new Error('invalid login credentials');
    res.status(403);
    throw error;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new Error('invalid login credentials');
    res.status(403);
    throw error;
  }
  const payload = {
    id: user.id,
    name: user.name,
    email,
    phone: user.phone_no,
    isAdmin: user.is_admin,
  };
  const token = await generateToken.sign(payload);
  res.json({
    user: payload,
    token,
  });
} catch (error) {
  res.status(400)
  throw new Error(error)
}
 })
 function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePassword(password){
  const re= /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  return re.test(String(password))
}

// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email,phone_no, password } = req.body
  try {
    if(name!=='' && phone_no!==null){
      //match email to a regex
      if(validateEmail(email)){
        if(validatePassword(password)){
         
        }
        else{
          const error = new Error('Password  not strong enough');
          res.status(403);
          throw error;
        }
      }else{
        const error = new Error('Not a valid email');
        res.status(403);
        throw error;
      }
      
    }else{
      const error = new Error('Name or Phone Number cannot be empty');
      res.status(403);
      throw error;
    }
    const existingUser = await User.query().where({ email }).first();
    if (existingUser) {
      const error = new Error('Email is already in use. Please Login');
      res.status(403);
      throw error;
    }
    
    // TODO: get rounds from config
    const hashedPassword = await bcrypt.hash(password, 12);
    const insertedUser = await User.query().insert({
      name,
      email,
      phone_no,
      password: hashedPassword,
      is_admin:false
    });
    delete insertedUser.password;
    const payload = {
      id: insertedUser.id,
      name,
      email,
      phone_no,
      isAdmin: insertedUser.is_admin
    };
    const token = await generateToken.sign(payload);
    res.json({
      user: payload,
      token,
    });
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
  
})

// desc: Get a users profile
// POST req to api/v1/users/profile
//access Private
const getUserProfile = asyncHandler(async (req, res) => {
  //console.log(req.user.id)
  //const user = await User.query().findById(req.user.id)
  const user=req.user
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.query().findById(req.user.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone_no= req.body.phone_no || user.phone_no
    if (req.body.password) {
      user.password = req.body.password
    }

    await User.query().findById(req.user.id).patch(user);
    const updatedUser = await User.query().findById(req.user.id).select('id', 'email', 'name','phone_no','is_admin')
    //console.log(updatedUser)
    const payload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone_no: updatedUser.phone_no,
      isAdmin: updatedUser.is_admin
    };
    const token = await generateToken.sign(payload);
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      phone_no: updatedUser.phone_no,
      email: updatedUser.email,
      isAdmin: updatedUser.is_admin,
      token: token,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.query();
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.query().findById(req.params.id)

  if (user) {
     await User.query().deleteById(req.params.id);
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.query().findById(req.params.id).select('id', 'email', 'name','phone_no','is_admin')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.query().findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.is_admin = req.body.is_admin

    await User.query().findById(req.user.id).patch(user);
    const updatedUser = await User.query().findById(req.user.id).select('id', 'email', 'name','phone_no','is_admin')
    //const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone_no: updatedUser.phone_no,
      isAdmin: updatedUser.is_admin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
module.exports={
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}