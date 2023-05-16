"use strict";

const Router = require("express").Router;
const router = new Router();
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
} = require("../middleware/auth");
const Message = require("../models/message");

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
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  const message = await Message.get(req.params.id);
  console.log("message= ", message);
  if (
    res.locals.user.username === message.to_user.username ||
    res.locals.user.username === message.from_user.username
  ) {
    return res.json({ message });
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
  const { to_username, body } = req.body;
  const from_username = res.locals.user.username;
  console.log("from_username= ", from_username);
  const message = await Message.create({ from_username, to_username, body });
  console.log("message= ", message);
  return res.json({ message });
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
  const message = await Message.get(req.params.id);
  if (res.locals.user.username === message.to_user.username) {
    await Message.markRead(req.params.id);
    console.log("message= ", message);
    return res.json({ message });
  } else {
    throw new UnauthorizedError("Unauthorized access.");
  }
});

module.exports = router;
