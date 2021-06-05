import { forEach, isString, isPlainObject, isError, omit, isFunction } from 'lodash';
import { getBoolean, getString, getStrings } from '@lykmapipo/env';
import { mergeObjects, mapErrorToObject } from '@lykmapipo/common';
import { transports, addColors, createLogger as createLogger$1, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// ref logger instance
let logger;

// assumed log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
  event: 7,
  audit: 9,
};

// assumed log colors
const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta',
  event: 'green',
  audit: 'blue',
};

/**
 * @function isLoggingEnabled
 * @name isLoggingEnabled
 * @description check if logging is enabled
 * @returns {boolean} whether logging is enabled
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { isLoggingEnabled } from '@lykmapipo/logger';
 * const enabled = isLoggingEnabled();
 * //=> true
 */
const isLoggingEnabled = () => {
  const isEnabled = getBoolean('LOGGER_LOG_ENABLED', true);
  return isEnabled;
};

/**
 * @function canLog
 * @name canLog
 * @description check if logging is enabled and logger has log level
 * @param {string} level valid log level
 * @returns {boolean} whether log level can be logged
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { canLog } from '@lykmapipo/logger';
 * const can = canLog('error');
 * //=> true
 */
const canLog = (level) => {
  const can = logger && isFunction(logger[level]) && isLoggingEnabled();
  return can;
};

/**
 * @function createWinstonLogger
 * @name createWinstonLogger
 * @description create winston logger instance
 * @returns {object} A new instance of winston logger
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @private
 * @example
 *
 * import { createWinstonLogger } from '@lykmapipo/logger';
 * const logger = createWinstonLogger();
 * //=> DerivedLogger {}
 */
const createWinstonLogger = () => {
  // obtain configs
  const LOGGER_LOG_LEVEL = getString('LOGGER_LOG_LEVEL', 'audit');
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

  // register colors
  addColors(LOG_COLORS);

  // create winston logger
  const winston = createLogger$1({
    level: LOGGER_LOG_LEVEL,
    levels: LOG_LEVELS,
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
 * @param {object} [customLogger] custom logger to use
 * @returns {object} A new instance of of logger
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
 */
const createLogger = (customLogger) => {
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
 * @returns {*} null if logger disposed successfully
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { disposeLogger } from '@lykmapipo/logger';
 * const logger = disposeLogger();
 * //=> null
 */
const disposeLogger = () => {
  logger = null;
  return logger;
};

/**
 * @function normalizeLog
 * @name normalizeLog
 * @param {string | object | Error} params valid log params
 * @description normalize log structure to simple logger-able object
 * @returns {object} normalized log object
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
 */
const normalizeLog = (...params) => {
  // normalize args
  let log = { level: 'info', timestamp: new Date() };

  // merge params
  forEach([].concat([...params]), (param) => {
    // pack message
    if (isString(param)) {
      log = mergeObjects(log, { message: param });
    }

    // pack metadata
    if (isPlainObject(param)) {
      log = mergeObjects(log, param);
    }

    // pack error
    if (isError(param)) {
      const errorLog = mapErrorToObject(param, { stack: true });
      log = mergeObjects(log, { level: 'error' }, errorLog);
    }
  });

  // remove ignored fields
  let ignoredFields = ['password', 'secret', 'token', 'client_secret'];
  ignoredFields = getStrings('LOGGER_LOG_IGNORE', ignoredFields);
  log = mergeObjects(omit(log, ...ignoredFields));

  // return normalized log
  return log;
};

/**
 * @function error
 * @name error
 * @param {string | object | Error} params valid log params
 * @description log error
 * @returns {object} normalized error log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { error } from '@lykmapipo/logger';
 * const log = error(log);
 * //=> { level: 'error', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const error = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'error' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('error')) {
    logger.error(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function warn
 * @name warn
 * @param {string | object | Error} params valid log params
 * @description log warn
 * @returns {object} normalized warn log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { warn } from '@lykmapipo/logger';
 * const log = warn(log);
 * //=> { level: 'warn', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const warn = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'warn' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('warn')) {
    logger.warn(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function info
 * @name info
 * @param {string | object | Error} params valid log params
 * @description log info
 * @returns {object} normalized info log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { info } from '@lykmapipo/logger';
 * const log = info(log);
 * //=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const info = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'info' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('info')) {
    logger.info(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function verbose
 * @name verbose
 * @param {string | object | Error} params valid log params
 * @description log verbose
 * @returns {object} normalized verbose log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { verbose } from '@lykmapipo/logger';
 * const log = verbose(log);
 * //=> { level: 'verbose', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const verbose = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'verbose' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('verbose')) {
    logger.verbose(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function debug
 * @name debug
 * @param {string | object | Error} params valid log params
 * @description log debug
 * @returns {object} normalized debug log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { debug } from '@lykmapipo/logger';
 * const log = debug(log);
 * //=> { level: 'debug', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const debug = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'debug' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('debug')) {
    logger.debug(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function silly
 * @name silly
 * @param {string | object | Error} params valid log params
 * @description log silly
 * @returns {object} normalized silly log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { silly } from '@lykmapipo/logger';
 * const log = silly(log);
 * //=> { level: 'silly', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const silly = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'silly' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('silly')) {
    logger.silly(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function event
 * @name event
 * @param {string | object | Error} params valid log params
 * @description log event
 * @returns {object} normalized event log object
 * @since 0.5.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { event } from '@lykmapipo/logger';
 * const log = event('user_click', params);
 * //=> { level: 'event', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const event = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'event' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('event')) {
    logger.event(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function audit
 * @name audit
 * @param {string | object | Error} params valid log params
 * @description log audit
 * @returns {object} normalized audit log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { audit } from '@lykmapipo/logger';
 * const log = audit('user_edit', {from:..., to:...});
 * //=> { level: 'audit', timestamp: '2019-04-10T13:37:35.643Z', ...}
 */
const audit = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'audit' };
  const normalized = mergeObjects(defaults, normalizeLog(...params));

  if (canLog('audit')) {
    logger.audit(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function stream
 * @name stream
 * @description expose log stream for use with morgan logger
 * @returns {object} normalized stream log object
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
 */
const stream = {
  write: (message) => info({ message: message.trim() }),
};

export { audit, canLog, createLogger, createWinstonLogger, debug, disposeLogger, error, event, info, isLoggingEnabled, normalizeLog, silly, stream, verbose, warn };
