const mapOrganisationEntity = async (orgEntity) => {
  if (!orgEntity) {
    return undefined;
  }
  return orgEntity.map((entity) => {
    return {
      id: entity.id,
      name: entity.name,
      urn: entity.URN,
      ukprn: entity.UKPRN,
    };
  })
};

module.exports = {
  mapOrganisationEntity,
};
