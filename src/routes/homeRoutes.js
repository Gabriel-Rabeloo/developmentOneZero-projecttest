const Router = require('koa-router');
const homeController = require('../controllers/homeController');

const router = new Router();

// rota simples pra testar se o servidor está online
router.get('/', homeController.index);

module.exports = router;
