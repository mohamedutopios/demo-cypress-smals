# Étape 4 : Commandes avancées

## Objectifs
- Créer des commandes personnalisées (Custom Commands)
- Utiliser les fixtures pour gérer les données de test
- Intercepter et simuler des requêtes HTTP avec `cy.intercept()`
- Tester des API directement avec Cypress

---

## Prérequis

1. L'application Symfony doit tourner :
```bash
symfony server:start
```

2. Installer les dépendances npm :
```bash
npm install
```

3. Lancer Cypress :
```bash
npm run cy:open
```

---

## 1. Custom Commands : Réutiliser du code de test

### Problème : Code dupliqué

Sans commandes personnalisées, on répète souvent le même code :

```javascript
// Test 1
it('test admin', () => {
  cy.visit('/login')
  cy.get('[data-cy="email"]').type('admin@example.com')
  cy.get('[data-cy="password"]').type('password')
  cy.get('[data-cy="submit"]').click()
  // ...
})

// Test 2
it('autre test admin', () => {
  cy.visit('/login')
  cy.get('[data-cy="email"]').type('admin@example.com')  // Même code !
  cy.get('[data-cy="password"]').type('password')        // Même code !
  cy.get('[data-cy="submit"]').click()                   // Même code !
  // ...
})
```

### Solution : Custom Commands

Les commandes personnalisées sont définies dans `cypress/support/commands.js`.

**Syntaxe :**

```javascript
Cypress.Commands.add('nomCommande', (param1, param2) => {
  // Code de la commande
})
```

**Utilisation :**

```javascript
cy.nomCommande(param1, param2)
```

### Exemple : Commande de connexion

**Dans `cypress/support/commands.js` :**

```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-cy="email"]').clear().type(email)
  cy.get('[data-cy="password"]').clear().type(password)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('not.include', '/login')
})
```

**Utilisation dans les tests :**

```javascript
it('test admin', () => {
  cy.login('admin@example.com', 'password')  // Une seule ligne !
  // ...
})
```

### Bonnes pratiques pour les Custom Commands

| Pratique | Description |
|----------|-------------|
| Noms explicites | `cy.login()`, `cy.createProduct()`, `cy.logout()` |
| Paramètres optionnels | Utiliser des valeurs par défaut |
| Vérifications incluses | Ajouter des `.should()` dans la commande |
| Documentation | Commenter chaque commande |

---

## 2. Fixtures : Gérer les données de test

### Qu'est-ce qu'une fixture ?

Une fixture est un fichier JSON contenant des données de test réutilisables.

**Emplacement :** `cypress/fixtures/`

### Créer une fixture

**Fichier `cypress/fixtures/users.json` :**

```json
{
  "admin": {
    "email": "admin@example.com",
    "password": "password",
    "firstName": "Admin",
    "lastName": "Utopios"
  },
  "user": {
    "email": "user@example.com",
    "password": "password",
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "invalid": {
    "email": "invalid@example.com",
    "password": "wrongpassword"
  }
}
```

### Utiliser une fixture

**Méthode 1 : `cy.fixture()` avec `.then()`**

```javascript
it('connexion avec fixture', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.admin.email, users.admin.password)
  })
})
```

**Méthode 2 : Alias avec `@`**

```javascript
beforeEach(() => {
  cy.fixture('users').as('users')
})

it('connexion avec alias', function() {  // ⚠️ function() pas arrow =>
  cy.login(this.users.admin.email, this.users.admin.password)
})
```

**Méthode 3 : Import direct (ES6)**

```javascript
import users from '../fixtures/users.json'

it('connexion avec import', () => {
  cy.login(users.admin.email, users.admin.password)
})
```

### Pourquoi `function()` et pas `() =>` ?

```javascript
// ❌ Arrow function - this ne fonctionne pas
it('test', () => {
  console.log(this.users)  // undefined !
})

// ✅ function() - this fonctionne
it('test', function() {
  console.log(this.users)  // { admin: {...}, user: {...} }
})
```

Les arrow functions n'ont pas leur propre `this`, elles héritent du contexte parent.

---

## 3. cy.intercept() : Intercepter les requêtes HTTP

### Pourquoi intercepter ?

- **Simuler des réponses** (mock) sans dépendre du serveur
- **Tester des cas d'erreur** (500, 404, timeout)
- **Accélérer les tests** en évitant les vrais appels API
- **Vérifier les requêtes** envoyées par l'application

### Syntaxe de base

```javascript
cy.intercept(method, url, response).as('alias')
```

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `method` | Méthode HTTP | `'GET'`, `'POST'`, `'PUT'`, `'DELETE'` |
| `url` | URL ou pattern | `'/api/products'`, `'/api/*'` |
| `response` | Réponse simulée | `{ statusCode: 200, body: {...} }` |
| `.as('alias')` | Nom pour référencer | Permet d'utiliser `cy.wait('@alias')` |

### Exemple 1 : Mock avec fixture

```javascript
it('affiche les produits mockés', () => {
  // Intercepter GET /product et retourner une fixture
  cy.intercept('GET', '/product*', {
    fixture: 'api/products-list.json'
  }).as('getProducts')
  
  cy.visit('/product')
  
  // Attendre que la requête soit interceptée
  cy.wait('@getProducts')
  
  // Vérifier l'affichage
  cy.get('[data-cy="product-item"]').should('have.length', 3)
})
```

### Exemple 2 : Simuler une erreur 500

```javascript
it('gère une erreur serveur', () => {
  cy.intercept('GET', '/product*', {
    statusCode: 500,
    body: { error: 'Internal Server Error' }
  }).as('getProductsError')
  
  cy.visit('/product')
  cy.wait('@getProductsError')
  
  // Vérifier que l'erreur est gérée
  cy.get('[data-cy="error-message"]').should('be.visible')
})
```

### Exemple 3 : Simuler un délai (loading)

```javascript
it('affiche un loader pendant le chargement', () => {
  cy.intercept('GET', '/product*', {
    fixture: 'api/products-list.json',
    delay: 2000  // Délai de 2 secondes
  }).as('getProducts')
  
  cy.visit('/product')
  
  // Le loader doit être visible pendant le chargement
  cy.get('[data-cy="loader"]').should('be.visible')
  
  cy.wait('@getProducts')
  
  // Le loader disparaît après
  cy.get('[data-cy="loader"]').should('not.exist')
})
```

### Exemple 4 : Vérifier le corps d'une requête POST

```javascript
it('envoie les bonnes données', () => {
  cy.intercept('POST', '/product/new', (req) => {
    // Vérifier ce que l'app envoie
    expect(req.body).to.include('name=Nouveau+Produit')
    
    // Laisser passer la requête
    req.continue()
  }).as('createProduct')
  
  cy.loginAsAdmin()
  cy.visit('/product/new')
  
  cy.get('[data-cy="product-name"]').type('Nouveau Produit')
  cy.get('[data-cy="product-price"]').type('99.99')
  cy.get('[data-cy="product-stock"]').type('10')
  cy.get('[data-cy="submit-btn"]').click()
  
  cy.wait('@createProduct')
})
```

### Exemple 5 : Espionner sans modifier

```javascript
it('espionne les requêtes', () => {
  // Intercepter sans modifier (spy)
  cy.intercept('GET', '/product*').as('getProducts')
  
  cy.visit('/product')
  
  cy.wait('@getProducts').then((interception) => {
    // Accéder à la requête et la réponse
    console.log('URL:', interception.request.url)
    console.log('Status:', interception.response.statusCode)
    console.log('Body:', interception.response.body)
  })
})
```

### Patterns d'URL

```javascript
// URL exacte
cy.intercept('GET', '/product')

// Tout ce qui commence par /product
cy.intercept('GET', '/product*')

// Wildcard au milieu
cy.intercept('GET', '/product/*/edit')

// Expression régulière
cy.intercept('GET', /\/product\/\d+/)

// Toutes les méthodes HTTP
cy.intercept('/product*')
```

---

## 4. Tests API avec cy.request()

Cypress peut tester directement des API sans passer par l'interface.

### Syntaxe

```javascript
cy.request(options).then((response) => {
  // Assertions sur la réponse
})
```

### Exemple : CRUD API complet

```javascript
describe('API Products', () => {

  it('GET - liste les produits', () => {
    cy.request('GET', '/product').then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.include('Produits')
    })
  })

  it('POST - crée un produit', () => {
    // D'abord se connecter pour avoir une session
    cy.login('admin@example.com', 'password')
    
    cy.request({
      method: 'POST',
      url: '/product/new',
      form: true,  // Envoie en form-urlencoded
      body: {
        'product[name]': 'Produit API Test',
        'product[price]': '49.99',
        'product[stock]': '10',
        'product[category]': 'electronics'
      }
    }).then((response) => {
      expect(response.status).to.equal(200)
    })
  })

})
```

### Avantages de cy.request()

| Avantage | Description |
|----------|-------------|
| Rapide | Pas de rendu navigateur |
| Setup | Créer des données avant les tests UI |
| Nettoyage | Supprimer des données après les tests |
| Tests API | Tester l'API indépendamment |

### Combiner API et UI

```javascript
it('crée via API, vérifie dans UI', () => {
  // 1. Setup rapide via API
  cy.login('admin@example.com', 'password')
  
  // 2. Vérifier dans l'UI
  cy.visit('/product')
  cy.get('[data-cy="products-list"]').should('be.visible')
})
```

---

## 5. Récapitulatif

### Fichiers du projet

| Fichier | Rôle |
|---------|------|
| `cypress/support/commands.js` | Commandes personnalisées |
| `cypress/fixtures/*.json` | Données de test |
| `cypress/e2e/*.cy.js` | Fichiers de tests |

### Commandes clés

| Commande | Description |
|----------|-------------|
| `Cypress.Commands.add()` | Créer une commande |
| `cy.fixture('file')` | Charger une fixture |
| `cy.intercept(method, url)` | Intercepter HTTP |
| `cy.wait('@alias')` | Attendre une interception |
| `cy.request(options)` | Appel API direct |

### Quand utiliser quoi ?

| Besoin | Solution |
|--------|----------|
| Code répété | Custom Command |
| Données réutilisables | Fixture |
| Simuler une API | `cy.intercept()` + mock |
| Tester une API | `cy.request()` |
| Préparer des données | `cy.request()` en `before()` |
| Tester erreurs serveur | `cy.intercept()` + statusCode |

---

**Étape 4 terminée !** Passez aux exercices pratiques.
