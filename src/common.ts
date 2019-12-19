declare const org: any;

/**
 * A wrapper around the slf4j logger.
 *
 * The wrapper is required because when calling java functions with var-args rhino is unable to select the correct logging function.
 * This is because slf4j logging methods are being overloaded, and Rhino has trouble choosing between var-args and specific
 *
 * To be able to see the log output you need ensure that "%3$s" is added to the logging format, which is the logging class name.
 *
 * For example in logging.properties change:
 *    java.util.logging.SimpleFormatter.format = %1$tb %1$td, %1$tY %1$tl:%1$tM:%1$tS.%1$tL %1$Tp %2$s%n%4$s: %5$s%6$s%n
 * to:
 *    java.util.logging.SimpleFormatter.format = %1$tb %1$td, %1$tY %1$tl:%1$tM:%1$tS.%1$tL %1$Tp %3$s %2$s%n%4$s: %5$s%6$s%n
 *
 * @param loggerName name of the logger to create
 */
export const getLogger = loggerName => {
  const underlyingLogger = org.slf4j.LoggerFactory.getLogger(loggerName);
  return {
    error(message, ...rest) {
      underlyingLogger.error(message, rest);
    },
    warn(message, ...rest) {
      underlyingLogger.warn(message, rest);
    },
    info(message, ...rest) {
      underlyingLogger.info(message, rest);
    },
    debug(message, ...rest) {
      underlyingLogger.debug(message, rest);
    },
    trace(message, ...rest) {
      underlyingLogger.trace(message, rest);
    },
    isErrorEnabled() {
      return underlyingLogger.isErrorEnabled();
    },
    isWarnEnabled() {
      return underlyingLogger.isWarnEnabled();
    },
    isInfoEnabled() {
      return underlyingLogger.isInfoEnabled();
    },
    isDebugEnabled() {
      return underlyingLogger.isDebugEnabled();
    },
    isTraceEnabled() {
      return underlyingLogger.isTraceEnabled();
    }
  };
};
