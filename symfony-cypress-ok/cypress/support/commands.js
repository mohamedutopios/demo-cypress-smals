
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login')
    cy.get('[data-cy="email"]').clear().type(email)
    cy.get('[data-cy="password"]').clear().type(password)
    cy.get('[data-cy="submit"]').click()
   
    cy.url().should('not.include', '/login')
  })

  Cypress.Commands.add('loginAsAdmin', () => {
    cy.login(
      Cypress.env('adminEmail'),
      Cypress.env('adminPassword')
    )
  })

  Cypress.Commands.add('loginAsUser', () => {
    cy.login(
      Cypress.env('userEmail'),
      Cypress.env('userPassword')
    )
  })

  Cypress.Commands.add('shouldBeLoggedIn', () => {
    cy.get('[data-cy="user-menu"]').should('be.visible')
    cy.get('[data-cy="login-link"]').should('not.exist')
  })

  Cypress.Commands.add('shouldBeLoggedOut', () => {
    cy.get('[data-cy="login-link"]').should('be.visible')
    cy.get('[data-cy="user-menu"]').should('not.exist')
  })

  Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy="${value}"]`)
  })

  Cypress.Commands.add('logout', () => {
    cy.get('[data-cy="user-menu"]').click()
    cy.get('[data-cy="logout-link"]').click()
  
    cy.get('[data-cy="login-link"]').should('be.visible')
  })
  
  Cypress.Commands.add('createProduct', (product) => {
    cy.visit('/product/new')
    
    cy.get('[data-cy="product-name"]').clear().type(product.name)
    cy.get('[data-cy="product-price"]').clear().type(product.price)
    cy.get('[data-cy="product-stock"]').clear().type(product.stock)
    
    if (product.description) {
      cy.get('[data-cy="product-description"]').clear().type(product.description)
    }
    if (product.category) {
      cy.get('[data-cy="product-category"]').select(product.category)
    }
    
    cy.get('[data-cy="submit-btn"]').click()
  })

  Cypress.Commands.add('checkFlashMessage', (type, text = null) => {
    const selector = `[data-cy="flash-${type}"]`
    cy.get(selector).should('be.visible')
    if (text) {
      cy.get(selector).should('contain', text)
    }
  })