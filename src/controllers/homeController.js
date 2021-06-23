const PORT = process.env.PORT || 3000;

// rota simples pra testar se o servidor está online
class HomeController {
  async index(ctx) {
    ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`; // http://localhost:3000/
  }
}
module.exports = new HomeController();
