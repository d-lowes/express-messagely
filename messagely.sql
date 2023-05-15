\echo 'Delete and recreate messagely db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely;
CREATE DATABASE messagely;
\connect messagely


CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);

INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
VALUES ('mkim', '12345', 'Meeran', 'Kim', '1111111111', current_timestamp, current_timestamp),
       ('dlowes', '11111', 'Dylan', 'Lowes', '2222222222', current_timestamp, current_timestamp);

INSERT INTO messages (from_username, to_username, body, sent_at, read_at)
VALUES ('mkim', 'dlowes', 'Its Monday', current_timestamp, current_timestamp),
 ('dlowes', 'mkim', 'Awwwww', current_timestamp, current_timestamp);


\echo 'Delete and recreate messagely_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE messagely_test;
CREATE DATABASE messagely_test;
\connect messagely_test

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users,
  to_username TEXT NOT NULL REFERENCES users,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE);



