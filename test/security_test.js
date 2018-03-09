require('./test_helper');

const Security = require('../lib/security');
const Job = require('../lib/job');

describe('Security', () => {
  let security = new Security();
  it('should be able to serialize an array of functions', () => {

    let func = (a) => { return a; };
    let date = new Date();

    let input = [
      {
        method: func,
        date: date
      }
    ];

    let expected = [
      {
        method: '(a) => { return a; }',
        date: date.toString()
      }
    ];

    let output = security.serializeFunctions(input);

    expect(output).to.eql(expected);
  });

  it('should be able to unbox functions', () => {
    let date = new Date('Fri Mar 09 2018 10:04:58 GMT-0600 (CST)');

    let input = [
      {
        method: '(a) => { return a; }',
        date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)'
      },
      {
        method: '2*2',
        date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)'
      }
    ];

    let output = security.unboxFunctions(input);

    for(let job of output) {
      expect(job).to.be.an.instanceOf(Job);
      expect(job.method).to.be.a('function');
      expect(job.date).to.eql(date);
    }

    expect(output[0].execute('x')).to.equal('x');
    expect(output[1].execute()).to.equal(4);
  });

  it('should unbox functions securely', () => {
    let input = [
      {
        method: '(a) => { let path = require("path"); return path.extname(a); }',
        date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)'
      }
    ];

    let output = security.unboxFunctions(input);

    expect(() => { output[0].execute('index.html'); }).to.throw();
  });
});