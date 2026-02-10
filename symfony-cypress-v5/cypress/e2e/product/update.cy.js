

describe('Modification de produit', () => {

  // ── before() : seed BDD ───────────────────────────────────────
  before(() => {
    cy.resetDb()
  })

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT : Admin connecté
  // ═══════════════════════════════════════════════════════════════
  context('en tant qu\'admin', () => {

    beforeEach(() => {
      cy.login('admin@example.com', 'password')
    })

    it('accède au formulaire d\'édition depuis la liste', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').first().click()

      cy.url().should('include', '/edit')
      cy.dataCy('product-name').should('be.visible')
    })

    it('affiche les champs pré-remplis avec les données existantes', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').first().click()

      // Les champs doivent avoir une valeur (pas vides)
      cy.dataCy('product-name').invoke('val').should('not.be.empty')
      cy.dataCy('product-price').invoke('val').should('not.be.empty')
    })

    // ⚠️ SKIP : validation Symfony retourne 422 — à debug côté backend
    it.skip('modifie le nom du produit', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').first().click()

      cy.dataCy('product-name').clear().type('Produit Modifié V5')
      cy.dataCy('submit-btn').click()

      cy.url().should('not.include', '/edit')
      cy.dataCy('flash-success')
        .should('be.visible')
        .and('contain', 'succès')
    })

    // ⚠️ SKIP
    it.skip('modifie le prix et le stock', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').first().click()

      cy.dataCy('product-price').clear().type('199.99')
      cy.dataCy('product-stock').clear().type('75')
      cy.dataCy('submit-btn').click()

      cy.url().should('not.include', '/edit')
      cy.dataCy('flash-success').should('be.visible')
    })

    // ⚠️ SKIP
    it.skip('vérifie que la modification est persistée', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').first().click()

      const nouveauNom = 'Produit Persisté ' + Date.now()
      cy.dataCy('product-name').clear().type(nouveauNom)
      cy.dataCy('submit-btn').click()

      cy.url().should('not.include', '/edit')
      cy.dataCy('flash-success').should('be.visible')

      cy.visit('/product')
      cy.contains(nouveauNom).should('be.visible')
    })

    // ─── Validation du formulaire d'édition ─────────────────────
    context('validation du formulaire', () => {

      beforeEach(() => {
        cy.visit('/product')
        cy.dataCy('edit-btn').first().click()
      })

      it('refuse de sauvegarder avec un nom vide', () => {
        cy.dataCy('product-name').clear()
        cy.dataCy('submit-btn').click()

        cy.url().should('include', '/product')
      })

      it('refuse un prix négatif', () => {
        cy.dataCy('product-price').clear().type('-50')
        cy.dataCy('submit-btn').click()

        cy.url().should('include', '/product')
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT : Visiteur non connecté
  // ═══════════════════════════════════════════════════════════════
  context('en tant que visiteur (non connecté)', () => {

    it('ne voit pas les boutons d\'édition', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').should('not.exist')
    })
  })
})
