const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./infrastructure/logger');
const https = require('https');
const config = require('./infrastructure/config');
const helmet = require('helmet');
const healthCheck = require('login.dfe.healthcheck');
const { getErrorHandler } = require('login.dfe.express-error-handling');
const registerRoutes = require('./routes');
const apiAuth = require('login.dfe.api.auth');

const app = express();
app.use(helmet({
  noCache: true,
  frameguard: {
    action: 'deny',
  },
}));

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.correlationId = req.get('x-correlation-id') || `accci-${Date.now()}`;
  next();
});


app.use('/healthcheck', healthCheck({
  config,
}));

if (config.hostingEnvironment.env !== 'dev') {
  app.use(apiAuth(app, config));
}

registerRoutes(app);

// Error handing
app.use(getErrorHandler({
  logger,
}));

if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  const options = {
    key: config.hostingEnvironment.sslKey,
    cert: config.hostingEnvironment.sslCert,
    requestCert: false,
    rejectUnauthorized: false,
  };
  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port} with config:\n${JSON.stringify(config)}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
  });
}
