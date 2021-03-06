'use strict';
const logger = require('./../../infrastructure/logger');
const { getPagedList, search } = require('./../../infrastructure/data');

const getPageNumber = (req) => {
  if (!req.query.page) {
    return 1;
  }

  const page = parseInt(req.query.page);
  if (isNaN(page)) {
    return 1;
  }
  return page;
};

const listOrganisations = async (req, res) => {
  const correlationId = req.correlationId;
  const pageSize = 25;
  const pageNumber = getPageNumber(req);
  const criteria = req.query.search;

  logger.info(`Getting page ${pageNumber} with criteria ${criteria} of organisations (correlation id: ${correlationId})`, { correlationId });
  try {
    let page;
    if (criteria !== undefined && (criteria.trim().length > 0)) {
      page = await search(criteria, pageNumber, pageSize);
    } else {
      page = await getPagedList(pageNumber, pageSize);
    }

    return res.json({
      organisations: page.organisations,
      page: pageNumber,
      totalNumberOfPages: page.totalNumberOfPages,
      totalNumberOfRecords: page.totalNumberOfRecords,
    });
  } catch (e) {
    logger.error(`Error getting page ${pageNumber} of organisations (correlation id: ${correlationId}) - ${e.message}`, {
      correlationId,
      stack: e.stack
    });
    throw e;
  }
};

module.exports = listOrganisations;
