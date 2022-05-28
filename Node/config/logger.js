const winston = require("winston");
const { createLogger, transports, format } = require("winston");

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
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.json()
      ),
    }),
  ],
});
module.exports = { logger };
