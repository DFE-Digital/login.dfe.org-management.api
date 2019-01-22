const { getOrgById } = require('./../../infrastructure/data');
const logger = require('./../../infrastructure/logger');

const getOrganisation = async (req, res) => {
  const correlationId = req.correlationId;
  logger.info(`Getting organisation with id ${req.params.id} (correlation id: ${correlationId})`, {correlationId});
  try {
    const organisation = await getOrgById(req.params.id);
    if (!organisation) {
      return res.status(404).send();
    }
    return res.json(organisation);
  } catch (e) {
    logger.error(`Error getting organisation with id ${req.params.id} (correlation id: ${correlationId}) - ${e.message}`, {
      correlationId,
      stack: e.stack,
    });
    throw e;
  }
};

module.exports = getOrganisation;
