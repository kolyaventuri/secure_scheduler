const {NodeVM} = require('vm2');

const uuid = require('uuid/v1');
const parser = require('cron-parser');

class Job {
  constructor(method, date, id, vm_opts) {
    if(!(date instanceof Date)) {
      if(typeof date === 'string') {
        try {
          parser.parseExpression(date);
        } catch(err) {
          throw err;
        }
      } else {
        throw new TypeError('Supplied date must be a valid JavaScript Date object.');
      }
    }
    this.method = method;
    this.date = date;
    this.id = id || uuid();
    this.vm_opts = vm_opts || undefined;

    if(typeof this.vm_opts === 'undefined' && typeof this.id === 'object') {
      this.vm_opts = this.id;
      this.id = uuid();
    }

    this.vm = new NodeVM(this.vm_opts || undefined);
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