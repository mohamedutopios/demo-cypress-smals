/**
 * ============================================================
 * AUTH / LOGOUT — Tests de déconnexion
 * ============================================================
 *
 * Concepts démontrés :
 *  - cy.login() avec cy.session() (défini dans commands.js)
 *  - Interaction avec un dropdown Bootstrap
 *  - Cypress.session.clearAllSavedSessions() pour invalider le cache
 *  - Vérification de l'état après déconnexion
 *
 * ⚠️ Point important :
 *   Quand on teste le logout, on détruit la session côté serveur.
 *   Il faut ensuite vider le cache cy.session() avec
 *   Cypress.session.clearAllSavedSessions() pour que les specs
 *   suivantes ne réutilisent pas une session morte.
 */

describe('Logout', () => {

  // ── beforeEach : se connecter avant chaque test ───────────────
  beforeEach(() => {
    cy.login('admin@example.com', 'password')
  })

  it('déconnecte l\'utilisateur via le menu', () => {
    cy.visit('/')

    // Ouvrir le dropdown du menu utilisateur puis cliquer sur Déconnexion
    cy.dataCy('user-menu').click()
    cy.dataCy('logout-link').click()

    // Après logout : le lien "Connexion" apparaît, le menu utilisateur disparaît
    cy.dataCy('login-link').should('be.visible')
    cy.dataCy('user-menu').should('not.exist')

    // Vider le cache de sessions pour ne pas polluer les specs suivantes
    Cypress.session.clearAllSavedSessions()
  })

  it('empêche l\'accès aux pages protégées après logout', () => {
    cy.visit('/')

    // Déconnexion
    cy.dataCy('user-menu').click()
    cy.dataCy('logout-link').click()

    // Tenter d'accéder à la création de produit → redirigé vers login
    cy.visit('/product/new')
    cy.url().should('include', '/login')

    // Vider le cache de sessions
    Cypress.session.clearAllSavedSessions()
  })
})
