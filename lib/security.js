const {NodeVM} = require('vm2');
const vm = new NodeVM();

const Job = require('./job');

class Security {
  serializeFunctions(jobs) {
    return jobs.map((job) => {
      return {
        method: job.method.toString(),
        date: job.date.toString()
      };
    });
  }

  unboxFunctions(jobs) {
    return jobs.map((job) => {
      let method = vm.run(`module.exports = ${job.method};`);

      if(typeof method !== 'function') {
          method = vm.run(`module.exports = () => { return ${job.method}; };`);
      }

      return new Job(method, new Date(job.date));
    });
  }
}

module.exports = Security;