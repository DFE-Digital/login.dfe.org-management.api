const { organisations, counters } = require('./organisationsRepository');
const { mapOrganisationEntity } = require('./mappers');
const Sequelize = require('sequelize');
const logger = require('./../../infrastructure/logger');

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
  const orgs = await result.rows.map(mapOrganisationEntity);
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
      },
    },
    order: [
      ['name', 'ASC'],
    ],
    limit: pageSize,
    offset,
  };
  const result = await organisations.findAndCountAll(query);
  const orgs = await result.rows.map(mapOrganisationEntity);
  const totalNumberOfRecords = result.count;
  const totalNumberOfPages = Math.ceil(totalNumberOfRecords / pageSize);
  return {
    organisations: orgs,
    totalNumberOfPages,
    totalNumberOfRecords,
  }
};

const addOrganisation = async (organisation) => {
  const entity = {
    id: organisation.id,
    name: organisation.name,
    URN: organisation.urn,
    Category: organisation.category.id,
    legacyId: organisation.legacyId,
  };
  await organisations.create(entity);
};

const getOrgById = async (id) => {
  const entity = await organisations.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
    },
  });
  const org = await mapOrganisationEntity(entity);
  return org;
};

const getNextOrganisationLegacyId = async () => {
  const entity = await counters.findOne({
    where: {
      counter_name: {
        [Op.eq]: 'organisation_legacyid',
      },
    },
  });
  const next = parseInt(entity.next_value);
  await entity.update({
    next_value: next + 1,
  });
  return next;
};

const getOrgByUrn = async (urn, category) => {
  try {
    const query = {
      where: {
        URN: {
          [Op.eq]: urn,
        },
      },
    };
    if (category) {
      query.where.Category = {
        [Op.eq]: category,
      };
    }
    const entity = await organisations.findOne(query);
    return mapOrganisationEntity(entity);
  } catch (e) {
    logger.error(`error getting organisation by urn - ${e.message}`, e);
    throw e;
  }
};

const updateOrganisation = async (existingOrganisation, organisation) => {
  const existing = await organisations.findOne({
    where: {
      id:
        {
          [Op.eq]: existingOrganisation.id,
        },
    },
  });

  if (!existing) {
    throw new Error(`Cannot find organisation in database with id ${organisation.id}`);
  }
  await existing.update({
    id: organisation.id,
    name: organisation.name,
    URN: organisation.urn,
    Category: organisation.category.id,
    legacyId: organisation.legacyId,
  })
};

module.exports = {
  getPagedList,
  search,
  addOrganisation,
  getOrgById,
  getNextOrganisationLegacyId,
  getOrgByUrn,
  updateOrganisation
};
