// Voce deve rodar os testes usando:  npm test
// Para testar a aplicação, rode: npm run dev

// mais infos
// https://github.com/ZijianHe/koa-router

// todas as configurações devem ser passadas via environment variables

const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyparser());

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');

app
  .use(homeRoutes.routes())
  .use(userRoutes.routes())
  .use(homeRoutes.allowedMethods());

module.exports = app;
