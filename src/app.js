// Voce deve rodar os testes usando:  npm test
// Para testar a aplicação, rode: npm run dev

// mais infos
// https://github.com/ZijianHe/koa-router

// todas as configurações devem ser passadas via environment variables

const Koa = require('koa');

const koa = new Koa();

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');

koa
  .use(homeRoutes.routes())
  .use(userRoutes.routes())
  .use(homeRoutes.allowedMethods());

module.exports = koa;
