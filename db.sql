CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	content VARCHAR(255) NOT NULL,
	createdAt timestamp NOT NULL default CURRENT_TIMESTAMP
);
SELECT * FROM comments