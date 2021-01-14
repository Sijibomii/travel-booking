const asyncHandler = require('express-async-handler');
const Seats = require('../models/seatsModel');

// desc: get a full list of all seats
// GET req to api/v1/seats/ 
//access Admin
const getSeats = asyncHandler(async(req, res) =>{
  const seats = await Seats.query();
  res.json(seats)
})
// desc: get a full list of all seats in a bus
// GET req to api/v1/seats/bus/:id
//access public
const getSeatsByBus = asyncHandler(async(req, res) =>{
  const bus = req.params.id
  //return them in order of id
  try{
  const seats = await Seats.query().select('id', 'status','buses_id','user_id','pending_id').where('buses_id', '=', bus).orderBy('id');
  if(!seats){
    const error = new Error('Bus does not exist');
      res.status(403);
      throw error;
  }
  res.json(seats)
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
})

const declareEmpty = asyncHandler(async(id)=>{
 
  try{
    const getSeatValue=await Seats.query().findById(id).select('status','pending_id','user_id');
    if(getSeatValue.status!=='booked' && getSeatValue.user_id==null){
      // declare empty
      console.log('declaring.....')
     await Seats.query().findById(id).patch({status: 'vacant', pending_id: null});
      console.log('declared!')
      const newww=await Seats.query().findById(id)
      console.log(newww)
    }
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
});
// desc: change a seats value
// POST req to api/v1/seats/pending/:id
//access private
const changeSeatStatusToPending = asyncHandler(async(req, res) =>{
  // const value=req.query.value;
  const seat= req.params.id;
  try{
    const getSeatValue=await Seats.query().findById(seat).select('status','pending_id','user_id');
    if(getSeatValue.status==='booked' || getSeatValue.user_id!==null){
      const error = new Error('Seat already booked');
      res.status(403);
      throw error;
    }else{
      if(getSeatValue.pending_id!==null){
        const error = new Error('Seat is temporarily assigned to someone come back in 10minutes');
        res.status(403);
        throw error;
      }
    }
    const seatUpdated = await Seats.query().findById(seat).patch({status: 'pending', pending_id: req.user.id});
    const seatss=await Seats.query().findById(seat)
    console.log(seatss)
    console.log(seatUpdated)
    res.json({
      'message': 'seat has been temporarily assigned to you'
    })
    //declare the seat empty after 10min if seat doesn't become booked(currently set to 5secs)
    setTimeout(function() {
      declareEmpty(req.params.id);
  }, 5000);
  
  }catch(error){
    res.status(400)
    throw new Error(error)
  }
})

// desc: get a full list of all seats by their status
// GET req to api/v1/seats?status
//access Admin
const getSeatsByStatus = asyncHandler(async(req, res) =>{
  if(!req.query.status){
    const error = new Error('Add a status query');
        res.status(403);
        throw error;
  }
  const status=req.query.status
  const seats = await Seats.query().select('id', 'status','buses_id','user_id','pending_id').where('status', '=', status).orderBy('id');;
  res.json(seats)
})

module.exports={
  getSeats,
  getSeatsByBus,
  changeSeatStatusToPending,
  getSeatsByStatus
}