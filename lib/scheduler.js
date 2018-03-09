const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const Security = require('./security');
const security = new Security();

class Scheduler {
  constructor(filePath) {
    let adapter = new FileSync(filePath, {
      defaultValue: {schedule: []},
      serialize: array => security.serializeFunctions(array),
      deserialize: string => security.unboxFunctions(string)
    });
    this.db = low(adapter);

    this.db.defaults({schedule: [1]}).write();
    this.schedule = this.db.get('schedule').value();
  }

  add(job) {
    this.schedule.push(job);
    this.saveSchedule();
    return job;
  }

  saveSchedule() {
    this.db.set('schedule', this.schedule).write();
  }
}

module.exports = Scheduler;