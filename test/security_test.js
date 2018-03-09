require('./test_helper');

const Security = require('../lib/security');

describe('Security', () => {
  let security = new Security();
  it('should be able to serialize an array of functions', () => {

    let func = (a) => { console.log(a); };
    let date = new Date();

    let input = [
      {
        method: func,
        date: date
      }
    ];

    let expected = [
      {
        method: '(a) => { console.log(a); }',
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
        method: '(a) => { console.log(a); }',
        date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)'
      }
    ];

    let output = security.unboxFunctions(input);

    expect(input[0].method).to.be.a('function');
    expect(input[0].date).to.equal(date);

    expect(input[0].method(4)).to.equal(4);
  });

  it('should unbox functions securely', () => {
    let input = [
      {
        method: '(a) => { let path = require("path"); return path.extname(a); }',
        date: 'Fri Mar 09 2018 10:04:58 GMT-0600 (CST)'
      }
    ];

    let output = security.unboxFunctions(input);
    expect(input[0].method).to.be.a('function');

    expect(input[0].method('index.html')).to.not.equal('.html');
  });
});