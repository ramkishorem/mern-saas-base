import _ from "lodash";
import logger from "../logger";

export default function(err, req, res, next) {
  const error = _.pick(err, ["message", "name"]);
  if (error.name === "ValidationError") {
    logger.error(err.message, err);
    res.status(422).json(error);
  } else {
    logger.error(err.message, err);
    res.status(500).json(error);
  }
  next(err);
}
