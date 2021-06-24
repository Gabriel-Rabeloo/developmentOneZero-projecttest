/* Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um
arquivo separado */
const userSchema = {
  title: 'Schema do Usuario, define como é o usuario, linha 24 do teste',
  type: 'object',
  required: ['name', 'email', 'age'],
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    age: {
      type: 'number',
      minimum: 18,
    },
  },
};

module.exports = userSchema;
