const request = require('supertest');
const expect = require('expect');

const app = require('./../app');
const Current = require('./../models/current');
const {current200, current400, deleteAllCurrent, populateCurrent} = require('./seed/seed');

//beforeEach(populateCurrents);


describe('CURRENT', () => {
  
  describe('#POST /current', () => {
    before(deleteAllCurrent);
    it('should create a new current', done => {
      request(app)
        .post('/current')
        .send(current200)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
            Current.find({}).then(data => {
            done();
          }).catch(err => done(err));
        });
    });

    before(deleteAllCurrent);
    it('should not create a new current', done => {
      request(app)
        .post('/current')
        .send(current400)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
    });

  });

  describe('#GET /current', () => {
    before(populateCurrent);
    it('should get one current', done => {
      request(app)
        .get('/current')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          Current.find({}).then(data => {
            expect(data.length).toBe(1);
            done();
          }).catch(err => done(err));
        });
    });
  });

  describe('#DELETE /current', () => {
    before(populateCurrent);
    it('delete all', done => {
      
      Current.find({}).then(data => {
        console.log(data);
      })
      request(app)
        .delete('/current')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          Current.find({}).then(data => {
            console.log(data);
            expect(data.length).toBe(0);
            done();
          }).catch(err => done(err));
        });
    });
  });
});


// describe('FILES /charts/radar', () => {
//   describe('#GET /charts/radar', () => {
//     it('get a radar chart file by locationId, eventId and playerId', done => {
//       let query = {
//         'locationId': 1,
//         'eventId': 1002,
//         'playerId': 100
//       }
//       request(app)
//         .get('/charts/radar')
//         .send(query)
//         .expect(200)
//         .end((err, res) => {
//           if (err) throw err;
//           done();
//         });
//     });
//   });
// });

