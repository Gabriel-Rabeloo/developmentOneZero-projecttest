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
      const msgError = [];

      const { name, email, age } = ctx.request.body;

      if (!name) {
        errors = true;
        msgError.push({ msg: 'Nome não foi enviado' });
      }
      if (!email) {
        errors = true;
        msgError.push({ msg: 'Email não foi enviado' });
      } if (!age) {
        errors = true;
        msgError.push({ msg: 'Idade não foi enviada' });
      }

      if (errors) {
        return (
          ctx.status = 400,
          ctx.body = msgError
        );
      }

      if (!isEmail(email)) {
        errors = true;
        msgError.push({ msg: 'E-mail inválido' });
      }

      if (age < 18) {
        errors = true;
        msgError.push({ msg: 'Somente maiores de 18 anos podem se cadastrar' });
      }

      if (errors) {
        return (
          ctx.status = 400,
          ctx.body = msgError
        );
      }

      await database.sync();

      const newUser = await User.create(ctx.request.body);

      return (
        ctx.body = newUser, ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 400,
        ctx.body = { msg: 'Erro ao criar usuario' }

      );
    }
  }
}

module.exports = new UserController();
