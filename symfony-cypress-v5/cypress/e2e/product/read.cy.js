

describe('Lecture des produits', () => {

  // ── before() : seed la BDD une seule fois ─────────────────────
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

    // ─── Liste des produits ─────────────────────────────────────
    context('page liste (/product)', () => {

      beforeEach(() => {
        cy.visit('/product')
      })

      it('affiche la liste des produits', () => {
        cy.dataCy('product-item')
          .should('have.length.at.least', 1)
      })

      it('affiche le nom et le prix de chaque produit', () => {
        cy.dataCy('product-item').first().within(() => {
          cy.dataCy('product-name').should('be.visible')
          cy.dataCy('product-price').should('be.visible')
        })
      })

      it('affiche les boutons d\'action admin', () => {
        // Sur la liste : boutons Voir et Modifier (pas de Supprimer)
        cy.dataCy('new-product-btn').should('be.visible')
        cy.dataCy('edit-btn').should('exist')
        cy.dataCy('view-btn').should('exist')
      })

      it('affiche le bouton "Nouveau produit"', () => {
        cy.dataCy('new-product-btn').click()
        cy.url().should('include', '/product/new')
      })
    })

    // ─── Détail d'un produit ────────────────────────────────────
    context('page détail (/product/{id})', () => {

      it('affiche toutes les informations du produit', () => {
        cy.visit('/product')
        cy.dataCy('view-btn').first().click()

        cy.dataCy('product-name').should('be.visible')
        cy.dataCy('product-price').should('be.visible')
      })

      it('a un lien de retour vers la liste', () => {
        cy.visit('/product')
        cy.dataCy('view-btn').first().click()

        cy.get('a').contains(/retour|liste|back|produits/i).click()
        cy.url().should('match', /\/product\/?$/)
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT : Visiteur non connecté
  // ═══════════════════════════════════════════════════════════════
  context('en tant que visiteur (non connecté)', () => {

    beforeEach(() => {
      cy.visit('/product')
    })

    it('voit les produits sans boutons admin', () => {
      cy.dataCy('product-item')
        .should('have.length.at.least', 1)

      // Les boutons d'édition ne doivent PAS exister pour un visiteur
      cy.dataCy('edit-btn').should('not.exist')
      cy.dataCy('new-product-btn').should('not.exist')
    })

    it('ne voit pas le bouton "Nouveau produit"', () => {
      cy.dataCy('new-product-btn').should('not.exist')
    })
  })
})
