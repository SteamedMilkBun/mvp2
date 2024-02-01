DROP TABLE IF EXISTS character CASCADE;
DROP TABLE IF EXISTS item;

CREATE TABLE character (
    char_id SERIAL PRIMARY KEY,
    char_name VARCHAR(50),
    char_race VARCHAR(30)
);

CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(50),
    item_value SMALLINT,
    owned_by_char_id SMALLINT REFERENCES character(char_id)
);