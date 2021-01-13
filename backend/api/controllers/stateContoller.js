const asyncHandler = require('express-async-handler')
const State = require('../models/statesModel');

// desc: get a full list of all states
// GET req to api/v1/states/ 
//access public
const getStates = asyncHandler(async(req, res) =>{
  const states = await State.query();
  res.json(states)
})
// desc: get a state by id
// GET req to api/v1/states/:id
//access public
const getState = asyncHandler(async(req, res) =>{
  const state = await State.query().findById(req.params.id);
  res.json(state)
})

// desc: insert a new state
// POST req to api/v1/states/ 
//access Admin
const addState = asyncHandler(async(req, res) =>{
  const { name, code } = req.body
  try{
    if (name.trim() && code.trim()){
      //check if the state already exist
      const state = await State.query().findOne({
        name,
      });
      if (state){
        const error = new Error('This state already exists');
        res.status(403);
        throw error;
      }
    }else{
      const error = new Error('Name and code cannot be empty');
      res.status(403);
      throw error;
    }
    //add the state
     await State.query().insert({
      name,
      code
    });

    res.json({
     name,
     code
    });
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
})

// desc: update a  state
// PUT req to api/v1/states/:id 
//access Admin
const updateState = asyncHandler(async(req, res) =>{
  const state = await State.query().findById(req.params.id)

  if (state) {
    state.name = req.body.name || state.name
   state.code= req.body.code || state.code
  }
  else{
    const error = new Error('State does not exist');
      res.status(403);
      throw error;
  }
  await State.query().findById(req.params.id).patch(user);
    const updatedState = await State.query().findById(req.params.id).select('*')
    
    res.json(updatedState)
})


// desc: delete a  state
// DELETE req to api/v1/states/:id 
//access Admin
const deleteState = asyncHandler(async(req, res) =>{
  const state = await State.query().findById(req.params.id)
  if (state) {
    await State.query().deleteById(req.params.id);
   res.json({ message: 'State removed' })
 } else {
   res.status(404)
   throw new Error('State not found')
 }
})
module.exports={
  getState,
  getStates,
  addState,
  updateState,
  deleteState,
}