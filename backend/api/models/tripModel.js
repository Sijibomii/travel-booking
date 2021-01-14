const { Model } = require('objection');

const tableNames = require('../../constants/tableNames');
const schema = require('../schemas/tripSchema.json');
const connection= require ('../../../backend/db/db')
Model.knex(connection)
class Trip extends Model {
  static get tableName() {
    return tableNames.trip;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Trip;
