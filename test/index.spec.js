import { expect } from 'chai';
import {
  isLoggingEnabled,
  canLog,
  createWinstonLogger,
  createLogger,
  disposeLogger,
  normalizeLog,
  error,
  warn,
  info,
  verbose,
  debug,
  silly,
  event,
  audit,
  stream,
} from '../src';

describe('logger', () => {
  beforeEach(() => {
    disposeLogger();
    delete process.env.LOGGER_LOG_ENABLED;
    delete process.env.LOGGER_LOG_LEVEL;
  });

  it('should expose log helpers', () => {
    expect(isLoggingEnabled).to.exist.and.to.be.a('function');
    expect(canLog).to.exist.and.to.be.a('function');
    expect(createWinstonLogger).to.exist.and.to.be.a('function');
    expect(createLogger).to.exist.and.to.be.a('function');
    expect(disposeLogger).to.exist.and.to.be.a('function');
    expect(normalizeLog).to.exist.and.to.be.a('function');
    expect(error).to.exist.and.to.be.a('function');
    expect(warn).to.exist.and.to.be.a('function');
    expect(info).to.exist.and.to.be.a('function');
    expect(verbose).to.exist.and.to.be.a('function');
    expect(debug).to.exist.and.to.be.a('function');
    expect(silly).to.exist.and.to.be.a('function');
  });

  it('should check if logging enabled', () => {
    expect(isLoggingEnabled()).to.be.true;

    process.env.LOGGER_LOG_ENABLED = false;
    expect(isLoggingEnabled()).to.be.false;

    process.env.LOGGER_LOG_ENABLED = true;
    expect(isLoggingEnabled()).to.be.true;
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

  it('should normalize normal log', () => {
    let log = normalizeLog({ message: 'Hello' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;

    log = normalizeLog('Hello');
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;

    log = normalizeLog('Hello', { pid: process.pid });
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.pid).to.be.equal(process.pid);
    expect(log.timestamp).to.exist;
  });

  it('should normalize error log', () => {
    let log = normalizeLog(new Error('Invalid Arguments'));
    expect(log).to.exist;
    expect(log.level).to.be.equal('error');
    expect(log.message).to.be.equal('Invalid Arguments');
    expect(log.timestamp).to.exist;

    log = normalizeLog('Failed', new Error('Invalid Arguments'));
    expect(log).to.exist;
    expect(log.level).to.be.equal('error');
    expect(log.message).to.be.equal('Invalid Arguments');
    expect(log.timestamp).to.exist;

    log = normalizeLog('Failed', new Error('Invalid Arguments'), {
      pid: process.pid,
    });
    expect(log).to.exist;
    expect(log.level).to.be.equal('error');
    expect(log.message).to.be.equal('Invalid Arguments');
    expect(log.pid).to.be.equal(process.pid);
    expect(log.timestamp).to.exist;
  });

  it('should remove ignored fields', () => {
    const log = normalizeLog({ message: 'Hello', password: '1234' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
    expect(log.password).to.not.exist;
  });

  it('should log error', () => {
    const log = error(new Error('Invalid Arguments'));
    expect(log).to.exist;
    expect(log.level).to.be.equal('error');
    expect(log.message).to.be.equal('Invalid Arguments');
    expect(log.timestamp).to.exist;
    expect(log.metadata.stack).to.exist;
    expect(log.metadata.code).to.exist;
    expect(log.metadata.status).to.exist;
    expect(log.metadata.name).to.exist;
  });

  it('should log error', () => {
    const log = error('Invalid Arguments');
    expect(log).to.exist;
    expect(log.level).to.be.equal('error');
    expect(log.message).to.be.equal('Invalid Arguments');
    expect(log.timestamp).to.exist;
  });

  it('should log warn', () => {
    const log = warn({ message: 'Hello' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('warn');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log warn', () => {
    const log = warn('Hello');
    expect(log).to.exist;
    expect(log.level).to.be.equal('warn');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log info', () => {
    const log = info({ message: 'Hello' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log info message', () => {
    const log = info('Hello');
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log verbose', () => {
    const log = verbose({ message: 'Hello' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('verbose');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log verbose', () => {
    const log = verbose('Hello');
    expect(log).to.exist;
    expect(log.level).to.be.equal('verbose');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log debug', () => {
    const log = debug({ message: 'Hello' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('debug');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log debug', () => {
    const log = debug('Hello', { pid: process.pid });
    expect(log).to.exist;
    expect(log.level).to.be.equal('debug');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log silly', () => {
    const log = silly({ message: 'Hello' });
    expect(log).to.exist;
    expect(log.level).to.be.equal('silly');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log silly', () => {
    const log = silly('Hello');
    expect(log).to.exist;
    expect(log.level).to.be.equal('silly');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  it('should log event', () => {
    const log = event('user_click', { pid: process.pid });
    expect(log).to.exist;
    expect(log.level).to.be.equal('event');
    expect(log.message).to.be.equal('user_click');
    expect(log.timestamp).to.exist;
  });

  it('should log audit', () => {
    const log = audit('user_edit', { from: { age: 14 }, to: { age: 15 } });
    expect(log).to.exist;
    expect(log.level).to.be.equal('audit');
    expect(log.message).to.be.equal('user_edit');
    expect(log.timestamp).to.exist;
  });

  it('should expose stream for morgan usage', () => {
    const log = stream.write('Hello');
    expect(log).to.exist;
    expect(log.level).to.be.equal('info');
    expect(log.message).to.be.equal('Hello');
    expect(log.timestamp).to.exist;
  });

  after(() => {
    disposeLogger();
    delete process.env.LOGGER_LOG_LEVEL;
  });
});
