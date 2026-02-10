

describe('Création de produit', () => {


  before(() => {
    cy.resetDb()
  })

  // ── beforeEach GLOBAL : login + chargement fixtures ───────────
  // S'applique à TOUS les tests de ce describe
  beforeEach(() => {
    cy.fixture('products').as('productsData')
  })


  context('en tant qu\'admin', () => {

    // beforeEach LOCAL : s'ajoute au global
    // Ordre d'exécution : fixture (global) → login + visit (local)
    beforeEach(() => {
      cy.login('admin@example.com', 'password')
      cy.visit('/product/new')
    })

    afterEach(() => {
      cy.logout()
    })

    it('affiche le formulaire de création', () => {
      cy.dataCy('product-name').should('be.visible')
      cy.dataCy('product-price').should('be.visible')
      cy.dataCy('product-stock').should('be.visible')
      cy.dataCy('submit-btn').should('be.visible')
    })

    it('crée un produit avec des données valides', () => {
      cy.dataCy('product-name').type('Produit Test V5')
      cy.dataCy('product-description').type('Créé dans la démo 5 - structuration')
      cy.dataCy('product-price').clear().type('99.99')
      cy.dataCy('product-stock').clear().type('50')

      cy.dataCy('submit-btn').click()

      cy.dataCy('flash-success')
        .should('be.visible')
        .and('contain', 'succès')
    })

    it('crée un produit avec les données d\'une fixture', function () {
      // ⚠️ function() obligatoire pour accéder à this.productsData
      const product = this.productsData[0]

      cy.dataCy('product-name').type(product.name)
      cy.dataCy('product-description').type(product.description)
      cy.dataCy('product-price').clear().type(product.price.toString())
      cy.dataCy('product-stock').clear().type(product.stock.toString())

      cy.dataCy('submit-btn').click()

      cy.dataCy('flash-success').should('be.visible')
    })

    it('utilise cy.createProduct() pour créer rapidement', () => {
      // Utilisation de la custom command définie dans commands.js
      cy.createProduct({
        name: 'Produit via Command',
        description: 'Créé avec cy.createProduct()',
        price: 59.99,
        stock: 25,
      })

      cy.dataCy('flash-success').should('be.visible')
    })

    const produitsACreer = [
      { name: 'Laptop Gamer',    price: '1499.99', stock: '10' },
      { name: 'Souris Sans Fil', price: '49.99',   stock: '150' },
      { name: 'Webcam HD',       price: '79.99',   stock: '60' },
    ]

    produitsACreer.forEach((product) => {
      it(`crée le produit : ${product.name}`, () => {
        cy.dataCy('product-name').type(product.name)
        cy.dataCy('product-price').clear().type(product.price)
        cy.dataCy('product-stock').clear().type(product.stock)

        cy.dataCy('submit-btn').click()

        cy.dataCy('flash-success')
          .should('be.visible')
          .and('contain', 'succès')
      })
    })


    context('validation du formulaire', () => {

      it('refuse un produit sans nom', () => {
      
        cy.dataCy('product-price').clear().type('99.99')
        cy.dataCy('product-stock').clear().type('10')
        cy.dataCy('submit-btn').click()

       
        cy.url().should('include', '/product')
      })

      it('refuse un prix négatif', () => {
        cy.dataCy('product-name').type('Produit Invalide')
        cy.dataCy('product-price').clear().type('-10')
        cy.dataCy('product-stock').clear().type('10')
        cy.dataCy('submit-btn').click()

        cy.url().should('include', '/product')
      })

      it('refuse un stock négatif', () => {
        cy.dataCy('product-name').type('Produit Stock Négatif')
        cy.dataCy('product-price').clear().type('10')
        cy.dataCy('product-stock').clear().type('-5')
        cy.dataCy('submit-btn').click()

        cy.url().should('include', '/product')
      })
    })
  })


  context('en tant que visiteur (non connecté)', () => {

    it('redirige vers /login si on tente d\'accéder à /product/new', () => {
      cy.visit('/product/new')
      cy.url().should('include', '/login')
    })
  })
})
