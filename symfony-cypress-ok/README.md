# Symfony Product Manager

Application Symfony 7 de gestion de produits - Projet de base pour formation Cypress.

## Installation

```bash
# 1. Démarrer PostgreSQL
docker compose up -d

# 2. Installer les dépendances PHP
composer install

# 3. Créer la base de données
php bin/console doctrine:database:create
php bin/console doctrine:schema:create

# 4. Charger les données de démonstration
php bin/console app:fixtures:load

# 5. Démarrer le serveur
symfony server:start
# ou
php -S 127.0.0.1:8000 -t public
```

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@example.com | password |
| User | user@example.com | password |

## Fonctionnalités

- Authentification (connexion/déconnexion)
- Liste des produits avec recherche et filtres
- CRUD complet sur les produits (création, lecture, modification, suppression)
- Contrôle d'accès (utilisateurs connectés uniquement pour les modifications)

## Routes principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/login` | Connexion |
| `/product` | Liste des produits |
| `/product/new` | Créer un produit |
| `/product/{id}` | Détails d'un produit |
| `/product/{id}/edit` | Modifier un produit |
