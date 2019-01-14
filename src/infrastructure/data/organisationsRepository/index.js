'use strict';

const config = require('./../../config');

const { makeConnection } = require('./connection');
const organisations = require('./organisations');

const db = makeConnection();

const defineStatic = (model) => {

};

const buildDataModel = (model, connection, entityModels) => {
  const dbSchema = config.database.schema || 'services';

  // Define
  entityModels.forEach((entityModel) => {
    model[entityModel.name] = entityModel.define(db, dbSchema);
  });
  defineStatic(model);

  // Extend
  entityModels.filter(m => m.extend !== undefined).forEach((entityModel) => {
    entityModel.extend(model);
  });
};

const dataModel = {};
buildDataModel(dataModel, db, [
  organisations,
]);

module.exports = dataModel;
