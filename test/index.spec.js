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

const app = require('../src/server');
const userSchema = require('./utils/userSchema');
const createFive = require('./utils/userCreate');

chai.use(chaiHttp);
chai.use(chaiJson);

const { expect } = chai;

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

  it('deveria limpar o banco de dados', (done) => {
    chai.request(app)
      .delete('/users')
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
        expect(res.body).to.eql([]);
        done();
      });
  });

  // ...adicionar pelo menos mais 5 usuarios. se adicionar usuario menor de idade, deve dar erro. Ps: não criar o usuario naoExiste

  it('deveria criar o usuario raupp', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'raupp', email: 'jose.raupp@devoz.com.br', age: 35 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it('deveria tentar criar um usuario menor de idade', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'teste', email: 'test@email.com', age: 5 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('deveria criar o usuario Moraes', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'Moraes', email: 'moraes@email.com', age: 35 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it('deveria tentar criar o usuario Moraes', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'Moraes', email: 'moraes@email.com', age: 50 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('o usuario naoExiste não existe no sistema', (done) => {
    chai.request(app)
      .get('/user/naoExiste')
      .end((err, res) => {
        expect(res.body.msg).to.be.equal('User not found'); // possivelmente forma errada de verificar a mensagem de erro
        expect(res).to.have.status(404);
        // expect(res.body).to.be.jsonSchema(userSchema);
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
        expect(res).to.have.status(404);
        // expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('deveria ser uma lista com pelo menos 5 usuarios', (done) => {
    (async () => {
      await createFive();
    })().then(() => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(5);
          done();
        });
    });
  });
});
