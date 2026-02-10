/// <reference types="cypress" />

/**
 * EXERCICES PRATIQUES - COMMANDES DE BASE
 * 
 * Complétez les tests ci-dessous en remplaçant les ___ par le code approprié.
 * Consultez le fichier 01-exemples-commandes.cy.js pour vous aider.
 */

describe('Exercice 1 : Navigation', () => {

    it('Ex 1.1 - Visiter la page d\'accueil', () => {
      // TODO: Visitez la page d'accueil
      // cy.visit(___)
    })
  
    it('Ex 1.2 - Visiter la page des produits', () => {
      // TODO: Visitez la page /product
    })
  
    it('Ex 1.3 - Naviguer via un clic', () => {
      cy.visit('/')
      // TODO: Cliquez sur le lien "Produits" dans la navbar
      // Indice: data-cy="nav-products"
      
      // TODO: Vérifiez que l'URL contient "/product"
    })
  
  })
  
  describe('Exercice 2 : Sélection d\'éléments', () => {
  
    beforeEach(() => {
      cy.visit('/product')
    })
  
    it('Ex 2.1 - Sélectionner la liste des produits', () => {
      // TODO: Sélectionnez l'élément avec data-cy="products-list"
      // et vérifiez qu'il est visible
    })
  
    it('Ex 2.2 - Compter les produits', () => {
      // TODO: Sélectionnez tous les éléments data-cy="product-item"
      // et vérifiez qu'il y en a au moins 5
      // Indice: should('have.length.at.least', 5)
    })
  
    it('Ex 2.3 - Sélectionner le premier produit', () => {
      // TODO: Sélectionnez le premier product-item
      // et vérifiez qu'il contient un product-name visible
      // Indice: .first() et .within()
    })
  
  })
  
  describe('Exercice 3 : Formulaire de recherche', () => {
  
    beforeEach(() => {
      cy.visit('/product')
    })
  
    it('Ex 3.1 - Taper dans le champ de recherche', () => {
      // TODO: Tapez "MacBook" dans le champ data-cy="search-input"
    })
  
    it('Ex 3.2 - Rechercher un produit', () => {
      // TODO: 
      // 1. Tapez "iPhone" dans le champ de recherche
      // 2. Cliquez sur le bouton de recherche (data-cy="search-btn")
      // 3. Vérifiez que l'URL contient "q=iPhone"
    })
  
    it('Ex 3.3 - Vérifier les résultats de recherche', () => {
      cy.get('[data-cy="search-input"]').type('MacBook')
      cy.get('[data-cy="search-btn"]').click()
      
      // TODO: Vérifiez que le premier produit affiché contient "MacBook"
      // Indice: cy.get('[data-cy="product-name"]').first().should('contain', ___)
    })
  
  })
  
  describe('Exercice 4 : Formulaire de connexion', () => {
  
    beforeEach(() => {
      cy.visit('/login')
    })
  
    it('Ex 4.1 - Remplir le formulaire', () => {
      // TODO: 
      // 1. Tapez "admin@example.com" dans le champ email
      // 2. Tapez "password" dans le champ password
    })
  
    it('Ex 4.2 - Soumettre le formulaire', () => {
      cy.get('[data-cy="email"]').type('admin@example.com')
      cy.get('[data-cy="password"]').type('password')
      
      // TODO: Cliquez sur le bouton de soumission (data-cy="submit")
      
      // TODO: Vérifiez que l'URL ne contient plus "/login"
    })
  
    it('Ex 4.3 - Vérifier la connexion réussie', () => {
      cy.get('[data-cy="email"]').type('admin@example.com')
      cy.get('[data-cy="password"]').type('password')
      cy.get('[data-cy="submit"]').click()
      
      // TODO: Vérifiez que le menu utilisateur (data-cy="user-menu") est visible
    })
  
    it('Ex 4.4 - Tester une erreur de connexion', () => {
      cy.get('[data-cy="email"]').type('admin@example.com')
      cy.get('[data-cy="password"]').type('mauvais_mot_de_passe')
      cy.get('[data-cy="submit"]').click()
      
      // TODO: Vérifiez que le message d'erreur (data-cy="login-error") est visible
    })
  
  })
  
  describe('Exercice 5 : Filtres de catégorie', () => {
  
    beforeEach(() => {
      cy.visit('/product')
    })
  
    it('Ex 5.1 - Filtrer par catégorie', () => {
      // TODO: Cliquez sur le filtre "Électronique" (data-cy="filter-electronics")
      
      // TODO: Vérifiez que l'URL contient "category=electronics"
    })
  
    it('Ex 5.2 - Retirer le filtre', () => {
      cy.get('[data-cy="filter-electronics"]').click()
      
      // TODO: Cliquez sur "Tous" (data-cy="filter-all")
      
      // TODO: Vérifiez que l'URL ne contient plus "category"
      // Indice: should('not.include', 'category')
    })
  
  })
  
  describe('Exercice 6 : Navigation complète', () => {
  
    it('Ex 6 - Parcours utilisateur complet', () => {
      // TODO: Complétez ce parcours utilisateur :
      
      // 1. Visitez la page d'accueil
      
      // 2. Vérifiez que le hero est visible
      
      // 3. Cliquez sur "Voir les produits" (data-cy="hero-cta-products")
      
      // 4. Vérifiez que vous êtes sur /product
      
      // 5. Cliquez sur le premier bouton "Voir" (data-cy="view-btn")
      
      // 6. Vérifiez que l'URL contient "/product/"
      
      // 7. Vérifiez que les détails du produit (data-cy="product-detail") sont visibles
    })
  
  })
  