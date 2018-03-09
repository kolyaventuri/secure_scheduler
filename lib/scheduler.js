const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

class Scheduler {
  constructor(filePath) {
    let adapter = new FileSync(filePath);
    this.db = low(adapter);

    this.db.defaults({schedule: []}).write();

    this.schedule = this.db.get('schedule').value;
  }

  add(job) {

  }

  saveSchedule() {

  }
}

module.exports = Scheduler;