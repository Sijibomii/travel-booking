const asyncHandler = require('express-async-handler')
const Trip = require('../models/statesModel');
const Park= require('../models/parkModels');
// desc: get a full list of all trips
// GET req to api/v1/trips/ 
//access public
const getTrips = asyncHandler(async(req, res) =>{
  const trips = await Trip.query();
  res.json(trips)
})

// desc: create a trip
// POST req to api/v1/trips/ 
//access admin
const addTrip = asyncHandler(async(req, res) =>{
  const { departure_point_id,
  arrival_point_id,
  description,
  price,
  buses_id,
  departure_time,
  arrival_time,
  duration_hours } = req.body
  try{
    if (departure_point_id && arrival_point_id){
      if(description.trim() && parseInt(price)!==NaN && arrival_time.trim() && departure_time.trim()){
        const trip = await Trip.query().findOne({
          departure_time,
        });
        //check for a trip with same arrival date and time to see if bus_id is the same
        if (trip.buses_id===buses_id){
          const error = new Error('This bus is already booked for a trip at this time');
          res.status(403);
          throw error;
        }
      }else{
        const error = new Error('Invalid inputs');
          res.status(403);
          throw error;
      }
    }else{
      const error = new Error('depature and arrival point cannot be empty');
      res.status(403);
      throw error;
    }
    //add the trip
     await Trip.query().insert({ departure_point_id,
      arrival_point_id,
      description,
      price,
      buses_id,
      departure_time,
      arrival_time,
      duration_hours });

    res.json({ departure_point_id,
      arrival_point_id,
      description,
      price,
      buses_id,
      departure_time,
      arrival_time,
      duration_hours });
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
})

// desc: search for a trip by description/ park name
// POST req to api/v1/trips/search?search= 
//access public
const searchForTrips = asyncHandler(async(req, res) =>{
  const filter=req.query.search
  const park= await Park.query().select('id').where('name','=',filter).first()
  console.log(park.id)
  const value='';
  if(park.id){
    value=park.id
  }else{
    value=''
  }
  const trips = await Trip.query()
  .select('id', 'arrival_point_id','departure_point_id','description','price','buses_id','departure_time','arrival_time','duration_hours')
  .where('description', '=', filter)
  .where('departure_point_id','=',value)
  .where('arrival_point_id','=',value)

  // //check how to query using the park name
  // res.json(trips)
})

// desc: update a trip
// PUT req to api/v1/trips/:id 
//access admin
const updateTrips =asyncHandler(async(req,res)=>{
  const trip = await Trip.query().findById(req.params.id)
  
  if (trip) {
    trip.departure_point_id = req.body.departure_point_id || trip.departure_point_id
    trip.arrival_point_id= req.body.arrival_point_id || trip.arrival_point_id
    trip.description= req.body.description || trip.description
    trip.price= req.body.price || trip.price
    trip.buses_id= req.body.buses_id || trip.buses_id
    trip.departure_time =req.body.departure_time || trip.departure_time
    trip.arrival_time=req.body.arrival_time || trip.arrival_time
    trip.duration_hours=req.body.duration_hours || trip.duration_hours
  }
  else{
    const error = new Error('Trip does not exist');
      res.status(403);
      throw error;
  }
  await Trip.query().findById(req.params.id).patch(trip);
    const updatedTrip = await State.query().findById(req.params.id).select('id', 'arrival_point_id','description','price','buses_id','departure_time','arrival_time','duration_hours')
    
    res.json(updatedTrip)
})

// desc: delete a trip
// DELETE req to api/v1/trips/:id 
//access admin
const deleteTrip = asyncHandler(async(req, res) =>{
  const trip = await Trip.query().findById(req.params.id)
  if (trip) {
    await Trip.query().deleteById(req.params.id);
   res.json({ message: 'Trip removed' })
 } else {
   res.status(404)
   throw new Error('Trip not found')
 }
})
module.exports={
  getTrips,
  addTrip,
  searchForTrips,
  updateTrips,
  deleteTrip
}