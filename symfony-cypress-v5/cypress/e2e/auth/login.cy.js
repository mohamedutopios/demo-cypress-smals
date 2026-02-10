/**
 * ============================================================
 * AUTH / LOGIN — Tests d'authentification
 * ============================================================
 *
 * Concepts démontrés :
 *  - describe (fonctionnalité) + context (situation)
 *  - beforeEach pour la navigation commune
 *  - cy.fixture() pour charger les credentials
 *  - Tests positifs ET négatifs
 */

describe('Login', () => {

  // ── beforeEach GLOBAL : naviguer sur /login avant chaque test ──
  beforeEach(() => {
    cy.visit('/login')
  })

  // ── CONTEXT : Login valide ────────────────────────────────────
  context('avec des identifiants valides', () => {

    it('connecte l\'admin et redirige', function () {
      cy.fixture('users').then((users) => {
        cy.dataCy('email').type(users.admin.email)
        cy.dataCy('password').type(users.admin.password)
        cy.dataCy('submit').click()

        cy.url().should('not.include', '/login')
        cy.dataCy('user-menu').should('be.visible')
      })
    })

    it('connecte un utilisateur standard', function () {
      cy.fixture('users').then((users) => {
        cy.dataCy('email').type(users.user.email)
        cy.dataCy('password').type(users.user.password)
        cy.dataCy('submit').click()

        cy.url().should('not.include', '/login')
      })
    })
  })

  // ── CONTEXT : Login invalide ──────────────────────────────────
  context('avec des identifiants invalides', () => {

    it('affiche une erreur pour un email inexistant', () => {
      cy.dataCy('email').type('inconnu@fake.com')
      cy.dataCy('password').type('wrongpassword')
      cy.dataCy('submit').click()

      cy.url().should('include', '/login')
      cy.get('.alert-danger, [data-cy="login-error"]').should('be.visible')
    })

    it('affiche une erreur pour un mot de passe incorrect', () => {
      cy.dataCy('email').type('admin@example.com')
      cy.dataCy('password').type('mauvais_mot_de_passe')
      cy.dataCy('submit').click()

      cy.url().should('include', '/login')
      cy.get('.alert-danger, [data-cy="login-error"]').should('be.visible')
    })

    it('affiche une erreur pour des champs vides', () => {
      cy.dataCy('submit').click()

      // Le formulaire HTML5 empêche la soumission ou on reste sur /login
      cy.url().should('include', '/login')
    })
  })
})
