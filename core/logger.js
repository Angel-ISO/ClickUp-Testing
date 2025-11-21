import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const modules = ['comments', 'folders', 'list', 'tags', 'task'];
modules.forEach(module => {
  const moduleDir = path.join(logsDir, module);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
});

function getModuleFromPath(testPath) {
  if (!testPath) return 'general';
  
  const lowerPath = testPath.toLowerCase();
  
  if (lowerPath.includes('comment')) return 'comments';
  if (lowerPath.includes('folder')) return 'folders';
  if (lowerPath.includes('list')) return 'list';
  if (lowerPath.includes('tag')) return 'tags';
  if (lowerPath.includes('task')) return 'task';
  
  return 'general';
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, service, context, module, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]`;
    
    if (service) {
      log += ` [${service}]`;
    }
    
    if (module) {
      log += ` [${module.toUpperCase()}]`;
    }
    
    log += `: ${message}`;
    

    const completeContext = {
      ...(context || {}),
    };
    
    if (module) {
      completeContext.module = module;
    }
    
    if (Object.keys(meta).length > 0 && !meta.stack) {
      Object.assign(completeContext, meta);
    }
    
    if (Object.keys(completeContext).length > 0) {
      log += ` ${JSON.stringify(completeContext)}`;
    }
    

    if (meta.stack) {
      log += `\n${meta.stack}`;
    }
    
    return log;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.printf(({ timestamp, level, message, service, context, module, ...meta }) => {
    let log = `${timestamp} ${level}`;
    
    if (service) {
      log += ` [${service}]`;
    }
    
    if (module) {
      log += ` [${module.toUpperCase()}]`;
    }
    
    log += `: ${message}`;
    
    const completeContext = {
      ...(context || {}),
    };
    
    if (module) {
      completeContext.module = module;
    }
    
    if (Object.keys(meta).length > 0 && !meta.stack) {
      Object.assign(completeContext, meta);
    }
    
    if (Object.keys(completeContext).length > 0) {
      log += ` ${JSON.stringify(completeContext)}`;
    }
    
    if (meta.stack) {
      log += `\n${meta.stack}`;
    }
    
    return log;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    })
  ],
  exitOnError: false
});

const moduleLoggers = {};

class Logger {
  static getModuleLogger(moduleName) {
    if (!moduleLoggers[moduleName]) {
      const moduleDir = path.join(logsDir, moduleName);
      
      moduleLoggers[moduleName] = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: customFormat,
        transports: [
          new winston.transports.Console({
            format: consoleFormat
          }),
          new winston.transports.File({
            filename: path.join(moduleDir, `${moduleName}.log`),
            maxsize: 5242880,
            maxFiles: 5
          }),
          new winston.transports.File({
            filename: path.join(moduleDir, `${moduleName}-error.log`),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
          })
        ],
        exitOnError: false
      });
    }
    
    return moduleLoggers[moduleName];
  }

  static child(context) {
    return logger.child({ context });
  }

  static _buildContext(meta = {}) {
    const context = {};
    
    if (meta.testId) context.testId = meta.testId;
    if (meta.testName) context.testName = meta.testName;
    if (meta.testPath) context.testPath = meta.testPath;
    if (meta.type) context.type = meta.type;
    if (meta.status) context.status = meta.status;
    if (meta.duration) context.duration = meta.duration;
    if (meta.result) context.result = meta.result;
    if (meta.errors) context.errors = meta.errors;
    
    return context;
  }

  static fatal(message, meta = {}) {
    const module = meta.module || getModuleFromPath(meta.testPath);
    const context = this._buildContext(meta);
    const logData = { service: 'clickup-test-framework', context, module, ...meta };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.error(message, logData); 
    }
    logger.error(message, logData);
  }

  static error(message, meta = {}) {
    const errorMeta = meta instanceof Error 
      ? { error: meta.message, stack: meta.stack }
      : meta;
    
    const module = errorMeta.module || getModuleFromPath(errorMeta.testPath);
    const context = this._buildContext(errorMeta);
    const logData = { service: 'clickup-test-framework', context, module, ...errorMeta };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.error(message, logData);
    }
    logger.error(message, logData);
  }

  static warn(message, meta = {}) {
    const module = meta.module || getModuleFromPath(meta.testPath);
    const context = this._buildContext(meta);
    const logData = { service: 'clickup-test-framework', context, module, ...meta };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.warn(message, logData);
    }
    logger.warn(message, logData);
  }

  static info(message, meta = {}) {
    const module = meta.module || getModuleFromPath(meta.testPath);
    const context = this._buildContext(meta);
    const logData = { service: 'clickup-test-framework', context, module, ...meta };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.info(message, logData);
    }
    logger.info(message, logData);
  }

  static debug(message, meta = {}) {
    const module = meta.module || getModuleFromPath(meta.testPath);
    const context = this._buildContext(meta);
    const logData = { service: 'clickup-test-framework', context, module, ...meta };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.debug(message, logData);
    }
    logger.debug(message, logData);
  }

  static trace(message, meta = {}) {
    const module = meta.module || getModuleFromPath(meta.testPath);
    const context = this._buildContext(meta);
    const logData = { service: 'clickup-test-framework', context, module, ...meta };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.silly(message, logData);
    }
    logger.silly(message, logData);
  }

  static testStart(testName, testPath = '') {
    const module = getModuleFromPath(testPath);
    const context = {
      type: 'TEST_START',
      testName,
      testPath,
      testId: testPath ? path.basename(testPath, path.extname(testPath)) : 'unknown'
    };
    const logData = {
      service: 'clickup-test-framework',
      context,
      module
    };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.info(`Test Started: ${testName}`, logData);
    }
    logger.info(`Test Started: ${testName}`, logData);
  }

  static testEnd(testName, status, duration = 0, testPath = '') {
    const module = getModuleFromPath(testPath);
    const level = status === 'failed' ? 'error' : 'info';
    const context = {
      type: 'TEST_END',
      testName,
      testPath,
      testId: testPath ? path.basename(testPath, path.extname(testPath)) : 'unknown',
      status,
      duration: `${duration}ms`
    };
    const logData = {
      service: 'clickup-test-framework',
      context,
      module
    };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      moduleLogger.log(level, `Test ${status.toUpperCase()}: ${testName}`, logData);
    }
    logger.log(level, `Test ${status.toUpperCase()}: ${testName}`, logData);
  }

  static validation(schemaName, isValid, errors = null, testPath = '') {
    const module = getModuleFromPath(testPath);
    const context = {
      type: 'VALIDATION',
      schemaName,
      result: isValid ? 'PASSED' : 'FAILED',
      testPath,
      testId: testPath ? path.basename(testPath, path.extname(testPath)) : 'unknown'
    };
    
    if (!isValid && errors) {
      context.errors = errors;
    }
    
    const logData = {
      service: 'clickup-test-framework',
      context,
      module
    };
    
    if (module && module !== 'general') {
      const moduleLogger = this.getModuleLogger(module);
      if (isValid) {
        moduleLogger.info(`Schema validation PASSED: ${schemaName}`, logData);
      } else {
        moduleLogger.error(`Schema validation FAILED: ${schemaName}`, logData);
      }
    }
    
    if (isValid) {
      logger.info(`Schema validation PASSED: ${schemaName}`, logData);
    } else {
      logger.error(`Schema validation FAILED: ${schemaName}`, logData);
    }
  }

  static getWinstonLogger() {
    return logger;
  }
  
  static getModuleFromPath(testPath) {
    return getModuleFromPath(testPath);
  }
}

export default Logger;