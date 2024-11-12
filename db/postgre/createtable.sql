CREATE DATABASE DB1;
CREATE ROLE postgres WITH LOGIN;

GRANT ALL PRIVILEGES ON DATABASE DB1 TO root;
\c db1

CREATE EXTENSION pgcrypto;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    pseudo TEXT NOT NULL
);
CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE owners(
    userid SERIAL NOT NULL,
    groupeid SERIAL NOT NULL,
    PRIMARY KEY(userid, groupeid)
);
CREATE TABLE editors(
    userid SERIAL NOT NULL,
    groupeid SERIAL NOT NULL,
    PRIMARY KEY(userid, groupeid)
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);
CREATE TABLE categoryingroup(
    categoryid SERIAL NOT NULL,
    groupeid SERIAL NOT NULL,
    color TEXT NOT NULL,
    PRIMARY KEY(categoryid, groupeid)
);

CREATE TABLE bookmarks(
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);
CREATE TABLE bookmarkingroup(
    bookmarkid SERIAL NOT NULL,
    groupeid SERIAL NOT NULL,
    PRIMARY KEY(bookmarkid, groupeid)
);
CREATE TABLE bookmarkincategory(
    bookmarkid SERIAL NOT NULL,
    categoryid SERIAL NOT NULL,
    PRIMARY KEY(bookmarkid, categoryid)
);
