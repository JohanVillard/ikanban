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

#### **📦 Dépendances principales**

- **bcrypt** - Permet de hacher des mots de passe.
- **dotenv** – Charge les variables d'environnement depuis un fichier `.env`.
- **express** – Framework minimaliste pour créer des serveurs web et des API.
- **morgan** -de logging HTTP pour Express qui permet d’enregistrer les requêtes entrantes. Il est principalement utilisé pour le debug ou le monitoring
- **pg** - Non-blocking PostgreSQL client for Node.js.

#### **🛠️ Dépendances de développement**

- **swagger-jsdoc** - Lit le code source annoté par JSDoc et génère une spécification OpenAPI (Swagger).
- **swagger-ui-express** - Permet de générer de la documentation API à partir d'un fichier Swagger et de l'afficher dans une interface graphique
- **eslint** – Analyse et détecte les erreurs de style et de syntaxe.
- **@types/bcrypt** - Définition TypeScript pour bcrypt.
- **@types/dotenv** - Définitions TypeScript pour le dotenv.
- **@types/express** – Définitions TypeScript pour Express.js.
- **@types/mocha** - Définitions TypeScript pour le module uuid.
- **@types/morgan** - Définitions TypeScript pour le Morgan.
- **@types/node** – Définitions TypeScript pour les API Node.js.
- **@types/pg** - Définitions TypeScript pour pg.
- **@types/swagger-jsdoc** - Définitions TypeScript pour swagger-jsdoc.
- **@types/swagger-ui-express** - Définitions TypeScript pour swagger-ui-express.
- **@types/uuid** - Définitions TypeScript pour uuid.
- **@typescript-eslint/eslint-plugin** - Plugin d'eslint qui fournit des règles de vérifications pour TypeScript. 
- **@typescript-eslint/parser** - Analyseur eslint qui exploite TypeScript ESTree pour permettre à ESLint d'analyser le code source TypeScript.
- **globals** - Un paquet qui fournit des définitions pour des variables globales communes (comme window, document, console, etc.) afin de ne pas générer d'erreurs dans les outils comme ESLint.
- **mocha** - Framework de test JavaScript/TypeScript pour exécuter des tests unitaires, avec une API flexible.
- **nodemon** – Redémarre automatiquement le serveur lors des modifications.
- **prettier** – Formate automatiquement le code pour un style cohérent.
- **ts-node** – Exécute du TypeScript sans compilation préalable.
- **typescript** – Permet d'écrire du code TypeScript avec typage fort.
- **uuid** - Module permettant de générer des identifiants uniques universels (UUID), utilisés pour identifier de manière unique des objets dans un système distribué.

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
