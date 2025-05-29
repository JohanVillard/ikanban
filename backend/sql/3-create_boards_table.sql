-- Créer une table représentant un kanban/projet
CREATE TABLE IF NOT EXISTS boards(
	id UUID NOT NULL,
	user_id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
			REFERENCES users(id)
			ON DELETE CASCADE
 );
