const { organisations } = require('./organisationsRepository');
const { mapOrganisationEntity } = require('./mappers');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

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

const search = async (criteria, pageNumber = 1, pageSize = 25) => {
  const offset = (pageNumber - 1) * pageSize;
  const query = {
    where: {
      [Op.or]: {
        name: {
          [Op.like]: `%${criteria}%`,
        },
        urn: {
          [Op.like]: `%${criteria}%`,
        },
        ukprn: {
          [Op.like]: `%${criteria}%`,
        },
      },
    },
    order: [
      ['name', 'ASC'],
    ],
    limit: pageSize,
    offset,
  };
  const result = await organisations.findAndCountAll(query);
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
  search
};
