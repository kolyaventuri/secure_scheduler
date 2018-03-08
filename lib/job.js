class Job {
  constructor(method, date) {
    this.method = method;
    this.date = date;
  }

  execute() {
    return this.method();
  }
}

module.exports = Job;