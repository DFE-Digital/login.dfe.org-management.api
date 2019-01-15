const { getOrgById } = require('./../../infrastructure/data');

const getOrganisation = async (req, res) => {
  const organisation = await getOrgById(req.params.id);
  if (!organisation) {
    return res.status(404).send();
  }
  return res.json(organisation);
};

module.exports = getOrganisation;
