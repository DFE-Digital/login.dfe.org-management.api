'use strict';

const config = require('./../../config');

const { makeConnection } = require('./connection');
const organisations = require('./organisations');
const countersModel = require('./counters');

const db = makeConnection();

const defineStatic = (model) => {
  model.organisationCategory = [
    { id: '001', name: 'Establishment' },
    { id: '002', name: 'Local Authority' },
    { id: '003', name: 'Other Legacy Organisations' },
    { id: '004', name: 'Early Year Setting' },
    { id: '008', name: 'Other Stakeholders' },
    { id: '009', name: 'Training Providers' },
    { id: '010', name: 'Multi-Academy Trust' },
    { id: '011', name: 'Government' },
    { id: '012', name: 'Other GIAS Stakeholder' },
    { id: '013', name: 'Single-Academy Trust' },
  ];
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
  countersModel,
]);

module.exports = dataModel;
