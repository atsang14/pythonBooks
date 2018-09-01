drop database if exists pythonbooks_db;

create database pythonbooks_db;

use pythonbooks_db;

CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rating_value FLOAT (11,2) NOT NULL, 
  rating_number INT NOT NULL, 
  PRIMARY KEY(id)
);

INSERT INTO users (name, email, username, password, rating_value, rating_number)
VALUES
("Kelly Hook", "kellymhook@gmail.com", "kmhook", "hello", 0, 0),
("Austin Tsang", "atsang14@gmail.com", "atsang", "hello", 0, 0),
("Yanan Meng", "meng.yanan@gmail.com", "ymeng", "hello", 0, 0);

SELECT * FROM users;

CREATE TABLE postings(
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_title VARCHAR(255) NOT NULL,
  price FLOAT (11,2) NOT NULL,
  book_condition VARCHAR(255) NOT NULL,
  isbn VARCHAR(14) NOT NULL,
  time_stamp DATETIME,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- postings.id=users.id

INSERT INTO postings (user_id, book_title, price, book_condition, isbn, time_stamp)
VALUES
(1,"Single Variable Calculus: Early Transcendentals 8th Edition",142.11,"Fair","1305270339",NOW()),
(2,"Campbell Biology 11th Edition",199.49,"Fair","0134093410",NOW()),
(1,"Single Variable Calculus: Early Transcendentals 8th Edition",200.00,"Fair","1305270339",NOW()),
(1,"Single Variable Calculus: Early Transcendentals 8th Edition",500.20,"Fair","1305270339",NOW()),
(3,"Physics: Principles with Applications 5th Edition",14.77,"Fair","0136119719",NOW());

SELECT * FROM postings;

CREATE TABLE searches(
  id INT NOT NULL AUTO_INCREMENT,
  isbn VARCHAR(14) NOT NULL UNIQUE,
  number_of_search INT NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO searches (isbn, number_of_search)
VALUES
("1305270339", 0),
("0134093410", 0);

SELECT * FROM searches;
-- mysql.server start
-- mysql.server stop
-- mysql -u root
-- password: password
-- source.users.sql