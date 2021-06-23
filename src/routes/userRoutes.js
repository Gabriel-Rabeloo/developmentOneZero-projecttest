const Router = require('koa-router');
const userController = require('../controllers/userController');

const router = new Router();

router.get('/users', userController.show);
router.post('/users', userController.store);

module.exports = router;
