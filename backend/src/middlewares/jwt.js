import jwt from "express-jwt";

export default function() {
  return jwt({ secret: process.env.JWT_SECRET_KEY });
}
