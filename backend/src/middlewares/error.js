import _ from "lodash";
import errorLogger from "../errorLogger";

export default function(err, req, res, next) {
  const error = _.pick(err, ["message", "name"]);
  switch (error.name) {
    case "ValidationError":
      //mongoose/mongo validation errors
      res.status(422).json(error);
      break;
    case "UnauthorizedError":
      //eg: token missing on auth header
      res.status(401).json(error);
      break;

    default:
      errorLogger.error(err.message, err);
      res.status(500).json(error);
      break;
  }
  // if (process.env.NODE_ENV !== "production") {
  //   console.log(err);
  // }
  next(err);
}
