-- Créer une table représentant une tâche
CREATE TABLE IF NOT EXISTS tasks (
	id UUID NOT NULL,
	column_id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
	description VARCHAR(2000),
  done BOOLEAN NOT NULL DEFAULT false,
  position integer NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_column
		FOREIGN KEY(column_id)
			REFERENCES columns(id)
			ON DELETE CASCADE
 );
