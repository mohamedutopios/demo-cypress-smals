describe("Demonstation cypress", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Test 1 : Vérifie le titre de la page", () => {
    cy.title().should("contain", "Symfony");
  });

  it('Test 2 : Vérifie la présence du hero', () => {
    
    cy.get('[data-cy="hero-section"]').should('be.visible')
    
    cy.get('[data-cy="hero-title"]').should('contain', 'Bienvenue')
  })

  it('Test 3 : Navigation vers les produits', () => {

    cy.get('[data-cy="nav-products"]').click()
    
 
    cy.url().should('include', '/product')

    cy.get('[data-cy="page-title"]').should('contain', 'Produits')
  })

  it('Test 4 : Navigation vers la connexion', () => {
    cy.get('[data-cy="login-link"]').click()
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-form"]').should('be.visible')
  })

  it('Test 5 : Connexion complète (avec env)', () => {

    cy.visit('/login')
    const adminEmail = Cypress.env('adminEmail')
    const adminPassword = Cypress.env('adminPassword')

    cy.get('[data-cy="email"]').type(adminEmail)
    cy.get('[data-cy="password"]').type(adminPassword)

    cy.get('[data-cy="submit"]').click()

    cy.get('[data-cy="user-menu"]').should('be.visible')
  })
});

describe('Test qui échoue (pour démonstration)', () => {

    it('Exemple d\'échec - élément inexistant', () => {
      cy.visit('/')
      
      cy.get('[data-cy="element-inexistant"]', { timeout: 3000 })
        .should('exist')
    })
  
  })



