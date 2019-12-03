import _ from "lodash";
import errorLogger from "../errorLogger";

export default function(err, req, res, next) {
  const error = _.pick(err, ["message", "name"]);
  if (error.name === "ValidationError") {
    errorLogger.error(err.message, err);
    res.status(422).json(error);
  } else {
    errorLogger.error(err.message, err);
    res.status(500).json(error);
  }
  next(err);
}
