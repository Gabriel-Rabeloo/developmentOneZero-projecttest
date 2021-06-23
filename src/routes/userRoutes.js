const Router = require('koa-router');
const userController = require('../controllers/userController');

const router = new Router();

router.get('/users', userController.index);
router.post('/users', userController.store);

module.exports = router;
