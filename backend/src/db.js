import config from "config";
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

export { dbHost, dbOptions };
