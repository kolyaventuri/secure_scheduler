const {NodeVM} = require('vm2');
const vm = new NodeVM();

const Job = require('./job');

class Security {
  serializeFunctions(data) {
    let jobs = data.schedule;
    data.schedule = jobs.map((job) => {
      return {
        method: job.method.toString(),
        date: job.date.toString(),
        id: job.id
      };
    });
    return JSON.stringify(data);
  }

  unboxFunctions(data) {
    data = JSON.parse(data);

    let jobs = data.schedule;
    data.schedule = jobs.map((job) => {
      let method = vm.run(`module.exports = ${job.method};`);

      if(typeof method !== 'function') {
          method = vm.run(`module.exports = () => { return ${job.method}; };`);
      }

      return new Job(method, new Date(job.date), job.id);
    });

    return data;
  }
}

module.exports = Security;