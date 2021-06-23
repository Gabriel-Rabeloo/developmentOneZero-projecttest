// Voce deve rodar os testes usando:  npm test
// Para testar a aplicação, rode: npm run dev

// mais infos
// https://github.com/ZijianHe/koa-router

// todas as configurações devem ser passadas via environment variables

const Koa = require('koa');
const Router = require('koa-router');

const koa = new Koa();
const router = new Router();

const homeRoutes = require('./routes/homeRoutes');
// Uma rota de exemplo simples aqui.
// As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
router.get('/users', async (ctx) => {
  ctx.status = 200;
  ctx.body = { total: 0, count: 0, rows: [] };
});

koa
  .use(router.routes())
  .use(homeRoutes.routes())
  .use(router.allowedMethods());

module.exports = koa;
