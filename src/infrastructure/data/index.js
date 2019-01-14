const { organisations } = require('./organisationsRepository');
const { mapOrganisationEntity } = require('./mappers');

const getPagedList =  async (pageNumber = 1, pageSize = 25) => {
  const offset = (pageNumber - 1) * pageSize;
  const result = await organisations.findAndCountAll({
    order: [
      ['name', 'ASC'],
    ],
    limit: pageSize,
    offset
  });
  const orgs = await mapOrganisationEntity(result.rows);
  const totalNumberOfRecords = result.count;
  const totalNumberOfPages = Math.ceil(totalNumberOfRecords / pageSize);
  return {
    organisations: orgs,
    totalNumberOfPages,
    totalNumberOfRecords,
  }
};

module.exports = {
  getPagedList,
};
