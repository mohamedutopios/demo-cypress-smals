/**
 * ============================================================
 * SMOKE TESTS — Vérification rapide de l'application
 * ============================================================
 *
 * Tests ultra-rapides pour vérifier que l'app fonctionne.
 * À exécuter en premier en CI/CD : npm run cy:smoke
 *
 * Concepts démontrés :
 *  - Tests indépendants sans authentification
 *  - describe simple sans context (pas besoin ici)
 *  - Assertions rapides sur les pages publiques
 */

describe('Smoke Tests', () => {

  it('la page d\'accueil se charge', () => {
    cy.visit('/')
    cy.get('h1').should('be.visible')
  })

  it('la page de login est accessible', () => {
    cy.visit('/login')
    cy.dataCy('email').should('be.visible')
    cy.dataCy('password').should('be.visible')
    cy.dataCy('submit').should('be.visible')
  })

  it('la page produits est accessible', () => {
    cy.visit('/product')
    cy.get('h1').should('be.visible')
  })

  it('la page about est accessible', () => {
    cy.visit('/about')
    cy.get('h1').should('be.visible')
  })

  it('une page inexistante retourne une erreur', () => {
    cy.request({ url: '/page-inexistante-xyz', failOnStatusCode: false })
      .its('status')
      .should('eq', 404)
  })
})
