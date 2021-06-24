const { isEmail } = require('validator');

const database = require('../database/index');
const User = require('../models/User');
// const dbConfig = require('../config/databaseConfig')

// dbConfig();

// Uma rota de exemplo simples aqui.
// As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
class UserController {
  async show(ctx) {
    try {
      const users = await User.findAll();
      return (
        ctx.body = users, ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 400,
        ctx.body = { msg: 'Erro ao tentar listar usuarios' }
      );
    }
  }

  async store(ctx) {
    try {
      const { name, email, age } = ctx.request.body;
      const msgError = [];

      await UserController.validateUser(name, email, age, msgError);

      await database.sync();

      if (msgError.length > 1) {
        return (
          ctx.status = 400,
          ctx.body = msgError
        );
      }

      const newUser = await User.create(ctx.request.body);

      return (
        ctx.body = newUser,
        ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 400,
        ctx.body = { msg: 'Erro inesperado ao criar usuario' }

      );
    }
  }

  async update(ctx) {
    try {
      const { name } = ctx.request.params;

      if (!name) {
        return (
          ctx.status = 400,
          ctx.body = { msg: 'Faltando o nome' }
        );
      }

      await database.sync();

      const user = await User.findOne({ where: { name } });

      if (!user) {
        return (
          ctx.status = 400,
          ctx.body = { msg: 'Usuario não existe' }
        );
      }

      const updatedUser = await user.update(ctx.request.body);

      return (
        ctx.body = updatedUser,
        ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 400,
        ctx.body = { msg: 'Erro inesperado ao atualizar usuario' }

      );
    }
  }

  static async validateUser(name, email, age, msgError) {
    if (!name) {
      msgError.push({ msg: 'Nome não foi enviado' });
    }
    if (!email) {
      msgError.push({ msg: 'Email não foi enviado' });
    } if (!age) {
      msgError.push({ msg: 'Idade não foi enviada' });
    }

    if (!isEmail(email)) {
      msgError.push({ msg: 'E-mail inválido' });
    }

    if (age < 18) {
      msgError.push({ msg: 'Somente maiores de 18 anos podem se cadastrar' });
    }

    await database.sync();

    const emailExists = await User.findOne({ where: { email } });
    const nameExists = await User.findOne({ where: { name } });

    if (emailExists) {
      msgError.push({ msg: 'E-mail já cadastrado no sistema' });
    }
    if (nameExists) {
      msgError.push({ msg: 'Usuario já cadastrado no sistema' });
    }
  }
}

module.exports = new UserController();
