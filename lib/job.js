const {NodeVM} = require('vm2');
const vm = new NodeVM();

class Job {
  constructor(method, date) {
    this.method = method;
    this.date = date;
  }

  execute() {
    let method = vm.run(`module.exports = ${this.method.toString()};`);
    return method.apply(this, arguments);
  }
}

module.exports = Job;