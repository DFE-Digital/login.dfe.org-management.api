'use strict';
const { deleteOrganisation } = require('./../../infrastructure/data');

const deleteOrg = async (req, res) => {
  const orgId = req.params.id;

  await deleteOrganisation(orgId, req.correlationId);
  return res.status(204).send();
};

module.exports = deleteOrg;
