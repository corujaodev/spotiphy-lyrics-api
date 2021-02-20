const opts = {
  errorEventName:'error',
      logDirectory:'./logs',
      fileNamePattern:'roll-<DATE>.log',
      dateFormat:'DD.MM.YYYY'
};

const logger = require('simple-node-logger').createRollingFileLogger(opts);

export default logger;