const {NodeVM} = require('vm2');
const vm = new NodeVM();

const uuid = require('uuid/v1');

class Job {
  constructor(method, date, id) {
    if(!(date instanceof Date)) {
      throw new TypeError('Supplied date must be a valid JavaScript Date object.');
    }
    this.method = method;
    this.date = date;
    this.id = id || uuid();
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