CREATE TABLE days_table(
    days VARCHAR (100),
    id serial primary key

);

CREATE TABLE shifts(
    waiter_name VARCHAR (100),
    waiter_id int,
    days_selected VARCHAR (100)
    FOREIGN KEY(waiter_id) REFERENCES users(user_id)


);

CREATE TABLE users(
    user_name VARCHAR (100),
    user_password TEXT,
    user_id serial primary key
)
INSERT INTO days_table 
(days) VALUES ('Monday');

INSERT INTO days_table 
(days) VALUES ('Tuesday');

INSERT INTO days_table 
(days) VALUES ('Wednesday');

INSERT INTO days_table 
(days) VALUES ('Thursday');

INSERT INTO days_table 
(days) VALUES ('Friday');

INSERT INTO days_table 
(days) VALUES ('Saturday');

INSERT INTO days_table 
(days) VALUES ('Sunday');