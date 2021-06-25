/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
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

  /* ...adicionar pelo menos mais 5 usuarios.
  se adicionar usuario menor de idade, deve dar erro. Ps: não criar o usuario naoExiste */

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

  it('should try to create a user without sending the name', (done) => {
    chai.request(app)
      .post('/user')
      .send({ email: 'test@email.com', age: 5 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should try to create a user without sending the email', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'test', age: 5 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should try to create a user without sending the age', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'test', email: 'test@email.com' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should create the user "Moraes"', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'Moraes', email: 'moraes@email.com', age: 35 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it('should try to create the user Moraes', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'Moraes', email: 'moraes@email.com', age: 50 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should try to update the email to an email that already exists in the system', (done) => {
    chai.request(app)
      .put('/user/raupp')
      .send({ email: 'moraes@email.com' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should try to update the name to an name that already exists in the system', (done) => {
    chai.request(app)
      .put('/user/raupp')
      .send({ name: 'Moraes' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should try to create the user Rabelo with an invalid email', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'Rabelo', email: 'gabriel', age: 18 })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should look for the "naoExiste" user in the system', (done) => {
    chai.request(app)
      .get('/user/naoExiste')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.msg).to.be.equal('User not found');
        expect(res).to.have.status(404);
        // expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('should try to update "naoExiste" user in the system', (done) => {
    chai.request(app)
      .put('/user/naoExiste')
      .send({ name: 'Nome' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.msg).to.be.equal('User not found');
        expect(res).to.have.status(404);
        // expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  it('should try to delete "naoExiste" user in the system', (done) => {
    chai.request(app)
      .delete('/user/naoExiste')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.msg).to.be.equal('User not found');
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

  it('should update raupp', (done) => {
    chai.request(app)
      .put('/user/raupp')
      .send({ age: 25 })
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

  it('should be a list with 3 users', (done) => {
    chai.request(app)
      .get('/users')
      .send({
        page: 1,
        pageSize: 3,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(3);
        done();
      });
  });

  it('should be a list with 1 user', (done) => {
    chai.request(app)
      .get('/users')
      .send({
        page: 2,
        pageSize: 1,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(1);
        done();
      });
  });
});
