const Sequelize = require('sequelize').default;

const define = (db, schema) => {
  return db.define('organisation', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    URN: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    UKPRN: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }, {
      timestamps: false,
      tableName: 'organisation',
      schema,
    })
};

const extend = () => {
};

module.exports = {
  name: 'organisations',
  define,
  extend,
};
