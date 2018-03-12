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

  it('should have a method, date, and id', () => {
    expect(job.method).to.be.an.instanceOf(Function);
    expect(job.date).to.be.an.instanceOf(Date);
    expect(job.id).to.be.a('string');
    expect(job.id).to.have.lengthOf(36);

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

  it('should reject non-date strings', () => {
    let createJob = () => {
      new Job(() => {}, "notadate");
    };

    expect(createJob).to.throw(TypeError);
  });

  it('should be able to accept pre-existing id', () => {
    let _job = new Job(() => {}, new Date(), '1');

    expect(_job.id).to.equal('1');
  });

  it('should be able to take NodeVM options', () => {
    let opts = {
      require: {
        builtin: ['path']
      }
    };

    let _job = new Job(() => {
      let path = require('path');
      return path.extname('index.html');
    }, new Date(), '1', opts);

    expect(_job.vm_opts).to.eql(opts);

    expect(_job.execute()).to.equal('.html');
  });

  it('should be able to take NodeVM options as the third argument', () => {
    let opts = {
      require: {
        builtin: ['path']
      }
    };

    let _job = new Job(() => {
      let path = require('path');
      return path.extname('index.html');
    }, new Date(), opts);

    expect(_job.vm_opts).to.eql(opts);

    expect(_job.execute()).to.equal('.html');
  });
});