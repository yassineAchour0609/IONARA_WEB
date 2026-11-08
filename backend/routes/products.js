const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Default initial catalog
const SEED_PRODUCTS = [
  {
    slug: "pack-1000-games",
    title: "Pack Ultime Steam — +1,170 Jeux Inclus",
    subtitle: "Bibliothèque Steam complète sur un seul compte",
    image: "/assets/games/1000-games-pack.png",
    platform: "Steam",
    category: "steam",
    isFeatured: true,
    badge: "BEST-SELLER 🔥",
    tag: "Offre Légendaire",
    priceDZD: 4500,
    oldPriceDZD: 14000,
    priceEUR: 25,
    oldPriceEUR: 80,
    priceUSD: 28,
    oldPriceUSD: 85,
    rating: 5.0,
    reviewsCount: 342,
    delivery: "5 - 15 minutes",
    guarantee: "Garantie à Vie",
    description: "Le compte le plus rentable de l'histoire du gaming ! Accédez à plus de 1 170 jeux vidéo Steam complets sur un seul et unique compte personnel.",
    features: [
      "+1,170 Jeux Steam prêts à télécharger sans frais additionnels",
      "Email & mot de passe 100% personnalisables à votre nom",
      "Mode Solo & Hors-ligne illimité, aucun risque de bannissement",
      "Garantie à vie & support prioritaire 24/7"
    ],
    keyGames: ["Grand Theft Auto V", "Red Dead Redemption 2", "Elden Ring", "Baldur's Gate 3", "Cyberpunk 2077", "God of War"],
    inStock: true
  },
  {
    slug: "gta-6",
    title: "Grand Theft Auto VI — Édition VIP",
    subtitle: "Réservation Prioritaire & Accès Jour J",
    image: "/assets/games/gta-6.png",
    platform: "Rockstar / Console",
    category: "preorder",
    isFeatured: true,
    badge: "PRÉCOMMANDE VIP ⭐",
    tag: "Le Plus Attendu",
    priceDZD: 7900,
    oldPriceDZD: 12500,
    priceEUR: 45,
    oldPriceEUR: 75,
    priceUSD: 49,
    oldPriceUSD: 80,
    rating: 5.0,
    reviewsCount: 189,
    delivery: "Accès Garanti Jour J",
    guarantee: "Garantie Totale",
    description: "Soyez le premier à explorer le Vice City nouvelle génération ! Compte réservé officiel comprenant l'accès complet au jeu et tous les bonus exclusifs.",
    features: ["Réservation officielle garantie", "Accès complet avec vos coordonnées", "Support d'activation dédié"],
    keyGames: ["GTA VI", "Pack Vice City VIP"],
    inStock: true
  },
  {
    slug: "ea-fc-27",
    title: "EA SPORTS FC 27 — Édition Ultimate",
    subtitle: "Compte EA App / Steam avec Points Bonus",
    image: "/assets/games/ea-fc-27.png",
    platform: "Steam / EA App",
    category: "nouveautes",
    isFeatured: true,
    badge: "NOUVEAUTÉ ⚽",
    tag: "Compétitif",
    priceDZD: 6500,
    oldPriceDZD: 9800,
    priceEUR: 39,
    oldPriceEUR: 62,
    priceUSD: 42,
    oldPriceUSD: 68,
    rating: 4.9,
    reviewsCount: 97,
    delivery: "10 minutes",
    guarantee: "Garantie 1 An",
    description: "La simulation footballistique référence avec Ultimate Team et Carrière. Compte vérifié avec email modifiable.",
    features: ["Jeu complet sans restrictions", "Possibilité de changer l'email et le mot de passe", "Multijoueur en ligne fluide"],
    keyGames: ["EA SPORTS FC 27"],
    inStock: true
  },
  {
    slug: "xbox-game-pass-ultimate-1year",
    title: "Xbox Game Pass Ultimate — 1 An (12 Mois)",
    subtitle: "Accès PC + Xbox Series + Cloud Gaming",
    image: "/assets/games/xbox-game-pass-1year.png",
    platform: "Xbox / PC",
    category: "passes",
    isFeatured: true,
    badge: "OFFRE SPÉCIALE 🚀",
    tag: "Abonnement",
    priceDZD: 5900,
    oldPriceDZD: 13000,
    priceEUR: 36,
    oldPriceEUR: 85,
    priceUSD: 39,
    oldPriceUSD: 90,
    rating: 5.0,
    reviewsCount: 278,
    delivery: "5 minutes",
    guarantee: "Garantie 12 Mois",
    description: "Le catalogue gaming le plus complet au monde pendant un an ! Plus de 400 jeux console & PC, accès Day One et EA Play inclus.",
    features: ["12 mois complets garantis", "Valable sur PC et Xbox", "EA Play inclus"],
    keyGames: ["Halo Infinite", "Forza Horizon", "Starfield", "Minecraft"],
    inStock: true
  },
  {
    slug: "cod-black-ops-7",
    title: "Call of Duty: Black Ops 7",
    subtitle: "Campagne, Multijoueur & Zombies",
    image: "/assets/games/cod-black-ops-7.png",
    platform: "Steam",
    category: "preorder",
    isFeatured: false,
    badge: "TOP FPS 💥",
    tag: "Action",
    priceDZD: 6900,
    oldPriceDZD: 11000,
    priceEUR: 42,
    oldPriceEUR: 68,
    priceUSD: 45,
    oldPriceUSD: 72,
    rating: 4.9,
    reviewsCount: 112,
    delivery: "10 minutes",
    guarantee: "Garantie à Vie",
    description: "Le retour de la saga légendaire Black Ops avec le nouveau système omnimovement.",
    features: ["Compte Steam original", "Accès complet au multijoueur"],
    keyGames: ["Call of Duty Black Ops 7"],
    inStock: true
  },
  {
    slug: "valorant-points",
    title: "Packs Valorant Points (VP) — Riot Games",
    subtitle: "Recharges Immédiates & Comptes à Skins",
    image: "/assets/games/valorant-points.png",
    platform: "Riot Games",
    category: "currencies",
    isFeatured: false,
    badge: "RIOT OFFICIEL 🎯",
    tag: "Monnaies",
    priceDZD: 3200,
    oldPriceDZD: 5200,
    priceEUR: 19,
    oldPriceEUR: 32,
    priceUSD: 21,
    oldPriceUSD: 35,
    rating: 4.9,
    reviewsCount: 143,
    delivery: "5 minutes",
    guarantee: "100% Garanti",
    description: "Obtenez vos skins Kuronami, Reaver et Prime préférés aux meilleurs tarifs du marché.",
    features: ["Jusqu'à -40% d'économie", "Livraison immédiate"],
    keyGames: ["Valorant"],
    inStock: true
  }
];

// @route   GET /api/products
// @desc    Get all products (with optional filter by category or search)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } }
      ];
    }

    let products = [];
    try {
      products = await Product.find(query);
    } catch (dbErr) {
      // Fallback if Mongo is down
      products = [];
    }

    // If database is empty or not populated, use SEED_PRODUCTS
    if (!products || products.length === 0) {
      let filtered = SEED_PRODUCTS;
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.subtitle.toLowerCase().includes(s));
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      product = SEED_PRODUCTS.find(p => p.slug === req.params.slug);
    }
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   POST /api/products/seed
// @desc    Seed default products into MongoDB
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(SEED_PRODUCTS);
    res.json({ success: true, message: `${inserted.length} produits ajoutés à MongoDB !`, data: inserted });
  } catch (error) {
    res.status(500).json({ message: 'Erreur seeding', error: error.message });
  }
});

module.exports = router;
