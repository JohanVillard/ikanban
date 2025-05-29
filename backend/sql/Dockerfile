FROM postgres:14.3

# Installation de la variable locale française
RUN localedef -i fr_FR -c -f UTF-8 -A /usr/share/locale/locale.alias fr_FR.UTF-8

# Définit la langue par défaut du conteneur Postgres
ENV LANG fr_FR.utf8

