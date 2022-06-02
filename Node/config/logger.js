const { createLogger, transports, format } = require("winston");

//create logger and store successfull response in info.log file and
//error responses store in errors.log file
const logger = createLogger({
  transports: [
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.json()
      ),
    }),
    new transports.File({
      filename: "errors.log",
      level: "error",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.json()
      ),
    }),
  ],
});

//export the logger

module.exports = { logger };
