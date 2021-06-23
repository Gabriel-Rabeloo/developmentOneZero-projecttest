const { isEmail } = require('validator');

const database = require('../database/index');
const User = require('../models/User');
// const dbConfig = require('../config/databaseConfig')

// dbConfig();

// Uma rota de exemplo simples aqui.
// As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
class UserController {
  index(ctx) {
    ctx.status = 200;
    ctx.body = { total: 0, count: 0, rows: [] };
  }

  async store(ctx) {
    try {
      let errors = false;

      const { email, age } = ctx.request.body;

      if (!isEmail(email)) {
        errors = true;
        ctx.body = { msg: 'E-mail inválido' };
      }

      if (age < 18) {
        errors = true;
        ctx.body = { msg: 'Somente maiores de 18 anos podem se cadastrar' };
      }

      if (errors) {
        return (
          ctx.status = 401
        );
      }

      await database.sync();

      const newUser = await User.create(ctx.request.body);

      return ctx.body = newUser;
    } catch (error) {
      return { msg: 'Erro ao criar usuario' };
    }
  }
}

module.exports = new UserController();
