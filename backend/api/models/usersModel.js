const { Model } = require('objection');

const tableNames = require('../../constants/tableNames');
const schema = require('../schemas/userSchema.json');
const connection= require ('../../../backend/db/db')
Model.knex(connection)
class User extends Model {
  static get tableName() {
    return tableNames.user;
  }

  static get jsonSchema() {
    return schema;
  }
}

module.exports = User;
