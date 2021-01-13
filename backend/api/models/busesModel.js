const { Model } = require('objection');

const tableNames = require('../../constants/tableNames');
const schema = require('../schemas/busesSchema.json');
const connection= require ('../../../backend/db/db')
Model.knex(connection)
class Buses extends Model {
  static get tableName() {
    return tableNames.buses;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Buses;
