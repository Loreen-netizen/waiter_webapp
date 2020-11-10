
CREATE TABLE days(
name text not null,
id serial primary key
);


CREATE TABLE waiters(
id serial primary key,
name text not null
);

CREATE TABLE shifts(
waiter_id int not null,
day_id int not null,
FOREIGN KEY (waiter_id) REFERENCES waiters (id),
FOREIGN KEY (day_id) REFERENCES days (id)
);



INSERT INTO days 
(name) VALUES ('Monday');

INSERT INTO days 
(name) VALUES ('Tuesday');

INSERT INTO days 
(name) VALUES ('Wednesday');

INSERT INTO days 
(name) VALUES ('Thursday');

INSERT INTO days 
(name) VALUES ('Friday');

INSERT INTO days 
(name) VALUES ('Saturday');

INSERT INTO days 
(name) VALUES ('Sunday');
