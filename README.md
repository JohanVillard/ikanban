# iKanban

iKanban est une application web Kanban simple permettant de gérer des tâches et des projets. Elle est construite avec Node.js, Express, et PostgreSQL pour le backend, tandis que le front-end utilise TypeScript pour une approche légère sans framework.

## Table des matières

1. [Introduction](#introduction)
2. [Stack technique](#stack-technique)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation et Configuration](#installation-et-configuration)
5. [Dépendances](#dépendances)
6. [Structure du projet](#structure-du-projet)
7. [License](#license)

---

## 1. Introduction

iKanban est une application de gestion de projet basée sur le concept de **Kanban**, qui permet de visualiser et de gérer les tâches d'un projet. L'application propose des fonctionnalités simples mais puissantes, telles que la création de tâches, la gestion de colonnes, et l'attribution des tâches aux utilisateurs.

---

## 2. Stack technique

- **Backend** : `Node.js`, `Express`, `PostgreSQL`
- **Frontend** : `TypeScript`
- **Gestion de version** : `Git`, `GitHub`
- **Docker** : Utilisé pour la gestion des conteneurs
- **Swagger UI** : Pour la documentation API interactive
---
## 3. Fonctionnalités

- **Gestion des tâches** : Créer, modifier, déplacer et supprimer des tâches.
- **Gestion des colonnes** : Créer, modifier et supprimer des colonnes, ainsi qu'attribuer des tâches à celles-ci.
- **Gestion des projets Kanban** : Créer, modifier et supprimer des projets Kanban, avec des colonnes associées.
- **Gestion des utilisateurs** : Inscription, connexion, suppression de comptes, et attribution des projets aux utilisateurs.

---

## 4. Installation et Configuration

### Prérequis

- Node.js >= 22.14
- PostgreSQL
- `npm` ou `pnpm`/`yarn`
- Docker
- docker-compose

### Clonage du dépôt

```bash
git clone git@github.com:JohanVillard/ikanban.git
cd ikanban
```

### Configuration des variables d'environnements

Avec votre éditeur préféré, créez et configurez les fichiers `.env` suivants en remplaçant les valeurs par celles adaptées à votre environnement :

#### Front

```bash
cd front
touch .env
```

Dans le fichier `.env`, ajoutez :

```
# Variables d'environnement pour le frontend
VITE_BASE_URL=http://monapp.mondomaine.com
VITE_BASE_API_URL=https://api.mondomaine.com/api
VITE_API_VERSION=/v1
```

#### Backend

Ce fichier doit être placé à la **racine du projet** (au même niveau que le dossier `backend/`).

##### Pour le développement :

```bash
cd backend
touch .env.development
```

##### Pour la production/déploiement :

```bash
cd backend
touch .env.production
```

Dans ces fichiers, renseigne tes variables d’environnement selon ton contexte (ports, accès base de données, secrets, etc.) :


```

# Variables d'environnement pour le backend
DB_HOST=db
DB_PORT=5432         # Port par défaut de PostgreSQL
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=user_db

PORT=3000             # Port du serveur backend

JWT_SECRET=MY_SECRET_KEY

```

### Démarrer l'application avec Docker

#### a. Lancer le backend en mode développement ou production 

Vous pouvez démarrer les conteneurs avec la commande suivante :
**Important** - Assurez-vous que PostgreSQL est disponible sur le port 5432
```bash
npm run start:dev   # mode développement
npm run start:prod  # mode production (déploiement)

```

#### b. Accéder à l'application

- Application front : `https://monapp.mondomaine.com`
- API et interface Swagger : `https://api.mondomaine.com/api/docs (ajuster selon ta configuration)`

#### c. Arreter l'application

Vous pouvez arréter l'application avec la commande suivante :
```bash
docker compose down -v
```
---
## 5. Dépendances

### Frontend

#### 📦 Dépendances de production

- **@fortawesome/fontawesome-free** :  
  Bibliothèque d’icônes très utilisée pour intégrer des icônes vectorielles et personnalisables dans l’interface utilisateur.

---

#### 📦 Dépendances de développement

- **jsdom** :  
  Implémentation en JavaScript d’un DOM (Document Object Model) pour simuler un navigateur dans les tests Node.js. Utilisé avec **vitest**.

- **typescript** (~5.7.2) :  
  Superset de JavaScript qui ajoute le typage statique. Utilisé pour écrire un code frontend plus robuste et maintenable.

- **vite** :  
  Bundler et serveur de développement pour projets front-end. Il prend en charge le hot reload, la compilation rapide et la gestion des modules.

- **vitest** :  
  Framework de test rapide et moderne intégré à Vite pour tester le code TypeScript/JavaScript frontend.
---

### Backend

#### 📦 Dépendances de production

- **bcrypt-ts** : Implémentation TypeScript pure de `bcrypt`, utile pour le hachage de mots de passe sans dépendances natives. 
- **cookie-parser** : Parse les cookies attachés à la requête `req.cookies`.                                                       
- **cors** : Middleware pour activer le Cross-Origin Resource Sharing.                                                    
- **dotenv** : Charge les variables d’environnement depuis un fichier `.env`.                                               
- **express** : Framework web minimaliste pour Node.js.                                                                      
- **express-rate-limit** : Limiteur de requêtes pour éviter les abus (anti-DDOS, brute force).                                          
- **express-slow-down** : Introduit un délai entre les requêtes successives pour ralentir les abus.                                    
- **express-validator** : Middleware pour valider et assainir les entrées des requêtes HTTP.                                           
- **helmet** : Définit des en-têtes HTTP de sécurité pour protéger l’application.                                           
- **jsonwebtoken** : Création et vérification de JSON Web Tokens pour l’authentification.                                        
- **morgan** : Middleware de logging HTTP (logs de requêtes entrantes).                                                     
- **pg** : Client PostgreSQL pour Node.js.                                                                              

#### 📦 Dépendances de développement

Voici une brève description des principales bibliothèques utilisées dans ce projet :

##### 🔧 Types (typages TypeScript)

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
- **chai-as-promised** : Ajoute le support des promesses à chai.
- **mocha** : Framework de tests.
- **sinon** : Librairie de test pour les espions (spies), les mocks et les stubs.
- **ts-mocha** : Permet d'exécuter Mocha avec TypeScript sans transpilation préalable.

##### 🛠 Développement

- **ts-node** : Permet d'exécuter du TypeScript directement sans compilation manuelle.
- **tsx** : Exécuteur rapide de fichiers TypeScript avec support ESModules.
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

---

### 4. Executer les fichier de test

#### Frontend

Dans le dossier frontend, vous pouver lancer les fichiers de test avec la commande suivante.
```bash
cd frontend
npx vitest
```

#### Backend

Dans le dossier backend, vous pouvez lancer les fichiers de test avec la commande suivante.

**Important :** Les tests backend se font hors Docker. Avant de lancer les tests :
1. Arrêtez l'application Docker Compose : `docker-compose down`
2. Assurez-vous que PostgreSQL est disponible sur le port 5432

```bash
cd backend
npm run test
```

---

## 6. Structure du projet

```
iKanban/
├── front/                              # Code source de l'application frontend (client)
│   ├── dist/                           # Code JavaScript généré par Vite (à ne pas modifier)
│   ├── node_modules/                   # Dépendances installées (gérées par npm/yarn/pnpm)
│   ├── public/                         # Fichiers statiques publics (favicon, images, etc.)
│   ├── src/                            # Code source TypeScript du frontend
│   │   ├── component/                  # Composants réutilisables (UI, boutons, formulaires...)
│   │   ├── config/                     # Configuration globale (ex. : base URL API, constantes)
│   │   ├── pages/                      # Pages de l'application (par ex. : Login, Dashboard)
│   │   ├── services/                   # Fonctions pour communiquer avec l’API (fetch/axios)
│   │   ├── styles/                     # Fichiers CSS ou modules CSS
│   │   ├── types/                      # Déclarations de types TypeScript (interfaces, DTO)
│   │   ├── utils/                      # Fonctions utilitaires (helpers, validation, etc.)
│   │   ├── main.ts                     # Fichier d'entrée de l'application frontend
│   │   └── vite-env.d.ts               # Types injectés automatiquement pour l’environnement Vite
│   ├── test/                           # Tests unitaires et d'intégration du frontend
│   ├── .env                            # Variables d'environnement du frontend (VITE_API_URL, etc.)
│   ├── .prettierrc                     # Configuration Prettier pour le frontend
│   ├── Dockerfile                      # Dockerfile pour construire l’image du frontend
│   ├── index.html                      # Point d’entrée HTML (utilisé par Vite)
│   ├── package.json                    # Dépendances, scripts et métadonnées du frontend
│   ├── tsconfig.json                   # Configuration TypeScript du frontend
│   └── vite.config.ts                  # Configuration de Vite (alias, plugins, etc.)
├── backend/                            # Partie serveur de l'application (API REST + DB)
│   ├── database/                       # Scripts SQL et configuration Docker pour PostgreSQL
│   │   └── Dockerfile                  # Dockerfile pour construire l'image PostgreSQL
│   ├── dist/                           # Code JavaScript compilé depuis TypeScript (ne pas modifier)
│   ├── node_modules/                   # Dépendances Node.js (backend)
│   ├── src/                            # Dossier source de l'API Express
│   │   ├── api/                        # Dossier contenant les versions d'API REST
│   │   │   └── v1/                     # Version 1 de l’API
│   │   │       ├── controllers/        # Contrôleurs Express (gèrent les requêtes HTTP)
│   │   │       ├── repositories/       # Fonctions SQL pour interagir avec la base de données
│   │   │       ├── routes/             # Définition des endpoints et des routes
│   │   │       └── services/           # Logique métier entre les contrôleurs et les repositories
│   │   ├── config/                     # Fichiers de configuration (DB, logger, etc.)
│   │   ├── middlewares/                # Middlewares Express (authentification, erreurs, etc.)
│   │   ├── types/                      # Types TypeScript partagés pour l’API (DTO, enums, etc.)
│   │   ├── Dockerfile                  # Dockerfile pour builder uniquement la partie `src` si besoin
│   │   ├── app.ts                      # Configuration de l'app Express (middlewares + routes)
│   │   ├── .env.development            # Variables d’environnement de development du backend (DB_HOST, PORT, etc.)
│   │   ├── .env.production             # Variables d’environnement de production du backend (DB_HOST, PORT, etc.)
│   │   ├── .env.test                   # Variables d’environnement de test du backend (DB_HOST, PORT, etc.)
│   │   └── server.ts                   # Fichier de lancement du serveur Express (listen) 
│   ├── test/                           # Tests unitaires et d'intégration du backend
│   ├── .mocharc.json                   # Configuration pour le framework de tests Mocha
│   ├── Dockerfile                      # Dockerfile principal pour builder l’image backend
│   ├── package.json                    # Dépendances, scripts et métadonnées du backend
│   ├── tsconfig.json                   # Configuration TypeScript pour le backend
│   ├── eslint.config.js                # Configuration ESLint (linting)
│   └── .prettierrc                     # Configuration Prettier (formatage du code backend)
├── .gitignore                          # Fichiers/dossiers ignorés par Git
├── docker-compose.yml                  # Orchestration Docker : frontend, backend, db, reverse proxy
└── README.md                           # Documentation du projet (installation, usage, endpoints, etc.)
```

---

## 7. License

This project is licensed under the [MIT License](./LICENSE).  
F
