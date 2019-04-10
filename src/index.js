import { isError } from 'lodash';
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

export const error = () => {};
export const warn = () => {};
export const info = () => {};
export const verbose = () => {};
export const debug = () => {};
export const silly = () => {};
