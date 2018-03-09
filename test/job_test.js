require('./test_helper');

const Job = require('../lib/job');

describe('Job', () => {
  let date = new Date();

  let job = new Job(() => {
    return Math.pow(2,2);
  }, date);

  it('should be able to create a job', () => {
    expect(job).to.be.an.instanceOf(Job);
  });

  it('should have a method and a date', () => {
    expect(job.method).to.be.an.instanceOf(Function);
    expect(job.date).to.be.an.instanceOf(Date);

    expect(job.date).to.equal(date);
  });

  it('should be able to run method', () => {
    expect(job.execute()).to.equal(4);
  });

  it('should be sandboxed in a VM', () => {
    let _job = new Job(() => {
      let path = require('path');
      return path.extname('index.html');
    }, date);

    expect(job.execute()).to.not.equal('.html');
  });
});