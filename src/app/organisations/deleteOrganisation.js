'use strict';
const { deleteOrganisation } = require('./../../infrastructure/data');
const logger = require('./../../infrastructure/logger');

const deleteOrg = async (req, res) => {
  const correlationId = req.correlationId;
  const orgId = req.params.id;

  logger.info(`Deleting organisation with id ${orgId} (correlation id: ${correlationId})`, {correlationId});
  try {
    await deleteOrganisation(orgId, correlationId);
    return res.status(204).send();
  } catch (e) {
    logger.error(`Error deleting organisation with id ${req.params.id} (correlation id: ${correlationId}) - ${e.message}`, {
      correlationId,
      stack: e.stack,
    });
    throw e;
  }
};

module.exports = deleteOrg;
