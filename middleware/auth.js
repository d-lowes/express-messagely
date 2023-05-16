"use strict";

/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromRequest = req.query._token || req.body._token;
    const payload = jwt.verify(tokenFromRequest, SECRET_KEY);
    res.locals.user = payload;
    return next();
  } catch (err) {
    // error in this middleware isn't error -- continue on
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  console.log("res.locals.user =", res.locals.user);
  if (!res.locals.user) throw new UnauthorizedError();

  return next();
}

/** Middleware: Requires user is user for route. */

function ensureCorrectUser(req, res, next) {
  console.log("res.locals.user =", res.locals.user);
  const currentUser = res.locals.user;
  const hasUnauthorizedUsername = currentUser?.username !== req.params.username;

  if (!currentUser || hasUnauthorizedUsername) {
    throw new UnauthorizedError();
  }

  return next();
}

/** Middleware: Makes sure that the currently-logged-in users is either the to
 *  or from user. */

async function ensureCorrectToandFromUser(req, res, next) {
  console.log("res.locals.user =", res.locals.user);
  const currentUser = res.locals.user;

  const message = await Message.get(req.params.id);

  if (currentUser.username === message.to_user.username ||
    currentUser.username === message.from_user.username) {
    return next();
  }
  throw new UnauthorizedError("Unauthorized access.");
}

/** Middleware: Makes sure that the only the intended recipient can mark as
 *  read. */

async function ensureCorrectRecipient(req, res, next) {
  console.log("res.locals.user =", res.locals.user);
  const currentUser = res.locals.user;

  const message = await Message.get(req.params.id);

  if (currentUser.username === message.to_user.username) {
    return next();
  }
  throw new UnauthorizedError("Unauthorized access.");
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureCorrectToandFromUser,
  ensureCorrectRecipient
};
