const request = require('supertest');
const app = require('../../');


describe('Get bookable days', () => {
  it('should get bookable days within a month', async () => {
    const res = await request(app)
        .get('/days?year=2019&month=11')
        .send({
          year: 2019,
          month: 11,
        });
    expect(res.body.success).toEqual(true);
  });
});
