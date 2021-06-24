// sample test
// Para rodar os testes, use: npm test
// PS: Os testes não estão completos e alguns podem conter erros.

// veja mais infos em:
// https://mochajs.org/
// https://www.chaijs.com/
// https://www.chaijs.com/plugins/chai-json-schema/
// https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json-schema');
const app = require('../src/app');

chai.use(chaiHttp);
chai.use(chaiJson);

const { expect } = chai;

// Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
  title: 'Schema do Usuario, define como é o usuario, linha 24 do teste',
  type: 'object',
  required: ['nome', 'email', 'idade'],
  properties: {
    nome: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    idade: {
      type: 'number',
      minimum: 18,
    },
  },
};

// Inicio dos testes

// este teste é simplesmente pra entender a usar o mocha/chai
describe('Um simples conjunto de testes', () => {
  it('deveria retornar -1 quando o valor não esta presente', () => {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});

// testes da aplicação
describe('Testes da aplicaçao', () => {
  it('o servidor esta online', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('deveria ser uma lista vazia de usuarios', (done) => {
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.rows).to.eql([]);
        done();
      });
  });

  it('deveria criar o usuario raupp', (done) => {
    chai.request(app)
      .post('/user')
      .send({ nome: 'raupp', email: 'jose.raupp@devoz.com.br', idade: 35 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });
  // ...adicionar pelo menos mais 5 usuarios. se adicionar usuario menor de idade, deve dar erro. Ps: não criar o usuario naoExiste

  it('o usuario naoExiste não existe no sistema', (done) => {
    chai.request(app)
      .get('/user/naoExiste')
      .end((err, res) => {
        expect(err.response.body.error).to.be.equal('User not found'); // possivelmente forma errada de verificar a mensagem de erro
        expect(res).to.have.status(404);
        expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('o usuario raupp existe e é valido', (done) => {
    chai.request(app)
      .get('/user/raupp')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('deveria excluir o usuario raupp', (done) => {
    chai.request(app)
      .delete('/user/raupp')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('o usuario raupp não deve existir mais no sistema', (done) => {
    chai.request(app)
      .get('/user/raupp')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('deveria ser uma lista com pelo menos 5 usuarios', (done) => {
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.total).to.be.at.least(5);
        done();
      });
  });
});
