const database = require('../database/index');

module.exports = async function connect() {
  try {
    return await database.sync();
  } catch (error) {
    return error;
  }
};
