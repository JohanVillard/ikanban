# Utilisation de node pour gérer les librairies NPM
FROM node:22.14.0-alpine3.21 

# Definition du répertoire de travail dans le conteneur
WORKDIR /app

# Copy package.json and package-lock.json si il existe
COPY ./package*.json ./

# Installation des librairies NPM
RUN npm install

# Copie du reste de l'application
COPY . .

# Build le projet Vite
RUN npm run build

EXPOSE "5173"

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
