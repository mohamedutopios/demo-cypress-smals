
import './commands'

// ─────────────────────────────────────────────────────────────
//  HOOK GLOBAL : afterEach
// ─────────────────────────────────────────────────────────────
// S'exécute après CHAQUE test de CHAQUE fichier
// Utile pour du logging, debug, ou cleanup global
//
afterEach(function () {
  // Log conditionnel : afficher un message si le test a échoué
  if (this.currentTest.state === 'failed') {
    cy.log(`❌ ÉCHEC : ${this.currentTest.title}`)


  }
})

// ─────────────────────────────────────────────────────────────
//  GESTION DES ERREURS NON CAPTURÉES
// ─────────────────────────────────────────────────────────────
// Empêche Cypress d'échouer sur des erreurs JS de l'app Symfony
// (utile si l'app a des scripts tiers qui lancent des erreurs)
//
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ne pas échouer le test pour les erreurs Symfony/Turbo
  if (err.message.includes('Turbo') || err.message.includes('stimulus')) {
    return false
  }
  // Pour toutes les autres erreurs, laisser Cypress échouer normalement
})
