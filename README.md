# 🎮 IONARA STORE — Plateforme E-Commerce Gaming Fullstack

Boutique e-commerce haut de gamme conçue pour la vente de **comptes de jeux vidéo**, **précommandes exclusives (GTA VI, EA FC 27)**, **abonnements (Xbox Game Pass Ultimate)** et **monnaies virtuelles (Points Valorant, Robux)**.

---

## 🛠️ Stack Technique

### Frontend (Next.js)
- **Framework** : Next.js 16 (App Router) + React 19
- **Style** : Tailwind CSS v4, Lucide Icons, Cyberpunk & Gaming UI
- **Typage** : TypeScript
- **Fonctionnalités** :
  - Catalogue interactif avec filtres multi-catégories et multi-plateformes (Steam, PlayStation, Xbox, Riot, Rockstar)
  - Sélecteur de devise en temps réel (**DZD 🇩🇿, EUR 🇪🇺, USD 🇺🇸**)
  - Explorateur de bibliothèque Steam avec recherche instantanée dans les **1 176 jeux**
  - Panier interactif en tiroir avec code promo (`IONARA10` = -10%, `VIP20` = -20%)
  - Tunnel de commande sécurisé avec sélection du moyen de paiement (BaridiMob, CCP, Carte Bancaire, PayPal, Crypto USDT)
  - Intégration WhatsApp directe en 1-clic pour validation et livraison sous 5 à 15 minutes
  - Espace Client (Connexion / Inscription)

### Backend (Node.js & Express)
- **Serveur** : Node.js avec Express
- **Sécurité** : JWT (JSON Web Tokens), Hachage de mot de passe Bcrypt, CORS
- **Base de données** : MongoDB via Mongoose (avec fallback résilient automatique en mémoire si la base locale est éteinte)
- **Points d'accès (API)** :
  - `GET /api/health` : État de santé du serveur
  - `GET /api/products` : Liste des produits avec filtres
  - `GET /api/products/:slug` : Détails d'un jeu
  - `POST /api/products/seed` : Initialisation des produits dans MongoDB
  - `POST /api/auth/register` : Création de compte client
  - `POST /api/auth/login` : Authentification et token JWT
  - `POST /api/orders` : Enregistrement de commande
  - `GET /api/orders/:orderNumber` : Suivi de commande

---

## 🚀 Démarrage Rapide

### Option 1 : Lancement en 1 Clic (Recommandé)
Double-cliquez simplement sur le fichier :
```
start-shop.bat
```
Ce script démarre automatiquement le serveur Node.js sur le port **5000**, le serveur Next.js sur le port **3000**, et ouvre votre navigateur.

### Option 2 : Lancement Manuel dans deux terminaux

#### 1. Démarrer le Backend :
```bash
cd backend
node server.js
```
Le serveur tourne sur `http://localhost:5000`.

#### 2. Démarrer le Frontend :
```bash
cd frontend
npm.cmd run dev
```
La boutique est accessible sur `http://localhost:3000`.

---

## 📁 Structure du Projet

```
IONARA WEB SHOP/
├── backend/
│   ├── config/
│   │   └── db.js                 # Connexion MongoDB résiliente
│   ├── models/
│   │   ├── User.js               # Schéma utilisateur Mongoose
│   │   ├── Product.js            # Schéma produit multi-devises
│   │   └── Order.js              # Schéma commandes et livraisons
│   ├── routes/
│   │   ├── auth.js               # Inscription & Connexion
│   │   ├── products.js           # Catalogue API & Seed
│   │   └── orders.js             # Enregistrement des commandes
│   ├── package.json
│   └── server.js                 # Serveur Express principal
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       ├── logo/             # Logo officiel IONARA (SVG & PNG)
│   │       ├── games/            # Affiches de jeux haute qualité
│   │       ├── platforms/        # Logos Steam, PSN, Xbox, Riot, etc.
│   │       └── games_list.json   # Base complète des 1,176 jeux Steam
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # Styles Cyber/Gamer & polices
│   │   │   ├── layout.tsx        # Métadonnées & ShopProvider
│   │   │   └── page.tsx          # Page principale assemblée
│   │   ├── components/           # Composants Next.js modulaires
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── PlatformsBar.tsx
│   │   │   ├── PackSpotlight.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── GamesCatalogModal.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Toast.tsx
│   │   ├── context/
│   │   │   └── ShopContext.tsx   # État global (panier, devise, auth)
│   │   ├── data/
│   │   │   └── products.ts       # Données des articles officiels
│   │   └── types/
│   │       └── index.ts          # Interfaces TypeScript
│   └── package.json
├── start-shop.bat                # Lanceur automatique Windows
└── README.md
```

---

## 💳 Méthodes de Paiement Intégrées
- **BaridiMob** (Algérie) : Virement instantané avec copie du RIP en 1 clic
- **CCP** (Algérie) : Virement postal
- **Carte Bancaire** : Edahabia, CIB, Visa, MasterCard
- **PayPal & Crypto (USDT)**
- **WhatsApp Direct** : Message préformaté généré automatiquement avec le détail du panier.
