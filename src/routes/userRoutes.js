const Router = require('koa-router');
const userController = require('../controllers/userController');

const router = new Router();

router.get('/users', userController.show);
router.post('/user', userController.store);
router.put('/user/:name', userController.update);
router.delete('/user/:name', userController.delete);
router.get('/user/:name', userController.showOne);
router.delete('/users', userController.deleteAll);

module.exports = router;
