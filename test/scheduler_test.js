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
  });

  beforeEach(() => {
    scheduler = new Scheduler(filePath);
    date = new Date();
    date.setDate(date.getDate() + 1);
  });

  it('should start with an empty database', () => {
    let _scheduler = new Scheduler(tempFilePath);
    expect(_scheduler.schedule).to.have.lengthOf(0);
  });

  it('should be able to schedule jobs', () => {
    let job = scheduler.add(() => {}, date);
    expect(job).to.be.an.instanceOf(Job);
    expect(scheduler.schedule).to.have.lengthOf(1);

    let job2 = scheduler.add(() => {}, date);

    expect(job2).to.be.an.instanceOf(Job);
    expect(scheduler.schedule).to.have.lengthOf(2);

    let job3 = scheduler.add(() => {}, '0 0 1 1 *');

    expect(job2).to.be.an.instanceOf(Job);
    expect(scheduler.schedule).to.have.lengthOf(3);
  });

  it('should be able to load jobs', () => {
    let _scheduler = new Scheduler(filePath);
    _scheduler.add(() => {}, date);
    _scheduler.add(() => {}, date);

    let _scheduler2 = new Scheduler(filePath);
    expect(_scheduler2.schedule).to.have.lengthOf(2);
    expect(_scheduler2.schedule[0].method).to.be.a('string');
  });

  it('should be able to save/load jobs with NodeVM options by default', () => {
    let opts = {
      require: {
        builtin: ['path']
      }
    };

    let _scheduler = new Scheduler(filePath);
    _scheduler.add(() => {
      let path = require('path');
      return path.extname('index.html');
    }, date, opts);

    let _scheduler2 = new Scheduler(filePath);
    expect(_scheduler2.schedule).to.have.lengthOf(1);
    expect(_scheduler2.schedule[0].vm_opts).to.eql(opts);
  });

  it('should overwrite default NodeVM opts with custom ones', () => {
    let opts = {
      require: {
        builtin: ['path']
      }
    };

    let default_opts = {
      require: {
        builtin: ['fs']
      }
    };

    let _scheduler = new Scheduler(tempFilePath);

    let job = _scheduler.add(() => {
        let path = require('path');
        return path.extname('index.html');
      },
      date,
      opts
    );

    _scheduler.add(() => {}, date);

    expect(_scheduler.schedule).to.have.lengthOf(2);

    expect(_scheduler.schedule[0].vm_opts).to.eql(opts);
    expect(_scheduler.schedule[1].vm_opts).to.be.undefined;
  });

  it('should register jobs', () => {
    let job = scheduler.add(() => {}, date);

    expect(scheduler.jobs).to.have.lengthOf(1);
    expect(scheduler.jobs).to.include(job.id);

    job = scheduler.add(() => {}, date);

    expect(scheduler.jobs).to.have.lengthOf(2);
    expect(scheduler.jobs).to.include(job.id);
  });

  it('should be able to cancel jobs', () => {
    let job = scheduler.add(() => {}, date);

    expect(scheduler.jobs).to.have.lengthOf(1);
    expect(scheduler.jobs).to.include(job.id);

    scheduler.cancel(job.id);

    expect(scheduler.jobs).to.have.lengthOf(0);
    expect(scheduler.schedule).to.have.lengthOf(0);
  });

  it('should be able to take an argument of NodeVM options', () => {
    expect(scheduler.vm_opts).to.be.null;

    let _scheduler = new Scheduler(tempFilePath, {success: true});
    let expected = {success: true};

    expect(_scheduler.vm_opts).to.eql(expected);
  });

  it('should be able to add jobs with custom NodeVM argument', () => {
    let job = scheduler.add(() => {
        let path = require('path');
        return path.extname('index.html');
      },
      date,
      {
        require: {
          builtin: ['path']
        }
      }
    );
    expect(job).to.be.an.instanceOf(Job);
    expect(scheduler.schedule).to.have.lengthOf(1);

    expect(job.execute()).to.equal('.html');
  });

  afterEach(() => {
    fs.access(tempFilePath, err => {
      if(!err) {
        fs.unlinkSync(tempFilePath);
      }
    });
    fs.access(filePath, err => {
      if(!err) {
        fs.unlinkSync(filePath);
      }
    });
  });

  after(() => {
    fs.rmdirSync(dirPath);
    fs.access(dirPath, err => {
      expect(!!err).to.be.true;
    });
  });
});