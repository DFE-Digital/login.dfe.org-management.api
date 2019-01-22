const organisations = require('./app/organisations');

const registerRoutes = (app) => {
  app.use('/organisations', organisations());
};

module.exports = registerRoutes;
