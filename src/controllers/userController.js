const { isEmail } = require('validator');

const database = require('../database/index');
const User = require('../models/User');

// Uma rota de exemplo simples aqui.
// As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
class UserController {
  async show(ctx) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'age'],
      });
      return (
        ctx.body = users, ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 500,
        ctx.body = { msg: 'Erro ao tentar listar usuarios' }
      );
    }
  }

  async showOne(ctx) {
    try {
      const { name } = ctx.request.params;

      const user = await User.findOne({ where: { name } });

      if (!user) {
        return (
          ctx.status = 404,
          ctx.body = { msg: 'User not found' }
        );
      }

      delete user.dataValues.createdAt;
      delete user.dataValues.updatedAt;

      return (
        ctx.body = user, ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 500,
        ctx.body = { msg: 'Erro ao tentar listar usuario' }
      );
    }
  }

  async store(ctx) {
    try {
      const { name, email, age } = ctx.request.body;
      const msgError = [];

      await UserController.validateUser(name, email, age, msgError, true);

      await database.sync();

      if (msgError.length > 0) {
        return (
          ctx.status = 400,
          ctx.body = msgError
        );
      }

      const newUser = await User.create(ctx.request.body);

      return (
        ctx.body = newUser,
        ctx.status = 201
      );
    } catch (error) {
      return (
        ctx.status = 500,
        ctx.body = { msg: 'Erro inesperado ao criar usuario' }

      );
    }
  }

  async update(ctx) {
    try {
      const msgError = [];
      const { name } = ctx.request.params;
      const { name: nameBody, email, age } = ctx.request.body;

      if (!name) {
        return (
          ctx.status = 400,
          ctx.body = { msg: 'Faltando o nome' }
        );
      }

      await UserController.validateUser(nameBody, email, age, msgError, false);

      await database.sync();

      if (msgError.length > 0) {
        return (
          ctx.status = 400,
          ctx.body = msgError
        );
      }

      const user = await User.findOne({ where: { name } });

      if (!user) {
        return (
          ctx.status = 404,
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
        ctx.status = 500,
        ctx.body = { msg: 'Erro inesperado ao atualizar usuario' }

      );
    }
  }

  async delete(ctx) {
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
          ctx.status = 404,
          ctx.body = { msg: 'User not found' }
        );
      }

      const deletedUser = await user.destroy(ctx.request.body);
      delete deletedUser.dataValues.createdAt;
      delete deletedUser.dataValues.updatedAt;

      return (
        ctx.body = deletedUser,
        ctx.status = 200
      );
    } catch (error) {
      return (
        ctx.status = 500,
        ctx.body = { msg: 'Erro inesperado ao excluir usuario' }

      );
    }
  }

  async deleteAll(ctx) {
    try {
      await User.destroy({
        truncate: true,
      });
      return (
        ctx.status = 200,
        ctx.body = { msg: 'Banco de dados limpo' }
      );
    } catch (error) {
      return (
        ctx.status = 500,
        ctx.body = { msg: 'Erro ao limpar banco de dados' }

      );
    }
  }

  static async validateUser(name, email, age, msgError, store) {
    if (store) {
      if (!name) {
        msgError.push({ msg: 'Nome não foi enviado' });
      }
      if (!email) {
        msgError.push({ msg: 'Email não foi enviado' });
      } if (!age) {
        msgError.push({ msg: 'Idade não foi enviada' });
      }
    }

    if (age < 18) {
      msgError.push({ msg: 'Somente maiores de 18 anos podem se cadastrar' });
    }

    await database.sync();
    let ExistEmail;
    let ExistName;
    if (email) {
      ExistEmail = await User.findOne({ where: { email } });
      if (!isEmail(email)) {
        msgError.push({ msg: 'E-mail inválido' });
      }
    }

    if (name) {
      ExistName = await User.findOne({ where: { name } });
    }

    if (ExistName) {
      msgError.push({ msg: 'Usuario já cadastrado no sistema' });
    }
    if (ExistEmail) {
      msgError.push({ msg: 'E-mail já cadastrado no sistema' });
    }
  }
}

module.exports = new UserController();
