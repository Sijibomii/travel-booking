const { Model } = require('objection');

const tableNames = require('../../constants/tableNames');
const schema = require('../schemas/seatsSchema.json');
const connection= require ('../../../backend/db/db')
Model.knex(connection)
class Seat extends Model {
  static get tableName() {
    return tableNames.seat;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Seat;
