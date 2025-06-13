-- Créer une colonne représentant l'étape du flux de travail
CREATE TABLE IF NOT EXISTS columns (
	id UUID NOT NULL,
	board_id UUID NOT NULL,
	name VARCHAR(100) NOT NULL,
  position INTEGER NOT NULL,
  wip INTEGER DEFAULT NULL ,
	PRIMARY KEY (id),
	CONSTRAINT fk_board
		FOREIGN KEY(board_id)
			REFERENCES boards(id)
			ON DELETE CASCADE
 );
