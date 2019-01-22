'use strict';
const logger = require('./../../infrastructure/logger');
const { updateOrganisation, getOrgById } = require('./../../infrastructure/data');

const validate = async (req) => {
  const model = {
    id: req.params.id,
    errors: [],
  };
  if (!model.id) {
    model.errors.push('Must specify organisation id');
  }
  return model;
};

const mapOrganisation = (req) => {
  return {
    name: req.body.name,
    urn: req.body.urn,
    category: {
      id: req.body.category.id,
    },
    legacyId: req.body.legacyId,
  }
};

const updateOrg = async (req, res) => {
  const correlationId = req.correlationId;
  const model = await validate(req);
  const organisation = mapOrganisation(req);

  try {
    if (model.errors.length > 0) {
      return res.status(400).send({details: model.errors});
    }
    const existingOrg = await getOrgById(req.params.id);
    if (!existingOrg) {
      return res.status(404).send();
    }
    await updateOrganisation(existingOrg, organisation);
    return res.status(202).send();
  } catch (e) {
    logger.error(`Error updating organisation ${id} (correlation id: ${correlationId} - ${e.message}`, {
      correlationId,
      stack: e.stack,
    });
    throw e;
  }
};

module.exports = updateOrg;
