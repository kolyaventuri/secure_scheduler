require('./test_helper');

const Security = require('../lib/security');
const Job = require('../lib/job');

describe('Security', () => {
  let security = new Security();
  it('should be able to serialize an array of functions', () => {

    let func = (a) => { return a; };
    let date = new Date();

    let input = {
      schedule: [
        {
          method: func,
          date: date,
          id: 'test'
        }
      ]
    };

    let expected = {
      schedule: [
        {
          method: '(a) => { return a; }',
          date: date.toString(),
          id: 'test'
        }
      ]
    };

    let output = security.serializeFunctions(input);

    expect(output).to.eql(JSON.stringify(expected));
  });

  it('should be able to serialize an array of functions with NodeVM opts', () => {
    let date = new Date();
    let opts = {
      require: {
        builtin: ['path']
      }
    };

    let input = {
      schedule: [
        {
          method: () => { let path = require('path'); return path.extname('index.html'); },
          date: date,
          id: 'test',
          vm_opts: opts
        }
      ]
    };

    let expected = {
      schedule: [
        {
          method: "() => { let path = require('path'); return path.extname('index.html'); }",
          date: date.toString(),
          id: 'test',
          vm_opts: opts
        }
      ]
    };

    let output = security.serializeFunctions(input);

    expect(output).to.eql(JSON.stringify(expected));
  });

  it('should be able to unbox functions', () => {
    let date = new Date('Fri Mar 09 2018 10:04:58 GMT-0600 (CST)');

    let input = {
      schedule: [
        {
          method: '(a) => { return a; }',
          date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)',
          id: '1'
        },
        {
          method: '2*2',
          date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)',
          id: '2'
        }
      ]
    };

    let output = security.unboxFunctions(JSON.stringify(input));
    expect(output.schedule).to.be.an('array');

    output = output.schedule;
    for(let i = 0; i < output.length; i++) {
      let job = output[i];
      expect(job).to.be.an.instanceOf(Job);
      expect(job.method).to.be.a('function');
      expect(job.date).to.eql(date);
      expect(job.id).to.equal(input.schedule[i].id);
    }

    expect(output[0].execute('x')).to.equal('x');
    expect(output[1].execute()).to.equal(4);
  });

  it('should unbox functions securely', () => {
    let input = JSON.stringify({
      schedule: [
        {
          method: '(a) => { let path = require("path"); return path.extname(a); }',
          date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)',
          id: '1'
        }
      ]
    });

    let output = security.unboxFunctions(input);

    expect(() => { output[0].execute('index.html'); }).to.throw();
  });

  it('should be able to unbox functions with NodeVM opts', () => {
    let input = JSON.stringify({
      schedule: [
        {
          method: "() => { let path = require('path'); return path.extname('index.html'); }",
          date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)',
          id: 'test',
          vm_opts: opts
        }
      ]
    });

    let output = security.unboxFunctions(input);

    expect(output[0].execute()).to.equal('index.html');
  });
});