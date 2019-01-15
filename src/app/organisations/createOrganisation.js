'use strict';

const logger = require('./../../infrastructure/logger');
const uuid = require('uuid/v4');
const { addOrganisation, getNextOrganisationLegacyId, getOrgByUrn } = require('./../../infrastructure/data');

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

const createOrganisation = async (req, res) => {
  try {
    const organisation = mapOrganisation(req);
    const category = organisation.category ? organisation.category.id : undefined;
    const existingOrganisation = await getOrgByUrn(organisation.urn, category);
    if (existingOrganisation) {
      return res.status(409).send();
    }
    organisation.id = uuid();
    if (!organisation.legacyId) {
      organisation.legacyId = await getNextOrganisationLegacyId();
    }
    await addOrganisation(organisation);
    return res.status(201).send();
  } catch (e) {
    logger.error(e);
    res.status(500).send(e.message);
  }
};

module.exports = createOrganisation;
