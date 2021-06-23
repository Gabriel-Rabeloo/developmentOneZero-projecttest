// Uma rota de exemplo simples aqui.
// As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
class UserController {
  index(ctx) {
    ctx.status = 200;
    ctx.body = { total: 10, count: 0, rows: [] };
  }
}

module.exports = new UserController();
