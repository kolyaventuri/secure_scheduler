const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const Job = require('./job');

const Security = require('./security');
const security = new Security();

const schedule = require('node-schedule');

class Scheduler {
  constructor(filePath, vm_opts) {
    let adapter = new FileSync(filePath, {
      defaultValue: {schedule: []},
      serialize: array => security.serializeFunctions(array),
      deserialize: string => security.unboxFunctions(string)
    });
    this.db = low(adapter);

    this.db.defaults({schedule: []}).write();
    this.schedule = this.db.get('schedule').value();
    this.jobs = [];

    this.vm_opts = vm_opts || null;
  }

  add(method, date, vm_opts) {
    let job = new Job(method, date, vm_opts);
    this.schedule.push(job);
    this.jobs.push(job.id);
    schedule.scheduleJob(job.id, date, job.execute);
    this.saveSchedule();
    return job;
  }

  cancel(id) {
    let job = schedule.scheduledJobs[id];
    job.cancel();

    for(let i = 0; i < this.schedule.length; i++) {
      let _job = this.schedule[i];
      if(_job.id == id) {
        this.schedule.splice(i, 1);
        this.jobs.splice(i, 1);
      }
    }

    this.saveSchedule();
  }

  saveSchedule() {
    this.db.set('schedule', this.schedule).write();
  }
}

module.exports = Scheduler;