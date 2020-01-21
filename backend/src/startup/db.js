import mongoose from "mongoose";
import debugLib from "debug";
import config from "config";
const dbDebug = debugLib("backend:db");
require("dotenv").config();
const dbPath = config.get("db.path");
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

let dbHost = config.get("db.protocol");
if (dbUsername !== undefined) dbHost += dbUsername + ":" + dbPassword + "@";
dbHost += dbPath;

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
};

/**
 * Mongoose connecting
 */

dbDebug("DB host: " + dbHost);

mongoose
  .connect(dbHost, dbOptions)
  .then(() => dbDebug("connected to db!"))
  .catch(err => dbDebug(err));

export { dbHost, dbOptions };
