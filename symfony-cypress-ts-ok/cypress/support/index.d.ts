// cypress/support/index.d.ts

interface Product {
    name: string
    price: string
    stock: string
    description?: string
    category?: string
  }
  
  declare namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsUser(): Chainable<void>
      shouldBeLoggedIn(): Chainable<void>
      shouldBeLoggedOut(): Chainable<void>
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      logout(): Chainable<void>
      createProduct(product: Product): Chainable<void>
      checkFlashMessage(type: string, text?: string): Chainable<void>
    }
  }