const { Model } = require('objection');

const tableNames = require('../../constants/tableNames');
const schema = require('../schemas/stateSchema.json');
const connection= require ('../../../backend/db/db')
Model.knex(connection)
class State extends Model {
  static get tableName() {
    return tableNames.state;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = State;
