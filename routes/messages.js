"use strict";

const Router = require("express").Router;
const router = new Router();

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


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/


module.exports = router;