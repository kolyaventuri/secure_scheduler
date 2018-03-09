require('./test_helper');

const path = require('path');
const fs = require('fs');

const Scheduler = require('../lib/scheduler');
const Job = require('../lib/job');


describe('Scheduler', () => {
  let dirPath = path.join(__dirname, '../tmp');
  let filePath = path.join(dirPath, 'schedule.json');
  let tempFilePath = path.join(dirPath, 'temp_schedule.json');

  let scheduler = null;

  before(() => {
      fs.mkdirSync(dirPath);
      fs.access(dirPath, err => {
        expect(!!err).to.be.false;
      });

      scheduler = new Scheduler(filePath);
  });

  it('should start with an empty database', () => {
    let _scheduler = new Scheduler(tempFilePath);
    expect(_scheduler.schedule).to.have.lengthOf(0);
  });

  it('should be able to schedule jobs', () => {
    let job = scheduler.add(() => {}, new Date());

    expect(job).to.be.an.instanceOf(Job);
    expect(scheduler.schedule).to.have.lengthOf(1);

    let job2 = scheduler.add(() => {}, new Date());

    expect(job2).to.be.an.instanceOf(Job);
    expect(scheduler.schedule).to.have.lengthOf(2);
  });

  it('should be able to load jobs', () => {
    let _scheduler = new Scheduler(filePath);
    expect(scheduler.schedule).to.have.lengthOf(2);
    expect(scheduler.schedule[0].method).to.be.a('function');
  });

  it('should register jobs', () => {
    let job = scheduler.add(() => {}, new Date());

    expect(scheduler.jobs).to.have.lengthOf(1);
    expect(scheduler.jobs).to.include(job.id);

    job = scheduler.add(() => {}, new Date());

    expect(scheduler.jobs).to.have.lengthOf(2);
    expect(scheduler.jobs).to.include(job.id);
  });

  it('should be able to cancel jobs', () => {
    let job = scheduler.add(() => {}, new Date());

    expect(scheduler.jobs).to.have.lengthOf(1);
    expect(scheduler.jobs).to.include(job.id);

    scheduler.cancel(job.id);

    expect(scheduler.jobs).to.have.lengthOf(0);
    expect(scheduler.schedule).to.have.lengthOf(0);
  });

  afterEach(() => {
    fs.access(tempFilePath, err => {
      if(!err) {
        fs.unlinkSync(tempFilePath);
      }
    });
  });

  after(() => {
    fs.unlinkSync(filePath);
    fs.rmdirSync(dirPath);
    fs.access(dirPath, err => {
      expect(!!err).to.be.true;
    });
  });
});