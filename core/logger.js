class Logger {
  static info(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  }

  static warn(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  static debug(message, ...args) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
}

export default Logger;