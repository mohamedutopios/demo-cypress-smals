// cypress/support/commands.ts

// ─── Interfaces ──────────────────────────────────────────────────────

interface Product {
  name: string
  price: string
  stock: string
  description?: string
  category?: string
}

// ─── Commands ────────────────────────────────────────────────────────

Cypress.Commands.add('login', (email: string, password: string): void => {
  cy.visit('/login')
  cy.get('[data-cy="email"]').clear().type(email)
  cy.get('[data-cy="password"]').clear().type(password)
  cy.get('[data-cy="submit"]').click()

  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('loginAsAdmin', (): void => {
  cy.login(
    Cypress.env('adminEmail'),
    Cypress.env('adminPassword')
  )
})

Cypress.Commands.add('loginAsUser', (): void => {
  cy.login(
    Cypress.env('userEmail'),
    Cypress.env('userPassword')
  )
})

Cypress.Commands.add('shouldBeLoggedIn', (): void => {
  cy.get('[data-cy="user-menu"]').should('be.visible')
  cy.get('[data-cy="login-link"]').should('not.exist')
})

Cypress.Commands.add('shouldBeLoggedOut', (): void => {
  cy.get('[data-cy="login-link"]').should('be.visible')
  cy.get('[data-cy="user-menu"]').should('not.exist')
})

Cypress.Commands.add('dataCy', (value: string): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.get(`[data-cy="${value}"]`)
})

Cypress.Commands.add('logout', (): void => {
  cy.get('[data-cy="user-menu"]').click()
  cy.get('[data-cy="logout-link"]').click()

  cy.get('[data-cy="login-link"]').should('be.visible')
})

Cypress.Commands.add('createProduct', (product: Product): void => {
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

Cypress.Commands.add('checkFlashMessage', (type: string, text?: string): void => {
  const selector = `[data-cy="flash-${type}"]`
  cy.get(selector).should('be.visible')
  if (text) {
    cy.get(selector).should('contain', text)
  }
})

//  npm install --save-dev typescript