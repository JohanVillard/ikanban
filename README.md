# iKanban

iKanban est une application web Kanban simple permettant de gérer des tâches et des projets. Elle est construite avec Node.js, Express, et PostgreSQL pour le backend, tandis que le front-end utilise TypeScript pour une approche légère sans framework.

## Table des matières

1. [Introduction](#introduction)
2. [Stack technique](#stack-technique)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation et Configuration](#installation-et-configuration)
5. [Dépendances](#dépendances)
6. [Utilisation de Swagger UI pour la documentation](#utilisation-de-swagger-ui-pour-la-documentation)
7. [Démarrer avec Docker](#démarrer-avec-docker)
8. [Structure du projet](#structure-du-projet)

---

## Introduction

iKanban est une application de gestion de projet basée sur le concept de **Kanban**, qui permet de visualiser et de gérer les tâches d'un projet. L'application propose des fonctionnalités simples mais puissantes, telles que la création de tâches, la gestion de colonnes, et l'attribution des tâches aux utilisateurs.

---

## 🛠️ Stack technique

- **Backend** : `Node.js`, `Express`, `PostgreSQL`
- **Frontend** : `TypeScript`
- **Gestion de version** : `Git`, `GitHub`
- **Docker** : Utilisé pour la gestion des conteneurs
- **Swagger UI** : Pour la documentation API interactive

---

## Fonctionnalités

- **Gestion des tâches** : Créer, modifier, déplacer et supprimer des tâches.
- **Gestion des colonnes** : Créer, modifier et supprimer des colonnes, ainsi qu'attribuer des tâches à celles-ci.
- **Gestion des projets Kanban** : Créer, modifier et supprimer des projets Kanban, avec des colonnes associées.
- **Gestion des utilisateurs** : Inscription, connexion, suppression de comptes, et attribution des projets aux utilisateurs.

---

## ⚙️ Installation et Configuration

### Prérequis

- Node.js >= 22.14
- PostgreSQL
- `npm` ou `pnpm`/`yarn`
- Docker

### Clonage du dépôt

```bash
git clone git@github.com:JohanVillard/ikanban.git
cd ikanban
```

### Création du fichier .env à la racine du projet

```bash
touch .env
```

Avec votre éditeur de texte préféré, configurer les variables suivantes :

```
# exemple
DB_HOST=db
DB_PORT=5432 // Port par défaut de Postgres
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=user_db
NODE_ENV=development
PORT=3000 // Port du serveur web
```

### Installation de dépendances

#### Backend

```bash
cd backend
npm install
```

---

#### Frontend

---

## Liste des dépendances

### Backend

#### 📦 Dépendances de production

- **bcrypt-ts** : Alternative TypeScript native à bcrypt, souvent utilisée quand bcrypt classique pose problème avec des bindings natifs.

- **cors** : Middleware pour gérer les permissions de Cross-Origin Resource Sharing.

- **dotenv** : Charge les variables d’environnement depuis un fichier .env.

- **express** : Framework minimaliste pour construire des applications web avec Node.js.

- **express-validator** : Middleware pour valider et assainir les requêtes HTTP dans Express.

- **jsonwebtoken** : Gère la création et la vérification de JSON Web Tokens (JWT) pour l’authentification.

- **morgan** : Middleware de logging HTTP.

- **pg** : Client PostgreSQL pour Node.js.

#### 📦 Dépendances de développement

Voici une brève description des principales bibliothèques utilisées dans ce projet :

##### 🔧 Types (typages TypeScript)

- **@types/bcrypt** : Fournit les définitions de types pour la bibliothèque `bcrypt`.
- **@types/chai** : Typages pour la bibliothèque d'assertions `chai`.
- **@types/cors** : Types pour le middleware `cors` (Cross-Origin Resource Sharing).
- **@types/dotenv** : Types pour la gestion de fichiers `.env` avec `dotenv`.
- **@types/express** : Fournit les types pour `express`, le framework web.
- **@types/mocha** : Types pour le framework de test `mocha`.
- **@types/morgan** : Typages pour le middleware de logging HTTP `morgan`.
- **@types/node** : Typages globaux pour Node.js.
- **@types/pg** : Types pour le module PostgreSQL `pg`.
- **@types/sinon** : Fournit les types pour `sinon`, utilisé pour les mocks/spies en tests.
- **@types/swagger-jsdoc** : Typages pour `swagger-jsdoc`, utilisé pour la génération de documentation Swagger.
- **@types/swagger-ui-express** : Types pour `swagger-ui-express`, qui sert l'UI Swagger.
- **@types/uuid** : Types pour la génération d’identifiants uniques avec `uuid`.

##### 🧪 Tests

- **chai** : Librairie d'assertions BDD/TDD.
- **mocha** : Framework de tests.
- **sinon** : Librairie de test pour les espions (spies), les mocks et les stubs.
- **ts-mocha** : Permet d'exécuter Mocha avec TypeScript sans transpilation préalable.

##### 🛠 Développement

- **nodemon** : Redémarre automatiquement le serveur lors de modifications de fichiers.
- **ts-node** : Permet d'exécuter du TypeScript directement sans compilation manuelle.
- **tsx** : Exécuteur rapide de fichiers TypeScript avec support ESModules, utile en dev.
- **tsconfig-paths** : Permet d'utiliser les alias définis dans `tsconfig.json`.

##### 🧹 Qualité de code

- **eslint** : Linter JavaScript/TypeScript.
- **@typescript-eslint/parser** : Parseur ESLint pour TypeScript.
- **@typescript-eslint/eslint-plugin** : Plugin ESLint avec des règles spécifiques à TypeScript.
- **prettier** : Formateur de code.
- **eslint-config-prettier** : Désactive les règles ESLint conflictuelles avec Prettier.
- **eslint-plugin-prettier** : Intègre Prettier dans ESLint.
- **globals** : Fournit des globales pour différents environnements (utile avec ESLint).

##### 📚 Documentation

- **swagger-jsdoc** : Génère la documentation Swagger à partir de commentaires JSDoc.
- **swagger-ui-express** : Sert l’interface Swagger UI dans une app Express.

##### 📦 Utilitaires

- **uuid** : Génère des identifiants uniques.

### Frontend

---

## Utilisation de Swagger UI pour la documentation

---

## Démarrer avec Docker

### 1. Construire l'image

Pour construire les images Docker à partir du `Dockerfile` et des services définis dans le fichier `docker-compose.yml`, exécutez la commande suivante :

```bash
docker compose build
```

### 2. Démarrer les conteneurs

Une fois l'image construite, vous pouvez démarrer les conteneurs en mode détacher avec la commande suivante :

```bash
docker compose up -d
```

### 3. Accéder à l'application

Une fois que les conteneurs sont en cours d'exécution, vous pouvez accéder à l'application via :
http://localhost:3000.

### 4. Executer les fichier de test

#### Backend

Dans le dossier backend, vous pouver lancer les fichiers de test avec la commande suivante

```bash
npm run test
```

#### Frontend

### 5. Arreter l'application

Vous pouvez arréter l'application avec la commande suivante :

```bash
docker compose down -v
```

---

## 📂 Structure du projet

```
iKanban/
├── backend/
│   ├── database/                 # Code de la base de données (SQL)
│   │   ├── Dockerfile            # Dockerfile pour la base de données
│   ├── dist/                     # Code compilé (issu de TypeScript)
│   ├── node_modules/             # Modules Node.js
│   ├── src/                      # Code source de l'API
│   │   ├── config/               # Configurations de l'application
│   │   ├── controllers/          # Contrôleurs pour l'API
│   │   ├── models/               # Modèles de données
│   │   ├── routes/               # Routes de l'API
│   │   ├── services/             # Services (logique métier)
│   │   ├── server.ts             # Entrée principale de l'application
│   ├── Dockerfile                # Dockerfile pour l'API backend
│   ├── package.json              # Dépendances du backend
│   ├── tsconfig.json             # Configuration TypeScript pour le backend
├── .env                          # Variables d'environnement globales
├── .gitignore                    # Fichiers à ignorer par Git
├── docker-compose.yml            # Configuration des services Docker
├── README.md                     # Documentation du projet
├── .prettierrc                   # Configuration Prettier
└── .dockerignore                 # Fichiers à ignorer lors de la création de l'image Docker
```

---

## License
