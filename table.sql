CREATE TABLE days_table(
    days VARCHAR (100),
    id serial primary key

);

CREATE TABLE shifts(
    waiter_name VARCHAR (100),
    waiter_id serial primary key,
    days_selected VARCHAR (100)

)

INSERT INTO shifts 
(waiter_name, days_selected) VALUES ('yeu', 'Tuesday');

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