const Router = require('koa-router');
const userController = require('../controllers/userController');

const router = new Router();

router.get('/users', userController.show);
router.post('/user', userController.store);
router.put('/user/:name', userController.update);

module.exports = router;
