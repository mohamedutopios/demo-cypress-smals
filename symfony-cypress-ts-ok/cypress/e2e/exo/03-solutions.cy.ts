/// <reference types="cypress" />


describe('Solution Exercice 1 : Navigation', () => {

  it('Ex 1.1 - Visiter la page d\'accueil', () => {
    cy.visit('/')
  })

  it('Ex 1.2 - Visiter la page des produits', () => {
    cy.visit('/product')
  })

  it('Ex 1.3 - Naviguer via un clic', () => {
    cy.visit('/')
    cy.get('[data-cy="nav-products"]').click()
    cy.url().should('include', '/product')
  })

})

describe('Solution Exercice 2 : Sélection d\'éléments', () => {

  beforeEach(() => {
    cy.visit('/product')
  })

  it('Ex 2.1 - Sélectionner la liste des produits', () => {
    cy.get('[data-cy="products-list"]').should('be.visible')
  })

  it('Ex 2.2 - Compter les produits', () => {
    cy.get('[data-cy="product-item"]').should('have.length.at.least', 5)
  })

  it('Ex 2.3 - Sélectionner le premier produit', () => {
    cy.get('[data-cy="product-item"]').first().find('[data-cy="product-name"]').should('be.visible')
  })

})

describe('Solution Exercice 3 : Formulaire de recherche', () => {

  beforeEach(() => {
    cy.visit('/product')
  })

  it('Ex 3.1 - Taper dans le champ de recherche', () => {
    cy.get('[data-cy="search-input"]').type('MacBook')
  })

  it('Ex 3.2 - Rechercher un produit', () => {
    cy.get('[data-cy="search-input"]').type('iPhone')
    cy.get('[data-cy="search-btn"]').click()
    cy.url().should('include', 'q=iPhone')
  })

  it('Ex 3.3 - Vérifier les résultats de recherche', () => {
    cy.get('[data-cy="search-input"]').type('MacBook')
    cy.get('[data-cy="search-btn"]').click()
    cy.get('[data-cy="product-name"]').first().should('contain', 'MacBook')
  })

})

describe('Solution Exercice 4 : Formulaire de connexion', () => {

  beforeEach(() => {
    cy.visit('/login')
  })

  it('Ex 4.1 - Remplir le formulaire', () => {
    cy.get('[data-cy="email"]').type('admin@example.com')
    cy.get('[data-cy="password"]').type('password')
  })

  it('Ex 4.2 - Soumettre le formulaire', () => {
    cy.get('[data-cy="email"]').type('admin@example.com')
    cy.get('[data-cy="password"]').type('password')
    cy.get('[data-cy="submit"]').click()
    cy.url().should('not.include', '/login')
  })

  it('Ex 4.3 - Vérifier la connexion réussie', () => {
    cy.get('[data-cy="email"]').type('admin@example.com')
    cy.get('[data-cy="password"]').type('password')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="user-menu"]').should('be.visible')
  })

  it('Ex 4.4 - Tester une erreur de connexion', () => {
    cy.get('[data-cy="email"]').type('admin@example.com')
    cy.get('[data-cy="password"]').type('mauvais_mot_de_passe')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="login-error"]').should('be.visible')
  })

})

describe('Solution Exercice 5 : Filtres de catégorie', () => {

  beforeEach(() => {
    cy.visit('/product')
  })

  it('Ex 5.1 - Filtrer par catégorie', () => {
    cy.get('[data-cy="filter-electronics"]').click()
    cy.url().should('include', 'category=electronics')
  })

  it('Ex 5.2 - Retirer le filtre', () => {
    cy.get('[data-cy="filter-electronics"]').click()
    cy.get('[data-cy="filter-all"]').click()
    cy.url().should('not.include', 'category')
  })

})

describe('Solution Exercice 6 : Navigation complète', () => {

  it('Ex 6 - Parcours utilisateur complet', () => {
 
    cy.visit('/')
    
    cy.get('[data-cy="hero-section"]').should('be.visible')
    
    cy.get('[data-cy="hero-cta-products"]').click()
    
    cy.url().should('include', '/product')
    
    cy.get('[data-cy="view-btn"]').first().click()
    
    cy.url().should('match', /\/product\/\d+/)
    
    cy.get('[data-cy="product-detail"]').should('be.visible')
  })

})
