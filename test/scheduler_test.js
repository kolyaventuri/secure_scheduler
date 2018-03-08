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
    expect(_scheduler.schedule.length).to.equal(0);
  });

  it('should be able to schedule jobs', () => {
    let job = scheduler.add(new Job(() => {}, new Date()));

    expect(job).to.be.an.instanceOf(Job);
    expect(scheduler.schedule.length).to.equal(1);

    let job2 = scheduler.add(new Job(() => {}, new Date()));

    expect(job2).to.be.an.instanceOf(Job);
    expect(scheduler.schedule.length).to.equal(2);
  });

  it('should be able to load jobs', () => {
    let _scheduler = new Scheduler(filePath);
    expect(scheduler.schedule.length).to.equal(2);
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