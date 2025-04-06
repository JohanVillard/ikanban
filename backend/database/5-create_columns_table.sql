-- Créer une colonne représentant l'étape du flux de travail

-- Pour résoudre uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS columns (
	id UUID DEFAULT uuid_generate_v4() NOT NULL,
	board_id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_board
		FOREIGN KEY(board_id)
			REFERENCES boards(id)
			ON DELETE CASCADE
 );
