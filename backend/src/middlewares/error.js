import _ from "lodash";
import errorLogger from "../errorLogger";

export default function(err, req, res, next) {
  const error = _.pick(err, ["message", "name"]);
  errorLogger.error(err.message, err);
  if (error.name === "ValidationError") {
    res.status(422).json(error);
  } else if (error.name === "UnauthorizedError") {
    res.status(403).json(error);
  } else {
    res.status(500).json(error);
  }
  next(err);
}
