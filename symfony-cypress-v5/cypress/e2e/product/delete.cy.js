

describe('Suppression de produit', () => {


  before(() => {
    cy.resetDb()
  })

 
  context('en tant qu\'admin', () => {

    beforeEach(() => {
      cy.login('admin@example.com', 'password')
    })

    it('affiche le bouton de suppression sur la page détail', () => {
      // Le bouton supprimer est sur la page show
      cy.visit('/product')
      cy.dataCy('view-btn').first().click()

      cy.dataCy('delete-btn').should('exist')
    })

    it('supprime un produit depuis la page détail', () => {
      cy.visit('/product')

      // Compter les produits AVANT suppression
      cy.dataCy('product-item').then(($items) => {
        const countBefore = $items.length

        // Aller sur le détail du premier produit
        cy.dataCy('view-btn').first().click()

        // Cliquer sur supprimer
        cy.dataCy('delete-btn').click()

        // Vérifier le message de succès
        cy.dataCy('flash-success')
          .should('be.visible')
          .and('contain', 'supprimé')

        // Vérifier qu'il y a 1 produit de moins
        cy.dataCy('product-item')
          .should('have.length', countBefore - 1)
      })
    })

    it('supprime un autre produit et vérifie la redirection', () => {
      // Aller sur la page show d'un produit et supprimer
      cy.visit('/product')
      cy.dataCy('view-btn').first().click()
      cy.dataCy('delete-btn').click()

      // Redirigé vers la liste
      cy.url().should('match', /\/product\/?$/)
      cy.dataCy('flash-success').should('be.visible')
    })

    it('redirige vers la liste après suppression', () => {
      cy.visit('/product')
      cy.dataCy('view-btn').first().click()
      cy.dataCy('delete-btn').click()

      cy.url().should('match', /\/product\/?$/)
    })
  })


  context('en tant que visiteur (non connecté)', () => {

    it('ne voit pas le bouton supprimer', () => {
      cy.visit('/product')
      cy.dataCy('delete-btn').should('not.exist')
    })
  })
})
