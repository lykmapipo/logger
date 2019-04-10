import { isError, isFunction } from 'lodash';
import { getBoolean, getString } from '@lykmapipo/env';
import { mergeObjects, mapErrorToObject } from '@lykmapipo/common';
import { createLogger as buildLogger, transports } from 'winston';

// ref logger instance
let logger;

/**
 * @function isLoggingEnabled
 * @name isLoggingEnabled
 * @description check if logging is enabled
 * @return {Boolean} whether logging is enabled
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { isLoggingEnabled } from '@lykmapipo/logger';
 * const enabled = isLoggingEnabled();
 * //=> true
 *
 */
export const isLoggingEnabled = () => {
  const isEnabled = getBoolean('LOGGER_LOG_ENABLED', true);
  return isEnabled;
};

/**
 * @function canLog
 * @name canLog
 * @description check if logging is enabled and logger has log level
 * @param {String} level valid log level
 * @return {Boolean} whether log level can be logged
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { canLog } from '@lykmapipo/logger';
 * const can = canLog('error');
 * //=> true
 *
 */
export const canLog = level => {
  const can = logger && isFunction(logger[level]) && isLoggingEnabled();
  return can;
};

/**
 * @function createWinstonLogger
 * @name createWinstonLogger
 * @description create winston logger instance
 * @return {Object} A new instance of winston logger
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @private
 * @example
 *
 * import { createWinstonLogger } from '@lykmapipo/logger';
 * const logger = createWinstonLogger();
 * //=> DerivedLogger {}
 *
 */
export const createWinstonLogger = () => {
  const LOGGER_LOG_LEVEL = getString('LOGGER_LOG_LEVEL', 'silly');
  const winston = buildLogger({
    level: LOGGER_LOG_LEVEL,
    transports: [new transports.Console()],
  });
  return winston;
};

/**
 * @function createLogger
 * @name createLogger
 * @description create logger instance if not exists
 * @param {Object} [customLogger] custom logger to use
 * @return {Object} A new instance of of logger
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @private
 * @example
 *
 * import { createLogger } from '@lykmapipo/logger';
 * const logger = createLogger();
 * //=> Logger {}
 *
 * const logger = createLogger(customLogger);
 * //=> Logger {}
 *
 */
export const createLogger = customLogger => {
  // create logger
  if (!logger) {
    // use custom logger or winston logger
    logger = customLogger || createWinstonLogger();
    // set custom looger id
    logger.id = Date.now();
  }

  // return created logger
  return logger;
};

/**
 * @function disposeLogger
 * @name disposeLogger
 * @description reset current logger instance in use
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { disposeLogger } from '@lykmapipo/logger';
 * const logger = disposeLogger();
 * //=> null
 *
 */
export const disposeLogger = () => {
  logger = null;
  return logger;
};

/**
 * @function normalizeLog
 * @name normalizeLog
 * @param {Object|Error} log valid log object
 * @description normalize log structure to simple logger-able object
 * @return {Object} normalized log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { normalizeLog } from '@lykmapipo/logger';
 * const log = normalizeLog(log);
 * //=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 * const log = normalizeLog(error);
 * //=> { level: 'error', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
export const normalizeLog = log => {
  // defaults
  const defaults = { level: 'info', timestamp: new Date() };

  // normalize error log
  if (isError(log)) {
    let errorLog = mapErrorToObject(log, { stack: true });
    errorLog = mergeObjects(defaults, { level: 'error' }, errorLog);
    return errorLog;
  }

  // normalize normal log
  const normalLog = mergeObjects(defaults, log);
  return normalLog;
};

/**
 * @function error
 * @name error
 * @param {Error} log valid error log
 * @description log error
 * @return {Object} normalized error log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { error } from '@lykmapipo/logger';
 * const log = error(log);
 * //=> { level: 'error', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
export const error = log => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'error' };
  const normalized = mergeObjects(defaults, normalizeLog(log));

  if (canLog('error')) {
    logger.error(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function warn
 * @name warn
 * @param {Object} log valid warn log
 * @description log warn
 * @return {Object} normalized warn log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { warn } from '@lykmapipo/logger';
 * const log = warn(log);
 * //=> { level: 'warn', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
export const warn = log => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'warn' };
  const normalized = mergeObjects(defaults, normalizeLog(log));

  if (canLog('warn')) {
    logger.warn(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function info
 * @name info
 * @param {Object} log valid info log
 * @description log info
 * @return {Object} normalized info log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { info } from '@lykmapipo/logger';
 * const log = info(log);
 * //=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
export const info = log => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'info' };
  const normalized = mergeObjects(defaults, normalizeLog(log));

  if (canLog('info')) {
    logger.info(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function verbose
 * @name verbose
 * @param {Object} log valid verbose log
 * @description log verbose
 * @return {Object} normalized verbose log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { verbose } from '@lykmapipo/logger';
 * const log = verbose(log);
 * //=> { level: 'verbose', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
export const verbose = log => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'verbose' };
  const normalized = mergeObjects(defaults, normalizeLog(log));

  if (canLog('verbose')) {
    logger.verbose(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function debug
 * @name debug
 * @param {Object} log valid debug log
 * @description log debug
 * @return {Object} normalized debug log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { debug } from '@lykmapipo/logger';
 * const log = debug(log);
 * //=> { level: 'debug', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
export const debug = log => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'debug' };
  const normalized = mergeObjects(defaults, normalizeLog(log));

  if (canLog('debug')) {
    logger.debug(normalized);
  }

  // return normalized log structure
  return normalized;
};

export const silly = () => {};
export const log = () => {};
