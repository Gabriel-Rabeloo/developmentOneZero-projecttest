const User = require('../../src/models/User');

async function createFive() {
  for (let i = 0; i < 5; i++) {
    (async () => {
      await User.create({ name: `raupp${i}`, email: `teste${i}@email.com`, age: 30 });
    })().then(() => {
    });
  }
}

module.exports = createFive;
