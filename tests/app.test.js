const request = require('supertest');
const expect = require('expect');

const app = require('./../app');
const current = require('./../models/current');
// const event = require('./../models/event');
// const location = require('./../models/location');
// const play = require('./../models/play');
// const player = require('./../models/player');

beforeEach(done => {
  current.remove({}).then(() => done());
});

describe('CURRENT', () => {
  describe('#POST /current', () => {
    it('should create a new current', done => {
      let sendObj = {
        'locationId': 1,
        'eventId': 1000,
        'playerId': 1,
        'playerName': 'Nick'
      }
  
      request(app)
        .post('/current')
        .send(sendObj)
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
            current.find({}).then(data => {
            expect(data.length).toBe(1);
            done();
          }).catch(err => done(err));
        });
    });

    it('should not create a new current', done => {
      let sendObj = {
        'locationId': 1,
        'eventId': '',
        'playerId': 1,
        'playerName': 'Nick'
      }

      request(app)
        .post('/current')
        .send(sendObj)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

  });

  // describe('#GET /current', () => {
  //   it('should get one current', done => {
  //     request(app)
  //       .get('/current')
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) throw err;
  //         done();
  //       });
  //   });
  // });

  // describe('#DELETE /current', () => {
  //   it('delete all', done => {
  //     request(app)
  //       .delete('/current')
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) throw err;
  //         current.find({}).then(data => {
  //           expect(data.length).toBe(0);
  //           done();
  //         }).catch(err => done(err));
  //       });
  //   });
  // });
});


describe('FILES /charts/radar', () => {
  describe('#GET /charts/radar', () => {
    it('get a radar chart file by locationId, eventId and playerId', done => {
      let query = {
        'locationId': 1,
        'eventId': 1002,
        'playerId': 100
      }
      request(app)
        .get('/charts/radar')
        .send(query)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });
  });
});

