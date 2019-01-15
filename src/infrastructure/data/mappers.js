const { organisationCategory } = require('./organisationsRepository');

const mapOrganisationEntity = (orgEntity) => {
  if (!orgEntity) {
    return undefined;
  }
  return {
    id: orgEntity.id,
    name: orgEntity.name,
    urn: orgEntity.URN,
    category: organisationCategory.find(x => x.id === orgEntity.Category),
    legacyId: orgEntity.legacyId,
  };
};

module.exports = {
  mapOrganisationEntity,
};
