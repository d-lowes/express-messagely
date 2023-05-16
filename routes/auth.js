"use strict";

const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthorizedError } = require("../expressError");

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) throw new BadRequestError('Invalid inputs');

    if (await User.authenticate(username, password) === true) {
      let token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    } else {
      throw new UnauthorizedError("Could not authenticate user.");
    }
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {
  const { username, password, first_name, last_name, phone} = req.body;

  if (!req.body) throw new BadRequestError('Invalid inputs');

  const user = await User.register(username,
                                   password,
                                   first_name,
                                   last_name,
                                   phone)
  let token = jwt.sign({ user: user.username }, SECRET_KEY);
  return res.json({ token });
});
module.exports = router;