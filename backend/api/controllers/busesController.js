const asyncHandler = require('express-async-handler');
const Buses = require('../models/busesModel');
const Seats = require('../models/seatsModel');
// desc: get a full list of all buses
// GET req to api/v1/buses/ 
//access public
const getBuses = asyncHandler(async(req, res) =>{
  const buses = await Buses.query();
  res.json(buses)
})

// desc: get a bus by Id
// GET req to api/v1/buses/:id
//access public
const getBus = asyncHandler(async(req, res) =>{
  const bus = await Buses.query().findById(req.params.id);
  res.json(bus)
})
// desc: insert a new bus
// POST req to api/v1/buses/ 
//access Admin
const addBus = asyncHandler(async(req, res) =>{
  const {no_of_seats, plate_no}=req.body

  try{
    if(no_of_seats!==null && plate_no.trim()){
     //check using plate number to see if that bus exist
     const bus = await Buses.query().findOne({
      plate_no,
    });
    if(bus){
      const error = new Error('Bus already exist');
      res.status(403);
      throw error;
    }
    }else{
      const error = new Error('Enter valid values');
      res.status(403);
      throw error;
    }
    //create the bus first
    await Buses.query().insert({
     no_of_seats,
     plate_no
    });
    const bus = await Buses.query().findOne({
      plate_no,
    });
  // if it doesnt create the seats using the number of seats
    for (let i=0; i<parseInt(no_of_seats); i++){
      console.log('heree')
      await Seats.query().insert({
       buses_id: bus.id
      });
    }
    console.log('done creating seats')
    res.json(bus)
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
})
// desc: update a  bus
// PUT req to api/v1/buses/:id 
//access Admin
const updateBuses = asyncHandler(async(req, res) =>{
  const bus = await Buses.query().findById(req.params.id)

  if (bus) {
    bus.no_of_seats = req.body.no_of_seats|| bus.no_of_seats,
    bus.plate_no= req.body.plate_no || bus.plate_no
  }
  else{
    const error = new Error('Bus does not exist');
      res.status(403);
      throw error;
  }
  //delete all seats associated with this bus and
    await Seats.query().delete().where('buses_id', '=', bus.id);
  // re create 
  for (let i=0; i<parseInt(bus.no_of_seats); i++){
    await Seats.query().insert({
     buses_id: bus.id
    });
  }
   await Buses.query().findById(req.params.id).patch(bus);
     const updatedBus = await Buses.query().findById(req.params.id).select('*')
    
     res.json(updatedBus)
})

// desc: delete a  bus
// DELETE req to api/v1/buses/:id 
//access Admin
const deleteBus = asyncHandler(async(req, res) =>{
  const bus = await Buses.query().findById(req.params.id)
  if (bus) {
    await Buses.query().deleteById(req.params.id);
   res.json({ message: 'Bus removed' })
 } else {
   res.status(404)
   throw new Error('Bus not found')
 }
})
module.exports={
  getBuses,
  getBus,
  addBus,
  updateBuses,
  deleteBus
}
