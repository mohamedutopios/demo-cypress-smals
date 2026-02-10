// Navigation

describe('Navigation avec cy.visit()', () => {

    it('visite la page d\'accueil', () => {
      cy.visit('/')
    })
  
    it('visite la page des produits', () => {
      cy.visit('/product')
    })
  
    it('visite la page de connexion', () => {
      cy.visit('/login')
    })
  
    it('visite avec une URL relative', () => {
  
      cy.visit('/product')
      
    })
  
  })

// selection

describe('Sélection avec cy.get()', () => {

    beforeEach(() => {
      cy.visit('/')
    })
  
    it('sélectionne par attribut data-cy (recommandé)', () => {
      cy.get('[data-cy="hero-section"]')
      cy.get('[data-cy="nav-products"]')
      cy.get('[data-cy="login-link"]')
    })
  
    it('sélectionne par classe CSS', () => {
      cy.get('.navbar')
      cy.get('.btn')
    })
  
    it('sélectionne par ID', () => {
      cy.get('#navbarNav')
    })
  
    it('sélectionne par balise', () => {
      cy.get('nav')
      cy.get('h1')
    })
  
    it('sélectionne avec un sélecteur combiné', () => {
      cy.get('nav.navbar')
      cy.get('a.nav-link')
    })
  
    it('sélectionne le premier élément', () => {
      cy.get('[data-cy="product-card"]').first()
    })
  
    it('sélectionne par index', () => {
      cy.get('[data-cy="product-card"]').eq(0)
      cy.get('[data-cy="product-card"]').eq(1)
    })
  
    it('sélectionne dans un contexte (within)', () => {
      cy.get('[data-cy="hero-section"]').within(() => {
        cy.get('h1') 
      })
    })
  
  })

  