const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const security = require('./security');

class Scheduler {
  constructor(filePath) {
    let adapter = new FileSync(filePath, {
      defaultValue: [],
      serialize: security.serializeFunctions(array),
      deserialize: security.unboxFunctions(string)
    });
    this.db = low(adapter);

    this.db.defaults({schedule: []}).write();

    this.schedule = this.db.get('schedule').value;
  }

  add(job) {
    this.schedule.push(schedule);
  }

  saveSchedule() {

  }
}

module.exports = Scheduler;