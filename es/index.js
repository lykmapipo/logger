import { isFunction, isError, omit } from 'lodash';
import { getBoolean, getString, getStrings } from '@lykmapipo/env';
import { mapErrorToObject, mergeObjects } from '@lykmapipo/common';
import { transports, createLogger as createLogger$1, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

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
const isLoggingEnabled = () => {
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
const canLog = level => {
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
const createWinstonLogger = () => {
  // obtain configs
  const LOGGER_LOG_LEVEL = getString('LOGGER_LOG_LEVEL', 'silly');
  const LOGGER_USE_CONSOLE = getString('LOGGER_USE_CONSOLE', true);
  const LOGGER_USE_FILE = getString('LOGGER_USE_FILE', true);
  const LOGGER_LOG_PATH = getString('LOGGER_LOG_PATH', './logs/app-%DATE%.log');

  // create log transports
  let logTransports = [];
  if (LOGGER_USE_CONSOLE) {
    logTransports = [...logTransports, new transports.Console()];
  }
  if (LOGGER_USE_FILE && LOGGER_LOG_PATH) {
    logTransports = [
      ...logTransports,
      new DailyRotateFile({ filename: LOGGER_LOG_PATH }),
    ];
  }

  // create winston logger
  const winston = createLogger$1({
    level: LOGGER_LOG_LEVEL,
    format: format.combine(
      format.timestamp(),
      format.metadata({
        fillExcept: [
          'level',
          'message',
          'timestamp',
          'correlation',
          'event',
          'label',
          'tags',
        ],
      }),
      format.json()
    ),
    transports: logTransports,
  });

  // return winston logger instance
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
const createLogger = customLogger => {
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
const disposeLogger = () => {
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
 * @version 0.2.0
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
const normalizeLog = log => {
  // defaults
  const defaults = { level: 'info', timestamp: new Date() };

  // normalize error log
  if (isError(log)) {
    let errorLog = mapErrorToObject(log, { stack: true });
    errorLog = mergeObjects(defaults, { level: 'error' }, errorLog);
    return errorLog;
  }

  // normalize normal log
  let normalLog = mergeObjects(defaults, log);

  // remove ignored fields
  let ignoredFields = ['password', 'secret', 'token', 'client_secret'];
  ignoredFields = getStrings('LOGGER_LOG_IGNORE', ignoredFields);
  normalLog = mergeObjects(omit(normalLog, ...ignoredFields));

  // return normalized log
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
const error = log => {
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
const warn = log => {
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
const info = log => {
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
const verbose = log => {
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
const debug = log => {
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

/**
 * @function silly
 * @name silly
 * @param {Object} log valid silly log
 * @description log silly
 * @return {Object} normalized silly log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { silly } from '@lykmapipo/logger';
 * const log = silly(log);
 * //=> { level: 'silly', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
const silly = log => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'silly' };
  const normalized = mergeObjects(defaults, normalizeLog(log));

  if (canLog('silly')) {
    logger.silly(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function stream
 * @name stream
 * @description expose log stream for use with morgan logger
 * @return {Object} normalized stream log object
 * @since 0.1.0
 * @version 0.3.0
 * @static
 * @public
 * @example
 *
 * import { stream } from '@lykmapipo/logger';
 * import morgan from 'morgan';
 *
 * app.use(morgan('combined'), { stream });
 * //=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
const stream = {
  write: message => info({ message: message.trim() }),
};

export { canLog, createLogger, createWinstonLogger, debug, disposeLogger, error, info, isLoggingEnabled, normalizeLog, silly, stream, verbose, warn };
