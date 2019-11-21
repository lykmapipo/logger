'use strict';

const lodash = require('lodash');
const env = require('@lykmapipo/env');
const common = require('@lykmapipo/common');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

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
  const isEnabled = env.getBoolean('LOGGER_LOG_ENABLED', true);
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
  const can = logger && lodash.isFunction(logger[level]) && isLoggingEnabled();
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
  const LOGGER_LOG_LEVEL = env.getString('LOGGER_LOG_LEVEL', 'audit');
  const LOGGER_USE_CONSOLE = env.getString('LOGGER_USE_CONSOLE', true);
  const LOGGER_USE_FILE = env.getString('LOGGER_USE_FILE', true);
  const LOGGER_LOG_PATH = env.getString('LOGGER_LOG_PATH', './logs/app-%DATE%.log');

  // create log transports
  let logTransports = [];
  if (LOGGER_USE_CONSOLE) {
    logTransports = [...logTransports, new winston.transports.Console()];
  }
  if (LOGGER_USE_FILE && LOGGER_LOG_PATH) {
    logTransports = [
      ...logTransports,
      new DailyRotateFile({ filename: LOGGER_LOG_PATH }),
    ];
  }

  // register colors
  winston.addColors(LOG_COLORS);

  // create winston logger
  const winston$1 = winston.createLogger({
    level: LOGGER_LOG_LEVEL,
    levels: LOG_LEVELS,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({
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
      winston.format.json()
    ),
    transports: logTransports,
  });

  // return winston logger instance
  return winston$1;
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
 * @param {String|Object|Error} params valid log params
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
const normalizeLog = (...params) => {
  // normalize args
  let log = { level: 'info', timestamp: new Date() };

  // merge params
  lodash.forEach([].concat([...params]), param => {
    // pack message
    if (lodash.isString(param)) {
      log = common.mergeObjects(log, { message: param });
    }

    // pack metadata
    if (lodash.isPlainObject(param)) {
      log = common.mergeObjects(log, param);
    }

    // pack error
    if (lodash.isError(param)) {
      const errorLog = common.mapErrorToObject(param, { stack: true });
      log = common.mergeObjects(log, { level: 'error' }, errorLog);
    }
  });

  // remove ignored fields
  let ignoredFields = ['password', 'secret', 'token', 'client_secret'];
  ignoredFields = env.getStrings('LOGGER_LOG_IGNORE', ignoredFields);
  log = common.mergeObjects(lodash.omit(log, ...ignoredFields));

  // return normalized log
  return log;
};

/**
 * @function error
 * @name error
 * @param {String|Object|Error} params valid log params
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
const error = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'error' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('error')) {
    logger.error(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function warn
 * @name warn
 * @param {String|Object|Error} params valid log params
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
const warn = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'warn' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('warn')) {
    logger.warn(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function info
 * @name info
 * @param {String|Object|Error} params valid log params
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
const info = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'info' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('info')) {
    logger.info(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function verbose
 * @name verbose
 * @param {String|Object|Error} params valid log params
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
const verbose = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'verbose' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('verbose')) {
    logger.verbose(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function debug
 * @name debug
 * @param {String|Object|Error} params valid log params
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
const debug = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'debug' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('debug')) {
    logger.debug(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function silly
 * @name silly
 * @param {String|Object|Error} params valid log params
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
const silly = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'silly' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('silly')) {
    logger.silly(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function event
 * @name event
 * @param {String|Object|Error} params valid log params
 * @description log event
 * @return {Object} normalized event log object
 * @since 0.5.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { event } from '@lykmapipo/logger';
 * const log = event('user_click', params);
 * //=> { level: 'event', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
const event = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'event' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

  if (canLog('event')) {
    logger.event(normalized);
  }

  // return normalized log structure
  return normalized;
};

/**
 * @function audit
 * @name audit
 * @param {String|Object|Error} params valid log params
 * @description log audit
 * @return {Object} normalized audit log object
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { audit } from '@lykmapipo/logger';
 * const log = audit('user_edit', {from:..., to:...});
 * //=> { level: 'audit', timestamp: '2019-04-10T13:37:35.643Z', ...}
 *
 */
const audit = (...params) => {
  // obtain logger
  logger = createLogger();

  // normalize log
  const defaults = { level: 'audit' };
  const normalized = common.mergeObjects(defaults, normalizeLog(...params));

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

exports.audit = audit;
exports.canLog = canLog;
exports.createLogger = createLogger;
exports.createWinstonLogger = createWinstonLogger;
exports.debug = debug;
exports.disposeLogger = disposeLogger;
exports.error = error;
exports.event = event;
exports.info = info;
exports.isLoggingEnabled = isLoggingEnabled;
exports.normalizeLog = normalizeLog;
exports.silly = silly;
exports.stream = stream;
exports.verbose = verbose;
exports.warn = warn;
