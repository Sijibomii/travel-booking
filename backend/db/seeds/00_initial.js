const bcrypt = require('bcrypt');
const tableNames=require('../../constants/tableNames')
const stateNames=require('../../constants/states');
var config      = require('../../../knexfile');
var env         = 'development';
const Knex = require('knex')(config[env]);;
exports.seed = async(knex) =>{
  await Promise.all(Object.keys(tableNames).map((name) => knex(name).del()));
  //insert a user
  const password='adminpass123';
  const user = {
    email: 'siji@null.computer',
    name: 'CJ',
    phone_no: 0903423323,
    password: await bcrypt.hash(password, 12),
  };
  const [createdUser] = await knex(tableNames.user).insert(user).returning('*');
  console.log('User Created :', createdUser)
  //console.log(stateNames)
   //insert states
   const createdStates=await Knex(tableNames.state).insert(stateNames).returning('*');
   console.log('States Created :', createdStates)
  
  //insert buses
};
