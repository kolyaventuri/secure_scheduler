const {NodeVM} = require('vm2');

const uuid = require('uuid/v1');

class Job {
  constructor(method, date, id, vm_opts) {
    if(!(date instanceof Date)) {
      throw new TypeError('Supplied date must be a valid JavaScript Date object.');
    }
    this.method = method;
    this.date = date;
    this.id = id || uuid();

    this.vm = new NodeVM(vm_opts || undefined);
  }

  execute() {
    let method = this.vm.run(`module.exports = ${this.method.toString()};`);
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