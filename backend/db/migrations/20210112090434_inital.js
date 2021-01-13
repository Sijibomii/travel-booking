const tableNames= require('../../constants/tableNames')
const {
  addDefaultColumns,
  email, 
  references, 
} = require('../utils/tableUtils')

exports.up = async(knex)=> {
  //create all independent tables first
  await Promise.all([
    //user table
    knex.schema.createTable(tableNames.user, (table)=>{
      table.increments().notNullable();//for an automatically incremented ID fiels
      email(table, 'email').notNullable().unique();
      table.string('name').notNullable();
      table.double('phone_no').notNullable();
      table.boolean('is_admin').notNullable().default(false)
      table.string('password', 127).notNullable();
      table.datetime('last_login');
      addDefaultColumns(table);
    }),
    //states table
    knex.schema.createTable(tableNames.state, (table) => {
      table.increments().notNullable();
      table.string('name').notNullable().unique();
      table.string('code');
      addDefaultColumns(table);
    }),
    //buses table
    knex.schema.createTable(tableNames.buses, (table) => {
      table.increments().notNullable();
      table.integer('no_of_seats');
      table.string('plate_no');
      addDefaultColumns(table);
    }),
  ]);
  //create dependent tables next
  //seats
  await knex.schema.createTable(tableNames.seat, (table) => {
    table.increments().notNullable();
    references(table, 'buses', true);
    table.enu('status',['booked', 'pending', 'vacant']).defaultTo('vacant');
    addDefaultColumns(table);
  });
  //parks table
  await knex.schema.createTable(tableNames.park, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    references(table, 'state');
    addDefaultColumns(table);
  });
  //trips table
  await knex.schema.createTable(tableNames.trip, (table) => {
    table.increments().notNullable();
    references(table, 'park',true,'departure_point');
    references(table, 'park',true,'arrival_point');
    table.double('price').notNullable();
    references(table, 'buses', true);
    table.datetime('departure_time').notNullable();
    table.datetime('arrival_time').notNullable();
    table.double('duration_hours').notNullable();
    addDefaultColumns(table);
  });
  //tickets table
  await knex.schema.createTable(tableNames.ticket, (table) => {
    table.increments().notNullable();
    references(table, 'user', true);
    references(table, 'trip', true);
    references(table, 'seat', true);
    table.boolean('is_active');
    addDefaultColumns(table);
  });
  //cancellation table
  await knex.schema.createTable(tableNames.cancellation, (table) => {
    table.increments().notNullable();
    table.boolean('refunded');
    references(table,'user', true);
    references(table,'ticket', true);
    addDefaultColumns(table);
  });
};

exports.down = async (knex) =>{
  await Promise.all(
    [
      //drop them in descending order from the one you created last
      tableNames.cancellation,
      tableNames.ticket,
      tableNames.trip,
      tableNames.park,
      tableNames.seat,
      tableNames.state,
      tableNames.buses,
      tableNames.user
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};
