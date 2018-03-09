const {NodeVM} = require('vm2');
const vm = new NodeVM();

class Job {
  constructor(method, date) {
    this.method = method;
    this.date = date;
  }

  execute() {
    let method = vm.run(`module.exports = ${this.method.toString()};`);
    let res = null;
    try {
      res = method.apply(this, arguments);
    } catch (e) {
      throw e;
    }

    return res;
  }
}

module.exports = Job;