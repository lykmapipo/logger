import { expect } from 'chai';
import { error, warn, info, verbose, debug, silly } from '../src/index';

describe('logger', () => {
  it('should expose log helpers', () => {
    expect(error).to.exist.and.to.be.a('function');
    expect(warn).to.exist.and.to.be.a('function');
    expect(info).to.exist.and.to.be.a('function');
    expect(verbose).to.exist.and.to.be.a('function');
    expect(debug).to.exist.and.to.be.a('function');
    expect(silly).to.exist.and.to.be.a('function');
  });
});
