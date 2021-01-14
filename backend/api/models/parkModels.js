const { Model } = require('objection');

const tableNames = require('../../constants/tableNames');
const schema = require('../schemas/parkSchemas.json');
const connection= require ('../../../backend/db/db')
Model.knex(connection)
class Park extends Model {
  static get tableName() {
    return tableNames.park;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = Park;
