(async () => {
  const database = require('./db');

  try {
    const resultado = await database.sync();
    // console.log("resultado ",resultado);
  } catch (error) {
    // console.log(error);
  }
})();
