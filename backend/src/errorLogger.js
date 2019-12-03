import winston from "winston";
import * as winstonMongoDB from "winston-mongodb";
import { dbHost } from "./db";
const { combine, timestamp, prettyPrint } = winston.format;

const errorLogger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.MongoDB({
      db: dbHost,
      level: "error",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        poolSize: 2,
        autoReconnect: true
      }
    })
    // new winston.transports.File({ filename: "combined.log" })
  ],

  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  errorLogger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export default errorLogger;
