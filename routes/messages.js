"use strict";

const Router = require("express").Router;
const router = new Router();
const { UnauthorizedError } = require("../expressError");
const { authenticateJWT,
        ensureLoggedIn,
        ensureCorrectUser } = require("../middleware/auth");
const message = require("../models/message");

/*
any logged-in user can see the list of users
only that user can view their get-user-detail route, or their from-messages or to-messages routes.
only the sender or recipient of a message can view the message-detail route
only the recipient of a message can mark it as read
any logged in user can send a message to any other user
*/

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  const message = await Message.get(req.param.id);
  if (res.locals.user.username === message.to_username ||
    res.locals.user.username === message.from_username) {
    return res.json ({ message });
  } else {
    throw new UnauthorizedError("Unauthorized access.");
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  const { from_username, to_username, body } = req.body;
  const message = await Message.create(from_username, to_username, body);
  return res.json ({ message });
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureCorrectUser, async function (req, res, next) {
  const message = await Message.get(req.param.id);
  if (res.locals.user.username === message.to_username) {
    await message.markRead(req.param.id);
    return res.json ({ message });
  } else {
    throw new UnauthorizedError("Unauthorized access.");
  }
});

module.exports = router;