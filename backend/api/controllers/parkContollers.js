const asyncHandler = require('express-async-handler');
const Park = require('../models/parkModels');

// desc: get a full list of all parks
// GET req to api/v1/parks/ 
//access Admin
const getParks = asyncHandler(async(req, res) =>{
  const park = await Park.query();
  res.json(park)
})
// desc: create a new park
// POST req to api/v1/parks/ 
//access Admin
const createPark = asyncHandler(async(req, res) =>{
  const { name, state_id } = req.body
  try{
    if (name.trim() && name!==null && state_id!==null){
      //check if the state already exist
      const park = await Park.query().findOne({
        name,
        state_id
      });
      if (park){
        const error = new Error('This Park already exists');
        res.status(403);
        throw error;
      }
    }else{
      const error = new Error('Name and state id cannot be empty');
      res.status(403);
      throw error;
    }
    //add the park
     await Park.query().insert({
      name,
      state_id
    });

    res.json({
     name,
     state_id
    });
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
})
// desc: upadate a new park
// PUT req to api/v1/parks/:id
//access Admin
const updatePark = asyncHandler(async(req, res) =>{
  const park = await Park.query().findById(req.params.id)

  if (park) {
    park.name = req.body.name || park.name
    park.state_id= req.body.state_id || park.state_id
  }
  else{
    const error = new Error('Park does not exist');
      res.status(403);
      throw error;
  }
  await Park.query().findById(req.params.id).patch(park);
    const updatedPark = await Park.query().findById(req.params.id).select('*')
    
    res.json(updatedPark)
})
// desc: delete a new park
// DELETE req to api/v1/parks/:id
//access Admin
const deletePark = asyncHandler(async(req, res) =>{
  const park = await Park.query().findById(req.params.id)
  if (park) {
    await Park.query().deleteById(req.params.id);
   res.json({ message: 'Park removed' })
 } else {
   res.status(404)
   throw new Error('Park not found')
 }
})
module.exports={
  getParks,
  createPark,
  updatePark,
  deletePark
}