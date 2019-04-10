import { createLogger as buildLogger, transports } from 'winston';

// ref logger instance
let logger;

/**
 * @function logger
 * @name logger
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
 */
export const createLogger = customLogger => {
  // create logger
  if (!logger) {
    // use custom logger
    if (customLogger) {
      logger = customLogger;
    }
    // use library logger
    else {
      logger = buildLogger({
        level: 'silly',
        transports: [new transports.Console()],
      });
      // set custom looger id
      logger.id = Date.now();
    }
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

export const error = () => {};
export const warn = () => {};
export const info = () => {};
export const verbose = () => {};
export const debug = () => {};
export const silly = () => {};
