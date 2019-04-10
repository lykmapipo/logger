import { expect } from 'chai';
import {
  createLogger,
  disposeLogger,
  error,
  warn,
  info,
  verbose,
  debug,
  silly,
} from '../src/index';

describe('logger', () => {
  beforeEach(() => {
    disposeLogger();
  });

  it('should expose log helpers', () => {
    expect(createLogger).to.exist.and.to.be.a('function');
    expect(disposeLogger).to.exist.and.to.be.a('function');
    expect(error).to.exist.and.to.be.a('function');
    expect(warn).to.exist.and.to.be.a('function');
    expect(info).to.exist.and.to.be.a('function');
    expect(verbose).to.exist.and.to.be.a('function');
    expect(debug).to.exist.and.to.be.a('function');
    expect(silly).to.exist.and.to.be.a('function');
  });

  it('should create logger instance', () => {
    const logger = createLogger();
    expect(logger).to.exist;
  });

  it('should not re-create logger instance', () => {
    const first = createLogger();
    const second = createLogger();
    expect(first).to.exist;
    expect(second).to.exist;
    expect(first.id === second.id).to.be.true;
  });

  it('should dispose logger instance', () => {
    const logger = createLogger();
    expect(logger).to.exist;
    const disposed = disposeLogger();
    expect(disposed).to.not.exist;
  });

  after(() => {
    disposeLogger();
  });
});
