-- Se connecter à la base de données pour créer des tables

CREATE TABLE IF NOT EXISTS users (
	id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(100) NOT NULL,
	PRIMARY KEY (id)
 );
