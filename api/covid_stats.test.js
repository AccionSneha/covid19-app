const request = require('supertest');
const {
  STATUS_CODES
} = require('../helpers/constants');
const chai = require('chai');
const expect = chai.expect;
const app = require('../index');

chai.config.includeStack = true;

describe('## Covid-19 Statistics API', () => {
  describe('# GET /api/global/summary', () => {
    it('should return summary of global covid-19 cases', (done) => {
      request(app)
        .get('/api/global/summary')
        .expect(STATUS_CODES.SUCCESS)
        .then((res) => {
          expect(res.body.data).to.be.a('object');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/global/deathsAndConfirmed', () => {
    it('should return global max/min deaths and max/min confirmed cases', (done) => {
      request(app)
        .get('/api/global/deathsAndConfirmed')
        .expect(STATUS_CODES.SUCCESS)
        .then((res) => {
          expect(res.body.data).to.be.a('object');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/countries/stats', () => {
    it('should return covid-19 statistics for all countries', (done) => {
      request(app)
        .get('/api/countries/stats')
        .expect(STATUS_CODES.SUCCESS)
        .then((res) => {
          expect(res.body.data).to.be.a('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/country/:country', () => {
    it('should return covid-19 statistics for requested country', (done) => {
      request(app)
        .get('/api/country/india')
        .expect(STATUS_CODES.SUCCESS)
        .then((res) => {
          expect(res.body.data).to.be.a('object');
          done();
        })
        .catch(done);
    });

    it('should return not found(404) error', (done) => {
      request(app)
        .get('/api/country/indiae')
        .expect(STATUS_CODES.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/country/deathsAndConfirmed/india', () => {
    it('should return covid-19 statistics for a country where total deaths and confirmed were maximum', (done) => {
      request(app)
        .get('/api/country/deathsAndConfirmed/india')
        .expect(STATUS_CODES.SUCCESS)
        .then((res) => {
          expect(res.body.data).to.be.a('object');
          done();
        })
        .catch(done);
    });

    it('should return not found (404) error', (done) => {
      request(app)
        .get('/api/country/deathsAndConfirmed/indiaa')
        .expect(STATUS_CODES.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });
});