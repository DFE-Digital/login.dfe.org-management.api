'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const listOrganisations = require('./listOrganisations');

const router = express.Router();

const routes = () => {
  router.get('/', asyncWrapper(listOrganisations));

  return router;
};

module.exports = routes;
