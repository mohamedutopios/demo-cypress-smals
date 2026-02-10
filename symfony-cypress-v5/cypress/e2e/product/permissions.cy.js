

describe('Permissions produit', () => {

  before(() => {
    cy.resetDb()
  })

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT : Admin (ROLE_ADMIN)
  // ═══════════════════════════════════════════════════════════════
  context('en tant qu\'admin (ROLE_ADMIN)', () => {

    beforeEach(() => {
     
      cy.login('admin@example.com', 'password')
    })

    it('peut accéder au formulaire de création', () => {
      cy.visit('/product/new')
      cy.dataCy('product-name').should('be.visible')
      cy.dataCy('submit-btn').should('be.visible')
    })

    it('voit les boutons éditer sur la liste', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').should('exist')
      cy.dataCy('new-product-btn').should('be.visible')
      cy.dataCy('view-btn').should('exist')
    })

    it('voit le bouton supprimer sur la page détail', () => {
      cy.visit('/product')
      cy.dataCy('view-btn').first().click()
      cy.dataCy('delete-btn').should('exist')
    })

    it('peut accéder à l\'édition d\'un produit', () => {
      cy.visit('/product')
      cy.dataCy('edit-btn').first().click()
      cy.url().should('include', '/edit')
      cy.dataCy('product-name').should('be.visible')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT : Utilisateur standard (ROLE_USER)
  // ═══════════════════════════════════════════════════════════════
  context('en tant qu\'utilisateur standard (ROLE_USER)', () => {

    beforeEach(() => {
      
      cy.login('user@example.com', 'password')
    })

    it('peut voir la liste des produits', () => {
      cy.visit('/product')
      cy.dataCy('product-item').should('have.length.at.least', 1)
    })

    it('peut créer un produit (ROLE_USER a les droits)', () => {
      // Dans cette app, ROLE_USER peut créer des produits
      cy.visit('/product/new')
      cy.dataCy('product-name').should('be.visible')
      cy.dataCy('submit-btn').should('be.visible')
    })

    it('voit les boutons d\'édition (ROLE_USER a les droits)', () => {
      // Le template utilise is_granted('ROLE_USER')
      cy.visit('/product')
      cy.dataCy('edit-btn').should('exist')
      cy.dataCy('new-product-btn').should('be.visible')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT : Visiteur non connecté
  // ═══════════════════════════════════════════════════════════════
  context('en tant que visiteur (non connecté)', () => {

    it('peut voir la liste mais sans actions', () => {
      cy.visit('/product')
      cy.dataCy('product-item').should('have.length.at.least', 1)
      cy.dataCy('edit-btn').should('not.exist')
      cy.dataCy('new-product-btn').should('not.exist')
    })

    it('est redirigé vers /login pour créer', () => {
      cy.visit('/product/new')
      cy.url().should('include', '/login')
    })
  })
})
