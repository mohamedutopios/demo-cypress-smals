/**
 * ============================================================
 * DÉMO 5 — Custom Commands avec cy.session()
 * ============================================================
 *
 * Concepts démontrés :
 *  - cy.session() pour login performant (cache de session)
 *  - validate() pour vérifier que la session est encore valide
 *  - cacheAcrossSpecs pour partager la session entre fichiers
 *  - Custom commands réutilisables (dataCy, resetDb, createProduct)
 */

// ─────────────────────────────────────────────────────────────
//  LOGIN avec cy.session()
// ─────────────────────────────────────────────────────────────
// Premier appel  → exécute le login complet via formulaire
// Appels suivants → restaure cookies/localStorage instantanément
//
Cypress.Commands.add('login', (email, password) => {
  cy.session(
    // 1️ Clé de cache unique (chaque couple email/password a sa propre session)
    [email, password],

    // 2️ Fonction de setup — exécutée UNE SEULE FOIS
    () => {
      cy.visit('/login')
      cy.get('[data-cy="email"]').type(email)
      cy.get('[data-cy="password"]').type(password)
      cy.get('[data-cy="submit"]').click()

      // Attendre que le login soit effectif
      cy.url().should('not.include', '/login')
    },

    // 3️ Options avancées
    {
      // validate() : vérifie que la session en cache est toujours valide
      // ⚠️ IMPORTANT : on vérifie une route PROTÉGÉE (/product/new)
      //    avec followRedirect: false pour détecter la redirection vers /login
      //    - Status 200 = session active → OK
      //    - Status 302 = redirigé vers /login → session expirée → re-login
      validate() {
        cy.request({
          url: '/product/new',
          followRedirect: false,
          failOnStatusCode: false,
        })
          .its('status')
          .should('eq', 200)
      },

      // cacheAcrossSpecs : partage la session entre TOUS les fichiers de test
      // Sans ça, chaque fichier .cy.js refait le login
      cacheAcrossSpecs: true,
    }
  )
})

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy="${value}"]`)
})


Cypress.Commands.add('resetDb', () => {
  cy.exec('php bin/console app:fixtures:load', {
    failOnNonZeroExit: false,
  })
})


Cypress.Commands.add('createProduct', (productData) => {
  cy.visit('/product/new')
  cy.dataCy('product-name').type(productData.name)

  if (productData.description) {
    cy.dataCy('product-description').type(productData.description)
  }

  cy.dataCy('product-price').clear().type(productData.price.toString())
  cy.dataCy('product-stock').clear().type(productData.stock.toString())

  if (productData.category) {
    cy.dataCy('product-category').select(productData.category)
  }

  cy.dataCy('submit-btn').click()
})
