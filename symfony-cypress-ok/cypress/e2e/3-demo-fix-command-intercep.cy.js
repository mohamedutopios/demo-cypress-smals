describe("1 - Etape demo Commands", () => {
  describe("Commands liés à l'authentification", () => {
    it("cy-login", () => {
      cy.login("admin@example.com", "password");
      cy.shouldBeLoggedIn();
    });

    it("cy-loginAsAdmin", () => {
      cy.loginAsAdmin();
      cy.get('[data-cy="user-menu"]').should("contain", "Admin");
    });

    it("cy.loginAsUser() - connexion rapide user", () => {
      cy.loginAsUser();
      cy.get('[data-cy="user-menu"]').should("contain", "Jean");
    });

    it("cy.logout() - déconnexion", () => {
      cy.loginAsAdmin();
      cy.logout();
      cy.shouldBeLoggedOut();
    });
  });

  describe("Commands liés aux produits", () => {
    beforeEach(() => {
      cy.loginAsAdmin();
    });

    it("cy.createProduct() - création avec tous les champs", () => {
      const product = {
        name: "Produit Command Test " + Date.now(),
        description: "Créé via custom command",
        price: "149.99",
        stock: "30",
        category: "electronics",
      };

      cy.createProduct(product);
      cy.checkFlashMessage("success");
    });
    it("cy.createProduct() - création minimale", () => {
      cy.createProduct({
        name: "Produit Minimal " + Date.now(),
        price: "10",
        stock: "1",
      });
      cy.checkFlashMessage("success");
    });
  });
});

describe("2. Fixtures", () => {
  describe("Méthode 1 : cy.fixture().then()", () => {
    it("charge et utilise une fixture users", () => {
      cy.fixture("users").then((users) => {
        cy.log("Admin email:", users.admin.email);
        cy.login(users.admin.email, users.admin.password);
        cy.shouldBeLoggedIn();
      });
    });
  });
  describe("Méthode 2 : Alias avec @", () => {
    beforeEach(() => {
      cy.fixture("users").as("users");
      cy.fixture("products").as("products");
    });

    it("utilise this.users", function () {
      cy.login(this.users.admin.email, this.users.admin.password);
      cy.shouldBeLoggedIn();
    });

    it("utilise this.products", function () {
      cy.loginAsAdmin();
      const product = {
        ...this.products.minimal,
        name: "Alias Test " + Date.now(),
      };
      cy.createProduct(product);
      cy.checkFlashMessage("success");
    });
  });
});

describe("3. cy.intercept() - Interception HTTP", () => {
  describe("Espionner les requêtes (spy)", () => {
    it("espionne une requête GET", () => {
      cy.intercept("GET", "/product/").as("getProducts");
      cy.visit("/product/");
      cy.wait("@getProducts").its("response.statusCode").should("eq", 200);
    });
    it("espionne une requête POST", () => {
      cy.intercept("POST", "/login").as("postLogin");
      cy.visit("/login");
      cy.get('[data-cy="email"]').type("admin@example.com");
      cy.get('[data-cy="password"]').type("password");
      cy.get('[data-cy="submit"]').click();

      cy.wait("@postLogin").then((interception) => {
        cy.log("Login request intercepted");
        expect(interception.request.body).to.include("_username=admin");
      });
    });
  });
  describe("Simuler des réponses (mock)", () => {
    it("mock avec un objet simple", () => {
      cy.intercept("GET", "/api/test", {
        statusCode: 200,
        body: {
          message: "Réponse mockée",
          data: [1, 2, 3],
        },
      }).as("mockApi");

      cy.log("Mock configuré pour /api/test");
    });
    it("mock avec une fixture", () => {
      cy.intercept("GET", "/api/products", {
        fixture: "api/products-list.json",
      }).as("mockProducts");

      cy.log("Mock configuré avec fixture");
    });
  });
});
