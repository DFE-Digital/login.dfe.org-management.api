'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const listOrganisations = require('./listOrganisations');
const createOrganisation = require('./createOrganisation');
const getOrganisation = require('./getOrganisation');
const updateOrganisation = require('./updateOrganisation');
const deleteOrganisation = require('./deleteOrganisation');
const router = express.Router();

const routes = () => {
  router.get('/', asyncWrapper(listOrganisations));
  router.post('/', asyncWrapper(createOrganisation));

  router.get('/:id', asyncWrapper(getOrganisation));
  router.put('/:id', asyncWrapper(updateOrganisation));
  router.delete('/:id', asyncWrapper(deleteOrganisation));

  return router;
};

module.exports = routes;
