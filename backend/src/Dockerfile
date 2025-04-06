# Utilisation d'une image de base Node.js
FROM node:22.14.0-alpine3.21

# Création du dossier de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json depuis la racine du projet vers le conteneur
COPY ../package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet vers le conteneur (y compris le .env)
COPY ../ ./

# Exposer le port de l'application
EXPOSE 3000

# Lancer l'application en mode développement
CMD ["npm", "run", "start:dev"]

