# Symfony Cypress Demo — Version 5 : Structuration des Tests

## 🎯 Concepts de cette version

Cette version du projet démontre la **structuration des tests Cypress** :

| Concept | Fichier(s) concerné(s) |
|---------|------------------------|
| **Organisation par domaine** | `cypress/e2e/auth/`, `product/`, `smoke/`, `journey/` |
| **describe / context / it** | Tous les fichiers de test |
| **before()** — seed BDD | `create.cy.js`, `read.cy.js`, `update.cy.js`, `delete.cy.js` |
| **beforeEach()** — login + navigation | Tous les fichiers de test |
| **beforeEach imbriqué** | `create.cy.js` (global + context) |
| **afterEach global** | `support/e2e.js` (logging conditionnel) |
| **cy.session()** | `support/commands.js` → commande `cy.login()` |
| **cy.session() multi-users** | `product/permissions.cy.js` |
| **cacheAcrossSpecs** | `support/commands.js` |
| **validate()** | `support/commands.js` |
| **Tests data-driven (forEach)** | `product/create.cy.js` |
| **Custom commands** | `cy.login()`, `cy.dataCy()`, `cy.resetDb()`, `cy.createProduct()` |
| **Fixtures JSON** | `fixtures/products.json`, `fixtures/users.json` |
| **Journey test (E2E complet)** | `journey/full-crud.cy.js` |

---

## 📁 Structure des tests

```
cypress/
├── e2e/
│   ├── auth/                    ← Authentification
│   │   ├── login.cy.js          (6 tests)
│   │   └── logout.cy.js         (2 tests)
│   ├── product/                 ← CRUD Produits
│   │   ├── create.cy.js         (11 tests dont 3 data-driven)
│   │   ├── read.cy.js           (8 tests)
│   │   ├── update.cy.js         (9 tests)
│   │   ├── delete.cy.js         (5 tests)
│   │   └── permissions.cy.js    (7 tests multi-users)
│   ├── smoke/                   ← Tests rapides
│   │   └── health-check.cy.js   (5 tests)
│   └── journey/                 ← Parcours E2E
│       └── full-crud.cy.js      (1 test complet)
├── fixtures/
│   ├── products.json
│   └── users.json
└── support/
    ├── commands.js              ← login, dataCy, resetDb, createProduct
    └── e2e.js                   ← afterEach global + config
```

**Total : ~54 tests**

---

## 🚀 Installation

```bash
# Copier les fichiers Cypress dans le projet Symfony existant
# (remplacer le contenu du dossier cypress/ et les fichiers à la racine)

npm install
```

---

## ▶️ Exécution

```bash
# Ouvrir l'interface graphique
npm run cy:open

# Exécuter TOUS les tests
npm run cy:run

# Exécuter par domaine
npm run cy:smoke          # Smoke tests uniquement
npm run cy:auth           # Tests d'authentification
npm run cy:product        # Tous les tests produit
npm run cy:journey        # Parcours complet

# Exécuter un fichier spécifique
npm run cy:product:create # Uniquement la création
npm run cy:product:read   # Uniquement la lecture
npm run cy:product:update # Uniquement la modification
npm run cy:product:delete # Uniquement la suppression
```

---

## 🔐 Identifiants de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@example.com | password |
| User | user@example.com | password |

---

## 📖 Différences avec la version 4

| V4 | V5 |
|----|----|
| Tests dans un seul dossier | Organisés par domaine (auth/, product/, smoke/, journey/) |
| Login sans cache | `cy.session()` avec validation et cache cross-specs |
| Pas de hooks structurés | `before()`, `beforeEach()` imbriqués, `afterEach` global |
| Tests statiques | Tests data-driven avec `forEach` |
| `cy.get('[data-cy=...]')` | `cy.dataCy()` custom command |
| Pas de permissions | Tests multi-users avec sessions séparées |
| Pas de journey | Parcours complet bout en bout |
