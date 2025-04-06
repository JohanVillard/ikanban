-- Créer une tâche

CREATE TABLE IF NOT EXISTS tasks (
	id UUID DEFAULT uuid_generate_v4() NOT NULL,
	column_id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
	description VARCHAR(2000),
	PRIMARY KEY (id),
	CONSTRAINT fk_column
		FOREIGN KEY(column_id)
			REFERENCES columns(id)
			ON DELETE CASCADE
 );
