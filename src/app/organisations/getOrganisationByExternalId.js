'use strict';
const { getOrgByUrn } = require('./../../infrastructure/data');

const getOrganisationByExternalId = async (req, res) => {
  if (!req.params.id || !req.params.type) {
    return res.status(403).send();
  }
  let organisation;

  if(req.params.type === '004') {
    organisation = await getOrgByUrn(req.params.id)
  }

  if (organisation) {
    return res.contentType('json').send(organisation);
  }
  return res.status(404).send();
};

module.exports = getOrganisationByExternalId;
