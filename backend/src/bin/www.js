#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app";
import debugLib from "debug";
import http from "http";
import mongoose from "mongoose";
import config from "config";
const debug = debugLib("backend:server");
const dbDebug = debugLib("backend:db");
require("dotenv").config();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Mongoose connecting
 */
const db_path = config.get("db.path");
const db_username = process.env.DB_USER;
const db_password = process.env.DB_PASS;

let db_host = config.get("db.protocol");
if (db_username !== undefined) db_host += db_username + ":" + db_password + "@";
db_host += db_path;
dbDebug("DB host: " + db_host);

mongoose
  .connect(db_host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => dbDebug("connected to db!"))
  .catch(err => dbDebug(err));

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
