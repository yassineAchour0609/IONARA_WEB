/**
 * IONARA WEB SHOP - Main Application Logic
 * Gestion des devises (TND, EUR, USD), du panier cyberpunk, des filtres et de la navigation produit
 */

// Application State
const state = {
  currentCurrency: localStorage.getItem('ionara_currency') || 'TND',
  activeCategory: 'all',
  searchQuery: '',
  cart: JSON.parse(localStorage.getItem('ionara_cart') || '[]'),
  promoDiscount: 0,
  activePromoCode: '',
  soundEnabled: localStorage.getItem('ionara_sound') === 'true',
  quickViewProduct: null,
  gamesCatalog: []
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initCurrency();

  // Parse URL Parameters (ex: catalog.html?category=steam&search=gta)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) {
    state.activeCategory = urlParams.get('category');
  }
  if (urlParams.has('search')) {
    state.searchQuery = urlParams.get('search');
    const navInput = document.getElementById('navbar-search-input');
    const mainInput = document.getElementById('main-search-input');
    if (navInput) navInput.value = state.searchQuery;
    if (mainInput) mainInput.value = state.searchQuery;
  }

  renderBestsellers();
  renderProducts();
  renderFeaturedSpotlight();
  renderPlatforms();
  renderReviews();
  renderFAQ();
  updateCartUI();
  setupEventListeners();
  loadGamesList();

  // If a category was in the URL, update the active button visual
  if (urlParams.has('category')) {
    setTimeout(() => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(b => {
        if (b.dataset.category === state.activeCategory) {
          b.classList.add('bg-pink-600', 'text-white', 'border-pink-500');
          b.classList.remove('bg-white/5', 'text-zinc-400', 'border-white/10');
        } else {
          b.classList.remove('bg-pink-600', 'text-white', 'border-pink-500');
          b.classList.add('bg-white/5', 'text-zinc-400', 'border-white/10');
        }
      });
    }, 50);
  }
});

// Sound Effects via Web Audio API
function playSound(type = 'click') {
  if (!state.soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } else if (type === 'add') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(980, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }
  } catch (e) {
    // Audio context may require user interaction
  }
}

// Currency Formatter - Default to TND (Tunisian Dinar)
function formatPrice(tnd, eur, usd) {
  if (state.currentCurrency === 'EUR') {
    return `${eur} €`;
  } else if (state.currentCurrency === 'USD') {
    return `$${usd}`;
  } else {
    const val = tnd !== undefined ? tnd : 0;
    return `${val.toLocaleString('fr-FR')} TND`;
  }
}

function getNumericPrice(product) {
  if (state.currentCurrency === 'EUR') return product.priceEUR || 0;
  if (state.currentCurrency === 'USD') return product.priceUSD || 0;
  return product.priceTND || product.priceDZD || 0;
}

function getCurrencySymbol() {
  if (state.currentCurrency === 'EUR') return '€';
  if (state.currentCurrency === 'USD') return '$';
  return 'TND';
}

// Currency Switcher
function setCurrency(currency) {
  if (!CURRENCIES[currency]) return;
  state.currentCurrency = currency;
  localStorage.setItem('ionara_currency', currency);
  
  // Update all select inputs
  const selects = document.querySelectorAll('.currency-selector');
  selects.forEach(s => s.value = currency);

  renderProducts();
  renderBestsellers();
  renderFeaturedSpotlight();
  updateCartUI();
  if (state.quickViewProduct) {
    openQuickView(state.quickViewProduct.id);
  }

  showToast(`Devise sélectionnée : ${CURRENCIES[currency].label}`, 'info');
  playSound('click');
}

function initCurrency() {
  const selects = document.querySelectorAll('.currency-selector');
  selects.forEach(s => {
    s.value = state.currentCurrency;
    s.addEventListener('change', (e) => setCurrency(e.target.value));
  });
}

// Load Full Games List from JSON for Search
async function loadGamesList() {
  try {
    const res = await fetch('assets/games_list.json');
    if (res.ok) {
      state.gamesCatalog = await res.json();
      updateGamesCountBadge();
    }
  } catch (e) {
    console.log('Running in standalone mode.');
  }
}

function updateGamesCountBadge() {
  const badge = document.getElementById('catalog-total-badge');
  if (badge && state.gamesCatalog.length > 0) {
    badge.textContent = `+${state.gamesCatalog.length} Jeux Référencés`;
  }
}

// Render Featured Spotlight (Pack 1000 Games)
function renderFeaturedSpotlight() {
  const spotlightContainer = document.getElementById('spotlight-banner');
  if (!spotlightContainer) return;

  const pack = PRODUCTS_DATA.find(p => p.id === 'pack-1000-games');
  if (!pack) return;

  const currentPrice = formatPrice(pack.priceTND || pack.priceDZD, pack.priceEUR, pack.priceUSD);
  const oldPrice = formatPrice(pack.oldPriceTND || pack.oldPriceDZD, pack.oldPriceEUR, pack.oldPriceUSD);

  spotlightContainer.innerHTML = `
    <div class="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-pink-950/40 p-8 lg:p-12 shadow-2xl backdrop-blur-xl">
      <!-- Ambient Backlight -->
      <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-pink-600/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Poster & Badges -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="relative group cursor-pointer" onclick="window.location.href='product.html?id=${pack.id}'">
            <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-60 blur-lg transition duration-500 group-hover:opacity-100"></div>
            <img 
              src="${pack.image}" 
              alt="${pack.title}"
              onerror="this.src='${pack.fallbackImage}'"
              class="relative rounded-2xl w-full max-w-sm object-cover shadow-2xl border border-white/10 transform transition duration-500 group-hover:scale-[1.02]"
            />
            <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/80 text-pink-400 border border-pink-500/40 backdrop-blur-md shadow-lg">
              <span class="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              Pack Légendaire
            </span>
          </div>
        </div>

        <!-- Info & Actions -->
        <div class="lg:col-span-7 space-y-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              ÉCONOMIE DE +70%
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ${pack.stockStatus}
            </span>
            <span class="text-xs text-zinc-400">⚡ ${pack.guarantee}</span>
          </div>

          <div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-headline">
              Compte Steam Ultime : <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">+1,170 Jeux AAA</span>
            </h2>
            <p class="mt-3 text-base sm:text-lg text-zinc-300 leading-relaxed">
              Le compte ultime rêvé par tout joueur. Une seule connexion pour débloquer GTA V, Red Dead 2, Elden Ring, Baldur's Gate 3, Black Myth Wukong, Cyberpunk 2077, God of War et plus d'un millier d'autres titres légendaires.
            </p>
          </div>

          <!-- Quick Preview Game Badges -->
          <div class="flex flex-wrap gap-2 pt-1">
            ${pack.keyGames.slice(0, 8).map(g => `
              <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">
                ${g}
              </span>
            `).join('')}
            <button onclick="openGamesListModal()" class="px-2.5 py-1 rounded-lg text-xs font-bold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition">
              + Voir les 1,170 jeux →
            </button>
          </div>

          <!-- Price & CTA -->
          <div class="pt-4 flex flex-wrap items-center gap-6">
            <div>
              <div class="text-xs font-medium uppercase text-zinc-400 tracking-wider">Prix Spécial Lancement</div>
              <div class="flex items-baseline gap-3">
                <span class="text-3xl sm:text-4xl font-extrabold text-white">
                  ${currentPrice}
                </span>
                <span class="text-lg text-zinc-500 line-through">
                  ${oldPrice}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button 
                onclick="addToCart('${pack.id}')"
                class="btn-neon-magenta px-7 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                Ajouter au Panier
              </button>
              <a 
                href="product.html?id=${pack.id}"
                class="btn-neon-outline px-6 py-3.5 rounded-xl font-semibold text-zinc-200 text-sm sm:text-base hover:text-white transition cursor-pointer flex items-center gap-2"
              >
                <span>Fiche Complète</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

// Reusable Product Card HTML Builder - Direct Link to Full Product Page
function createProductCardHTML(product) {
  const currentPrice = formatPrice(product.priceTND || product.priceDZD, product.priceEUR, product.priceUSD);
  const oldPrice = formatPrice(product.oldPriceTND || product.oldPriceDZD, product.oldPriceEUR, product.oldPriceUSD);

  return `
    <div class="game-card group relative flex flex-col rounded-2xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10">
      
      <!-- Poster Image with Badges - Click leads to full product page -->
      <div class="poster-container relative aspect-[4/5] w-full overflow-hidden bg-black/40 cursor-pointer" onclick="window.location.href='product.html?id=${product.id}'">
        <img 
          src="${product.image}" 
          alt="${product.title}"
          onerror="this.src='${product.fallbackImage}'"
          class="poster-img h-full w-full object-cover object-center"
          loading="lazy"
        />

        <!-- Top Badges -->
        <div class="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/75 text-white border border-white/20 backdrop-blur-md shadow-md">
            ${product.badge}
          </span>
          <span class="platform-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-200">
            <img src="${product.platformIcon}" alt="${product.platform}" class="w-4 h-4 object-contain rounded" onerror="this.style.display='none'">
            ${product.platform}
          </span>
        </div>

        <!-- Hover Overlay Button -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
          <a 
            href="product.html?id=${product.id}"
            onclick="event.stopPropagation();"
            class="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 shadow-lg"
          >
            <i data-lucide="eye" class="w-4 h-4"></i>
            Voir la fiche complète
          </a>
        </div>
      </div>

      <!-- Card Content -->
      <div class="flex flex-1 flex-col p-5">
        <div class="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span class="text-pink-400 font-semibold">${product.tag}</span>
          <span class="flex items-center gap-1 text-amber-400">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
            ${product.rating} <span class="text-zinc-500">(${product.reviewsCount})</span>
          </span>
        </div>

        <h3 class="text-lg font-bold text-white group-hover:text-pink-300 transition line-clamp-1 cursor-pointer" onclick="window.location.href='product.html?id=${product.id}'">
          ${product.title}
        </h3>
        
        <p class="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
          ${product.subtitle}
        </p>

        <!-- Feature mini badges -->
        <div class="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
          <span class="flex items-center gap-1 text-emerald-400 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            ${product.stockStatus.split(' ')[0]}
          </span>
          <span>•</span>
          <span>🛡️ ${product.guarantee}</span>
        </div>

        <!-- Price & CTA -->
        <div class="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.06]">
          <div>
            <div class="text-lg font-extrabold text-white">
              ${currentPrice}
            </div>
            <div class="text-xs text-zinc-500 line-through">
              ${oldPrice}
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button 
              onclick="${product.isGiftCard ? `openQuickGiftCardModal('${product.id}')` : `addToCart('${product.id}')`}"
              class="p-2.5 rounded-xl bg-pink-500/15 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/30 hover:border-pink-500 transition-all duration-200 cursor-pointer shadow-md group/btn"
              title="${product.isGiftCard ? 'Choisir le montant & la région' : 'Ajouter au panier'}"
            >
              <i data-lucide="${product.isGiftCard ? 'sliders-horizontal' : 'shopping-cart'}" class="w-4 h-4 transition-transform group-hover/btn:scale-110"></i>
            </button>
            <a 
              href="product.html?id=${product.id}"
              class="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer"
              title="Détails"
            >
              <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Bestsellers for Homepage
function renderBestsellers() {
  const container = document.getElementById('bestsellers-grid');
  if (!container) return;

  const bestsellers = PRODUCTS_DATA.filter(p => p.isFeatured).slice(0, 4);
  container.innerHTML = bestsellers.map(createProductCardHTML).join('');
  if (window.lucide) lucide.createIcons();
}

// Render Full Products Grid for Catalog Page
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = PRODUCTS_DATA.filter(product => {
    const matchesCategory = state.activeCategory === 'all' || product.category === state.activeCategory;
    const matchesSearch = !state.searchQuery || 
      product.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.platform.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400">
          <i data-lucide="search-x" class="w-8 h-8"></i>
        </div>
        <h3 class="text-xl font-bold text-white">Aucun compte trouvé</h3>
        <p class="text-zinc-400 mt-1">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
        <button onclick="resetFilters()" class="mt-4 px-5 py-2.5 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 hover:bg-pink-600/30 font-semibold text-sm transition">
          Réinitialiser les filtres
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(createProductCardHTML).join('');
  if (window.lucide) lucide.createIcons();
}

// Platforms List
function renderPlatforms() {
  const container = document.getElementById('platforms-list');
  if (!container) return;

  container.innerHTML = PLATFORMS_DATA.map(p => `
    <button
      type="button"
      onclick="handlePlatformClick('${p.id}', '${p.categoryFilter || 'all'}')"
      style="--brand-color: ${p.color}; --brand-glow: ${p.glowColor};"
      class="platform-showcase-card group flex flex-col items-center justify-center text-center px-3 py-5 rounded-2xl bg-gradient-to-b from-white/[0.045] via-[#0c0f19]/90 to-[#07080f]/95 backdrop-blur-xl hover:-translate-y-1.5 hover:bg-white/[0.065] cursor-pointer overflow-hidden"
    >
      <!-- Top Razor Neon Accent Line -->
      <span
        class="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 group-hover:w-3/4 rounded-full opacity-35 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style="background: linear-gradient(90deg, transparent, ${p.color}, transparent);"
      ></span>

      <!-- Floating Brand Emblem with Soft Ambient Aura (Zero Inner Box!) -->
      <div class="relative flex items-center justify-center w-14 h-14">
        <span
          class="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style="background: ${p.color};"
        ></span>
        <img
          src="${p.icon}"
          alt="${p.name}"
          class="relative z-10 w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
          style="filter: drop-shadow(0 4px 12px ${p.glowColor});"
          onerror="this.src='assets/logo/ionara-logo.svg'"
        />
      </div>

      <!-- Clean Brand Typography -->
      <span class="mt-2.5 text-[13px] font-extrabold text-zinc-100 group-hover:text-white tracking-tight font-headline transition-colors truncate max-w-full">
        ${p.name}
      </span>
      <span class="mt-0.5 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors truncate max-w-full">
        ${p.count}
      </span>
    </button>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
}

function handlePlatformClick(platformId, categoryFilter) {
  if (window.location.pathname.includes('catalog.html')) {
    if (typeof filterCategory === 'function') filterCategory(categoryFilter);
  } else {
    window.location.href = 'catalog.html?category=' + categoryFilter + '&search=' + encodeURIComponent(platformId === 'rockstar' ? 'gta' : platformId);
  }
}
window.handlePlatformClick = handlePlatformClick;




// Reviews Section
function renderReviews() {
  const container = document.getElementById('reviews-grid');
  if (!container) return;

  container.innerHTML = REVIEWS_DATA.map(r => `
    <div class="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-md flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img src="${r.avatar}" alt="${r.author}" class="w-10 h-10 rounded-full object-cover border border-pink-500/30">
            <div>
              <div class="text-sm font-bold text-white">${r.author}</div>
              <div class="text-xs text-zinc-400">${r.location} (Tunisie)</div>
            </div>
          </div>
          <div class="flex text-amber-400">
            ${Array(r.rating).fill('<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>').join('')}
          </div>
        </div>
        <p class="text-xs font-semibold text-pink-400 mb-2">Acheté : ${r.product}</p>
        <p class="text-sm text-zinc-300 leading-relaxed italic">"${r.comment}"</p>
      </div>
      <div class="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500 flex justify-between items-center">
        <span>Avis Vérifié ✅</span>
        <span>${r.date}</span>
      </div>
    </div>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

// FAQ Section
function renderFAQ() {
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  container.innerHTML = FAQ_DATA.map((item, index) => `
    <div class="border border-white/5 rounded-2xl bg-slate-900/40 backdrop-blur-md overflow-hidden transition">
      <button 
        onclick="toggleFAQ(${index})"
        class="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-pink-300 transition"
      >
        <span>${item.question}</span>
        <i data-lucide="chevron-down" id="faq-icon-${index}" class="w-5 h-5 text-pink-400 transition-transform duration-300"></i>
      </button>
      <div id="faq-content-${index}" class="hidden px-5 pb-5 text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
        ${item.answer}
      </div>
    </div>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function toggleFAQ(index) {
  const content = document.getElementById(`faq-content-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  if (!content) return;

  const isHidden = content.classList.contains('hidden');
  content.classList.toggle('hidden');
  if (icon) {
    icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  playSound('click');
}

// Cart Functionality
function addToCart(productId, customVariant) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  // Handle gift cards with auto default variant if none provided
  let variant = customVariant;
  if (!variant && product.isGiftCard && product.giftCardConfig) {
    const defReg = product.giftCardConfig.regions.find(r => r.id === product.giftCardConfig.defaultRegion) || product.giftCardConfig.regions[0];
    const defDenom = product.giftCardConfig.denominations.find(d => d.value === product.giftCardConfig.defaultAmount) || product.giftCardConfig.denominations[0];
    variant = {
      amount: defDenom.value,
      amountLabel: defDenom.label,
      regionId: defReg.id,
      regionName: defReg.name,
      regionFlag: defReg.flag,
      priceTND: defDenom.priceTND,
      priceEUR: defDenom.priceEUR || 0,
      priceUSD: defDenom.priceUSD || 0
    };
  }

  const cartKey = variant ? `${productId}_${variant.amount}_${variant.regionId}` : productId;
  const existingIndex = state.cart.findIndex(item => (item.cartKey || item.id) === cartKey);

  const itemTitle = variant 
    ? `${product.title} — ${variant.amountLabel} (${variant.regionName})`
    : product.title;

  const pTND = variant ? variant.priceTND : (product.priceTND || product.priceDZD || 0);
  const pEUR = variant ? variant.priceEUR : (product.priceEUR || 0);
  const pUSD = variant ? variant.priceUSD : (product.priceUSD || 0);

  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += 1;
  } else {
    state.cart.push({
      cartKey: cartKey,
      id: product.id,
      title: itemTitle,
      baseTitle: product.title,
      priceTND: pTND,
      priceEUR: pEUR,
      priceUSD: pUSD,
      image: product.image,
      fallbackImage: product.fallbackImage,
      platform: product.platform,
      quantity: 1,
      variant: variant || null
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`"${itemTitle}" ajouté au panier !`, 'success');
  playSound('add');
}

function updateCartQuantity(cartKey, delta) {
  const item = state.cart.find(i => (i.cartKey || i.id) === cartKey);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(cartKey);
    return;
  }

  saveCart();
  updateCartUI();
  playSound('click');
}

function removeFromCart(cartKey) {
  state.cart = state.cart.filter(item => (item.cartKey || item.id) !== cartKey);
  saveCart();
  updateCartUI();
  playSound('click');
  showToast('Article retiré du panier', 'info');
}

function saveCart() {
  localStorage.setItem('ionara_cart', JSON.stringify(state.cart));
}

function getCartTotals() {
  let subtotal = 0;
  state.cart.forEach(item => {
    let p = item.priceTND || 0;
    if (state.currentCurrency === 'EUR') p = item.priceEUR || 0;
    if (state.currentCurrency === 'USD') p = item.priceUSD || 0;
    subtotal += p * item.quantity;
  });

  const discount = subtotal * (state.promoDiscount / 100);
  const total = subtotal - discount;

  return { subtotal, discount, total };
}

// Updated & Redesigned Cart Drawer UI
function updateCartUI() {
  const badgeCounts = document.querySelectorAll('.cart-count-badge');
  const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  badgeCounts.forEach(b => {
    b.textContent = totalCount;
    b.classList.toggle('hidden', totalCount === 0);
  });

  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountEl = document.getElementById('cart-discount');
  const cartTotalEl = document.getElementById('cart-total');

  if (!cartItemsContainer) return;

  const symbol = getCurrencySymbol();

  // If Empty
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="py-14 text-center px-4 flex flex-col items-center justify-center">
        <div class="w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/10 border border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/10 animate-pulse-glow">
          <i data-lucide="shopping-bag" class="w-9 h-9 text-pink-400"></i>
        </div>
        <h4 class="text-white font-bold text-base">Votre panier est vide</h4>
        <p class="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
          Explorez nos comptes de jeux vidéo vérifiés avec garantie à vie anti-bannissement.
        </p>
        <button 
          onclick="closeCartDrawer(); window.location.href='catalog.html'" 
          class="mt-5 btn-neon-magenta px-5 py-2.5 rounded-xl font-bold text-xs text-white inline-flex items-center gap-2 cursor-pointer shadow-md transition"
        >
          <i data-lucide="gamepad-2" class="w-4 h-4"></i>
          Explorer le Catalogue
        </button>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `0 ${symbol}`;
    if (cartDiscountEl) cartDiscountEl.textContent = `0 ${symbol}`;
    if (cartTotalEl) cartTotalEl.textContent = `0 ${symbol}`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const { subtotal, discount, total } = getCartTotals();

  // Render Cart Items
  cartItemsContainer.innerHTML = state.cart.map(item => {
    let price = item.priceTND || 0;
    if (state.currentCurrency === 'EUR') price = item.priceEUR || 0;
    if (state.currentCurrency === 'USD') price = item.priceUSD || 0;

    return `
      <div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-pink-500/30 transition">
        <img 
          src="${item.image}" 
          alt="${item.title}"
          onerror="this.src='${item.fallbackImage}'"
          class="w-14 h-16 object-cover rounded-xl border border-white/10 shadow-md shrink-0 cursor-pointer"
          onclick="window.location.href='product.html?id=${item.id}'"
        />
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-white truncate cursor-pointer hover:text-pink-300 transition" onclick="window.location.href='product.html?id=${item.id}'">
            ${item.title}
          </h4>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[11px] font-semibold text-pink-400">${item.platform}</span>
            <span class="text-zinc-600">•</span>
            <span class="text-[10px] text-emerald-400">⚡ 5-15 min</span>
          </div>
          <div class="text-sm font-extrabold text-white mt-1">
            ${(price * item.quantity).toLocaleString('fr-FR')} ${symbol}
          </div>
        </div>
        
        <div class="flex flex-col items-end gap-2 shrink-0">
          <button onclick="removeFromCart('${item.cartKey || item.id}')" class="text-zinc-500 hover:text-rose-400 transition p-1" title="Supprimer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
          <div class="flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-xl px-2 py-0.5 text-xs">
            <button onclick="updateCartQuantity('${item.cartKey || item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer font-bold">-</button>
            <span class="font-bold text-white px-1">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.cartKey || item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer font-bold">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (cartSubtotalEl) cartSubtotalEl.textContent = `${Math.round(subtotal).toLocaleString('fr-FR')} ${symbol}`;
  if (cartDiscountEl) cartDiscountEl.textContent = `-${Math.round(discount).toLocaleString('fr-FR')} ${symbol}`;
  if (cartTotalEl) cartTotalEl.textContent = `${Math.round(total).toLocaleString('fr-FR')} ${symbol}`;

  if (window.lucide) lucide.createIcons();
}

// Drawer Controls
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Promo Code
function applyPromoCode() {
  const input = document.getElementById('promo-input');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (code === 'IONARA10' || code === 'GAMER10') {
    state.promoDiscount = 10;
    state.activePromoCode = code;
    updateCartUI();
    showToast(`Code ${code} appliqué : -10% de réduction immédiate !`, 'success');
  } else if (code === 'VIP20') {
    state.promoDiscount = 20;
    state.activePromoCode = code;
    updateCartUI();
    showToast(`Code VIP20 appliqué : -20% de réduction VIP !`, 'success');
  } else {
    showToast('Code promo invalide. Essayez "IONARA10"', 'error');
  }
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  state.quickViewProduct = product;
  const modal = document.getElementById('quickview-modal');
  const body = document.getElementById('quickview-body');
  if (!modal || !body) return;

  const currentPrice = formatPrice(product.priceTND || product.priceDZD, product.priceEUR, product.priceUSD);
  const oldPrice = formatPrice(product.oldPriceTND || product.oldPriceDZD, product.oldPriceEUR, product.oldPriceUSD);

  body.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Image Column -->
      <div class="md:col-span-5 relative group">
        <img 
          src="${product.image}" 
          alt="${product.title}" 
          onerror="this.src='${product.fallbackImage}'"
          class="w-full rounded-2xl object-cover border border-white/10 shadow-2xl"
        />
        <div class="mt-3 flex justify-between items-center text-xs text-zinc-400">
          <span class="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            ${product.stockStatus}
          </span>
          <span>🛡️ ${product.guarantee}</span>
        </div>
      </div>

      <!-- Info Column -->
      <div class="md:col-span-7 space-y-5">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
            ${product.badge}
          </span>
          <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300">
            ${product.platform}
          </span>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-headline">
            ${product.title}
          </h2>
          <p class="text-sm text-zinc-400 mt-1">${product.subtitle}</p>
        </div>

        <!-- Rating & Delivery -->
        <div class="flex items-center gap-4 text-xs text-zinc-300 pb-3 border-b border-white/10">
          <span class="flex items-center gap-1 text-amber-400 font-bold">
            <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
            ${product.rating} / 5.0 (${product.reviewsCount} avis)
          </span>
          <span>•</span>
          <span>⚡ Livraison : <strong>${product.delivery}</strong></span>
        </div>

        <!-- Description -->
        <p class="text-sm text-zinc-300 leading-relaxed">
          ${product.description}
        </p>

        <!-- Features -->
        <div class="space-y-2 py-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Avantages garantis :</h4>
          ${product.features.map(f => `
            <div class="flex items-center gap-2 text-xs text-zinc-200">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>

        <!-- Price & CTA -->
        <div class="pt-4 flex flex-wrap items-center gap-4">
          <div>
            <div class="text-2xl font-extrabold text-white">
              ${currentPrice}
            </div>
            <div class="text-xs text-zinc-500 line-through">
              ${oldPrice}
            </div>
          </div>

          <div class="flex-1 flex gap-3">
            <button 
              onclick="addToCart('${product.id}'); closeQuickView();"
              class="flex-1 btn-neon-magenta py-3 px-6 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              Ajouter au Panier
            </button>
            <a 
              href="product.html?id=${product.id}"
              class="btn-neon-outline py-3 px-5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Fiche Complète →
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
  playSound('click');
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// 1000 Games Catalog Modal
function openGamesListModal() {
  const modal = document.getElementById('games-list-modal');
  const listEl = document.getElementById('games-catalog-list');
  if (!modal || !listEl) return;

  const renderList = (items) => {
    listEl.innerHTML = items.map(g => `
      <div class="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-pink-500/30 flex items-center gap-2.5 text-xs text-zinc-300 transition">
        <span class="text-zinc-500 font-mono text-[10px] w-8">#${g.id}</span>
        <span class="font-medium truncate">${g.title}</span>
      </div>
    `).join('');
  };

  renderList(state.gamesCatalog.slice(0, 150));

  const searchInput = document.getElementById('games-catalog-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = state.gamesCatalog.filter(g => g.title.toLowerCase().includes(q));
      renderList(filtered.slice(0, 150));
    };
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  playSound('click');
}

function closeGamesListModal() {
  const modal = document.getElementById('games-list-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Checkout Flow & WhatsApp Order
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Votre panier est vide !', 'error');
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Quick WhatsApp Order from cart
function orderViaWhatsApp() {
  if (state.cart.length === 0) {
    showToast('Votre panier est vide !', 'error');
    return;
  }

  const { total } = getCartTotals();
  const symbol = getCurrencySymbol();

  let message = `Bonjour IONARA ! 🎮 Je souhaite passer commande :\n\n`;
  state.cart.forEach(item => {
    let p = item.priceTND || 0;
    if (state.currentCurrency === 'EUR') p = item.priceEUR || 0;
    if (state.currentCurrency === 'USD') p = item.priceUSD || 0;
    message += `• ${item.title} (x${item.quantity}) - ${(p * item.quantity).toLocaleString('fr-FR')} ${symbol}\n`;
  });
  message += `\n💰 Total : ${Math.round(total).toLocaleString('fr-FR')} ${symbol}`;
  message += `\n🇹🇳 Moyen de paiement souhaité : D17 / Virement / Konnect / Autre`;
  message += `\n⚡ Merci de me transmettre les coordonnées pour finaliser la livraison en 5 min.`;

  const encoded = encodeURIComponent(message);
  // IONARA official WhatsApp
  const whatsappUrl = `https://wa.me/21627031500?text=${encoded}`;
  window.open(whatsappUrl, '_blank');
}

function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  const email = document.getElementById('order-email').value.trim();
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'D17 (Tunisie)';

  const { total } = getCartTotals();
  const symbol = getCurrencySymbol();

  // Create WhatsApp prefilled message
  let message = `Bonjour IONARA ! 🎮 Nouvelle commande effectuée sur le site :\n\n`;
  state.cart.forEach(item => {
    message += `• ${item.title} (x${item.quantity})\n`;
  });
  message += `\n💰 Total : ${Math.round(total).toLocaleString('fr-FR')} ${symbol}`;
  message += `\n👤 Client : ${name}`;
  message += `\n📱 WhatsApp / Tél : ${phone}`;
  message += `\n📧 Email : ${email}`;
  message += `\n💳 Paiement : ${paymentMethod}`;

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/21627031500?text=${encoded}`;

  // Clear cart and show confirmation
  state.cart = [];
  saveCart();
  updateCartUI();
  closeCheckoutModal();

  showToast('Commande validée ! Redirection vers le support WhatsApp...', 'success');
  window.open(whatsappUrl, '_blank');
}

// Global Search Shortcuts (Ctrl + K) & Event Listeners
function setupEventListeners() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const navInput = document.getElementById('navbar-search-input');
      if (navInput) {
        navInput.focus();
        navInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Filter Pills
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-pink-600', 'text-white', 'border-pink-500');
        b.classList.add('bg-white/5', 'text-zinc-400', 'border-white/10');
      });
      btn.classList.add('bg-pink-600', 'text-white', 'border-pink-500');
      btn.classList.remove('bg-white/5', 'text-zinc-400', 'border-white/10');

      state.activeCategory = btn.dataset.category;
      renderProducts();
      playSound('click');
    });
  });

  // Navbar Search Inputs
  const navSearch = document.getElementById('navbar-search-input');
  const mobileSearch = document.getElementById('mobile-search-input');

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (!document.getElementById('products-grid')) {
        window.location.href = `catalog.html?search=${encodeURIComponent(val)}`;
      }
    }
  };

  const handleGlobalSearch = (val) => {
    state.searchQuery = val.trim();
    if (navSearch && navSearch.value !== val) navSearch.value = val;
    if (mobileSearch && mobileSearch.value !== val) mobileSearch.value = val;
    if (document.getElementById('products-grid')) {
      renderProducts();
    }
  };

  if (navSearch) {
    navSearch.addEventListener('input', (e) => handleGlobalSearch(e.target.value));
    navSearch.addEventListener('keydown', handleSearchKey);
  }
  if (mobileSearch) {
    mobileSearch.addEventListener('input', (e) => handleGlobalSearch(e.target.value));
    mobileSearch.addEventListener('keydown', handleSearchKey);
  }

  // Sound toggle button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('ionara_sound', state.soundEnabled ? 'true' : 'false');
      soundBtn.innerHTML = state.soundEnabled 
        ? '<i data-lucide="volume-2" class="w-4 h-4 text-pink-400"></i>' 
        : '<i data-lucide="volume-x" class="w-4 h-4 text-zinc-500"></i>';
      if (window.lucide) lucide.createIcons();
      showToast(state.soundEnabled ? 'Effets sonores activés 🔊' : 'Effets sonores coupés 🔇', 'info');
    });
  }
}

function resetFilters() {
  state.activeCategory = 'all';
  state.searchQuery = '';
  const searchInput = document.getElementById('navbar-search-input') || document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = '';

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((b, idx) => {
    if (idx === 0) {
      b.classList.add('bg-pink-600', 'text-white', 'border-pink-500');
      b.classList.remove('bg-white/5', 'text-zinc-400', 'border-white/10');
    } else {
      b.classList.remove('bg-pink-600', 'text-white', 'border-pink-500');
      b.classList.add('bg-white/5', 'text-zinc-400', 'border-white/10');
    }
  });

  renderProducts();
}

window.filterCategory = function(cat) {
  if (!document.getElementById('products-grid')) {
    window.location.href = `catalog.html?category=${encodeURIComponent(cat)}`;
    return;
  }

  state.activeCategory = cat;
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((b) => {
    if (b.dataset.category === cat) {
      b.classList.add('bg-pink-600', 'text-white', 'border-pink-500');
      b.classList.remove('bg-white/5', 'text-zinc-400', 'border-white/10');
    } else {
      b.classList.remove('bg-pink-600', 'text-white', 'border-pink-500');
      b.classList.add('bg-white/5', 'text-zinc-400', 'border-white/10');
    }
  });
  renderProducts();
  const catalogElem = document.getElementById('catalog');
  if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
};

// Toast System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' 
    ? 'border-emerald-500/40 bg-slate-900/90 text-emerald-300' 
    : type === 'error'
    ? 'border-red-500/40 bg-slate-900/90 text-red-300'
    : 'border-pink-500/40 bg-slate-900/90 text-zinc-200';

  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';

  toast.className = `toast px-4 py-3 rounded-xl border backdrop-blur-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold ${bgClass}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}


// ==========================================
// AUTHENTICATION & CLIENT ACCOUNT MANAGEMENT
// ==========================================

function initUserAuth() {
  state.user = JSON.parse(localStorage.getItem('ionara_user') || 'null');
  updateUserNavbarUI();
}

function updateUserNavbarUI() {
  const userButtons = document.querySelectorAll('.group\\/user, #navbar-user-btn, [title*="Espace Client"]');
  userButtons.forEach(btn => {
    if (state.user) {
      const name = state.user.name || state.user.username || 'Client';
      const initial = name.charAt(0).toUpperCase();
      btn.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center">
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-sm">
            <div class="w-full h-full rounded-full bg-black flex items-center justify-center font-black text-white text-xs">
              ${initial}
            </div>
          </div>
          <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090b12] animate-pulse"></span>
        </div>
      `;
      btn.title = `Mon Compte (${name})`;
    } else {
      btn.innerHTML = `<i data-lucide="user" class="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover/user:scale-110 transition-transform"></i>`;
      btn.title = "Mon Espace Client";
    }
  });
  if (window.lucide) lucide.createIcons();

  // Pre-fill checkout form if user is logged in
  if (state.user) {
    const nameInput = document.getElementById('order-name');
    const emailInput = document.getElementById('order-email');
    const phoneInput = document.getElementById('order-phone');
    if (nameInput && !nameInput.value) nameInput.value = state.user.name || state.user.username || '';
    if (emailInput && !emailInput.value) emailInput.value = state.user.email || '';
    if (phoneInput && !phoneInput.value && state.user.phone) phoneInput.value = state.user.phone;
  }
}

function openAccountModal(tab = 'login') {
  const modal = document.getElementById('account-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const authView = document.getElementById('account-auth-view');
  const dashView = document.getElementById('account-dashboard-view');

  if (state.user) {
    if (authView) authView.classList.add('hidden');
    if (dashView) {
      dashView.classList.remove('hidden');
      renderAccountDashboard();
    }
  } else {
    if (dashView) dashView.classList.add('hidden');
    if (authView) {
      authView.classList.remove('hidden');
      switchAuthTab(tab);
    }
  }
  if (window.lucide) lucide.createIcons();
}

function closeAccountModal() {
  const modal = document.getElementById('account-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-register-form');
  const tabLogin = document.getElementById('tab-btn-login');
  const tabReg = document.getElementById('tab-btn-register');

  if (tab === 'register') {
    if (loginForm) loginForm.classList.add('hidden');
    if (regForm) regForm.classList.remove('hidden');
    if (tabLogin) {
      tabLogin.classList.remove('bg-pink-600', 'text-white', 'shadow-sm');
      tabLogin.classList.add('text-zinc-400');
    }
    if (tabReg) {
      tabReg.classList.add('bg-pink-600', 'text-white', 'shadow-sm');
      tabReg.classList.remove('text-zinc-400');
    }
  } else {
    if (regForm) regForm.classList.add('hidden');
    if (loginForm) loginForm.classList.remove('hidden');
    if (tabReg) {
      tabReg.classList.remove('bg-pink-600', 'text-white', 'shadow-sm');
      tabReg.classList.add('text-zinc-400');
    }
    if (tabLogin) {
      tabLogin.classList.add('bg-pink-600', 'text-white', 'shadow-sm');
      tabLogin.classList.remove('text-zinc-400');
    }
  }
  if (window.lucide) lucide.createIcons();
}

// Google Sign-In Simulator
function handleGoogleSignIn() {
  const defaultGoogleUser = {
    id: 'google_' + Date.now(),
    name: 'Yassine Achour',
    email: 'achour.yassine@gmail.com',
    phone: '+216 27 031 500',
    provider: 'google',
    coins: 50,
    orders: state.user?.orders || []
  };

  state.user = defaultGoogleUser;
  localStorage.setItem('ionara_user', JSON.stringify(state.user));
  updateUserNavbarUI();
  showToast('🎉 Connecté avec succès via Google ! Bienvenue, ' + state.user.name, 'success');
  openAccountModal();
  playSound('click');
}

function handleLogin(e) {
  e.preventDefault();
  const emailOrUser = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!emailOrUser || !password) {
    showToast('Veuillez remplir tous les champs.', 'error');
    return;
  }

  // Find existing or create session
  const storedUser = JSON.parse(localStorage.getItem('ionara_user') || 'null');
  const user = {
    id: storedUser?.id || 'usr_' + Date.now(),
    name: storedUser?.name || emailOrUser.split('@')[0],
    email: emailOrUser.includes('@') ? emailOrUser : (storedUser?.email || emailOrUser + '@ionara.tn'),
    phone: storedUser?.phone || '+216 27 031 500',
    provider: 'local',
    coins: storedUser?.coins ?? 50,
    orders: storedUser?.orders || []
  };

  state.user = user;
  localStorage.setItem('ionara_user', JSON.stringify(state.user));
  updateUserNavbarUI();
  showToast('🎉 Bon retour parmi nous, ' + state.user.name + ' !', 'success');
  openAccountModal();
  playSound('click');
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (password !== confirm) {
    showToast('Les mots de passe ne correspondent pas.', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Le mot de passe doit comporter au moins 6 caractères.', 'error');
    return;
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: username,
    username: username,
    email: email,
    phone: phone,
    provider: 'local',
    coins: 50, // Welcome gift
    orders: []
  };

  state.user = newUser;
  localStorage.setItem('ionara_user', JSON.stringify(state.user));
  updateUserNavbarUI();
  showToast('🎉 Compte IONARA créé avec succès ! 50 Coins de bienvenue offerts !', 'success');
  openAccountModal();
  playSound('click');
}

function handleLogout() {
  state.user = null;
  localStorage.removeItem('ionara_user');
  updateUserNavbarUI();
  showToast('Vous êtes déconnecté.', 'info');
  closeAccountModal();
  playSound('click');
}

function renderAccountDashboard() {
  const dashView = document.getElementById('account-dashboard-view');
  if (!dashView || !state.user) return;

  const initial = (state.user.name || 'C').charAt(0).toUpperCase();
  const orders = state.user.orders || [];

  dashView.innerHTML = `
    <div class="text-center pb-4 border-b border-white/10">
      <div class="relative w-16 h-16 mx-auto mb-3">
        <div class="w-full h-full rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/30">
          <div class="w-full h-full rounded-2xl bg-black flex items-center justify-center font-black text-2xl text-white">
            ${initial}
          </div>
        </div>
        <span class="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase">
          VIP
        </span>
      </div>
      <h3 class="text-xl font-black text-white font-headline">${state.user.name}</h3>
      <p class="text-xs text-zinc-400">${state.user.email}</p>
      ${state.user.phone ? `<p class="text-[11px] text-pink-300 font-mono mt-0.5">${state.user.phone}</p>` : ''}

      <div class="mt-3 flex items-center justify-center gap-2">
        <span class="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/35 text-xs font-bold flex items-center gap-1.5">
          <span>🪙</span>
          <span>${state.user.coins ?? 50} Coins IONARA</span>
        </span>
        <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          Compte Vérifié
        </span>
      </div>
    </div>

    <!-- Orders Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider font-headline">Mes Commandes Récentes</h4>
        <span class="text-[11px] text-zinc-400">${orders.length} commande(s)</span>
      </div>

      ${orders.length === 0 ? `
        <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-1.5">
          <p class="text-xs text-zinc-300 font-semibold">Aucune commande enregistrée pour le moment.</p>
          <p class="text-[11px] text-zinc-500">Explorez le catalogue et validez votre première commande par D17 ou Flouci !</p>
        </div>
      ` : `
        <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
          ${orders.map(o => `
            <div class="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span class="font-mono font-bold text-pink-400">${o.reference}</span>
                <p class="text-[11px] text-zinc-300 mt-0.5 truncate max-w-[180px]">${o.itemsSummary || 'Jeux IONARA'}</p>
                <span class="text-[10px] text-zinc-500">${o.date}</span>
              </div>
              <div class="text-right">
                <span class="font-black text-white font-headline">${o.total} TND</span>
                <span class="block text-[10px] text-emerald-400 font-semibold">Vérification WhatsApp</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <!-- Action buttons -->
    <div class="space-y-2 pt-2 border-t border-white/10">
      <a 
        href="https://wa.me/21627031500?text=Bonjour%20IONARA%20!%20Je%20suis%20client%20(${encodeURIComponent(state.user.name)})%20et%20j%27ai%20une%20question%20concernant%20mon%20compte." 
        target="_blank"
        class="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
        <span>Contacter mon conseiller WhatsApp 7j/7</span>
      </a>

      <button 
        onclick="handleLogout()" 
        class="w-full py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 border border-white/10 text-zinc-400 text-xs font-semibold transition cursor-pointer"
      >
        Se Déconnecter
      </button>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 100% TUNISIAN CHECKOUT & RECEIPT UPLOAD
// ==========================================

function selectPaymentMethod(methodId) {
  state.selectedPayment = methodId;
  const methods = typeof TUNISIA_PAYMENT_METHODS !== 'undefined' ? TUNISIA_PAYMENT_METHODS : [];
  const found = methods.find(m => m.id === methodId) || methods[0] || {
    id: 'd17',
    name: 'D17 (Poste Tunisienne)',
    accountNumber: '27 031 500',
    accountName: 'IONARA STORE TN',
    instructions: 'Effectuez votre transfert via l application D17 vers notre numero officiel :'
  };

  // Update card visual borders
  const cards = document.querySelectorAll('.payment-method-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.value.toLowerCase().includes(methodId)) {
      card.classList.add('border-pink-500/50', 'bg-pink-500/10');
      card.classList.remove('bg-slate-900', 'border-white/10');
      radio.checked = true;
    } else {
      card.classList.remove('border-pink-500/50', 'bg-pink-500/10');
      card.classList.add('bg-slate-900', 'border-white/10');
    }
  });

  // Calculate current total
  const { total } = getCartTotals();
  const totalTND = Math.round(total);

  // Render instructions box
  const box = document.getElementById('payment-instructions-box');
  if (box) {
    box.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-white/10">
        <span class="text-xs font-bold text-white flex items-center gap-2.5">
          ${found.icon ? `<img src="${found.icon}" alt="${found.name}" class="w-7 h-7 object-contain rounded-lg shrink-0" />` : '<span class="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>'}
          <span>${found.name}</span>
        </span>
        <span class="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300 font-headline">
          Montant : ${totalTND} TND
        </span>
      </div>

      <p class="text-[11px] text-zinc-300 leading-relaxed">${found.instructions}</p>

      <div class="p-2.5 rounded-xl bg-slate-950/90 border border-white/10 flex items-center justify-between">
        <div>
          <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Numéro / Coordonnées officielles</span>
          <span class="text-sm font-black text-amber-300 font-mono tracking-wider">${found.accountNumber}</span>
          <span class="text-[10px] text-zinc-400 block mt-0.5">${found.accountName}</span>
        </div>
        <button 
          type="button" 
          onclick="copyToClipboard('${found.accountNumber}')" 
          class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-pink-600 text-white text-[10px] font-bold transition flex items-center gap-1 shrink-0"
        >
          <i data-lucide="copy" class="w-3 h-3"></i>
          <span>Copier</span>
        </button>
      </div>

      <p class="text-[10px] text-emerald-400 flex items-center gap-1">
        <i data-lucide="info" class="w-3 h-3 shrink-0"></i>
        <span>${found.note}</span>
      </p>
    `;
    if (window.lucide) lucide.createIcons();
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Coordonnées copiées dans le presse-papier !', 'success');
  }).catch(() => {
    showToast('Numéro : ' + text, 'info');
  });
}

function handleReceiptFileChange(input) {
  const file = input.files && input.files[0];
  const promptEl = document.getElementById('receipt-upload-prompt');
  const previewEl = document.getElementById('receipt-file-preview');
  const filenameEl = document.getElementById('receipt-filename');
  const filesizeEl = document.getElementById('receipt-filesize');

  if (file) {
    state.uploadedReceiptName = file.name;
    if (promptEl) promptEl.classList.add('hidden');
    if (previewEl) previewEl.classList.remove('hidden');
    if (filenameEl) filenameEl.textContent = file.name;
    if (filesizeEl) filesizeEl.textContent = '(' + (file.size / 1024).toFixed(0) + ' Ko)';
    showToast('Reçu "' + file.name + '" prêt à être transmis !', 'success');
    if (window.lucide) lucide.createIcons();
  }
}

function clearReceiptFile() {
  const input = document.getElementById('order-receipt-file');
  if (input) input.value = '';
  state.uploadedReceiptName = null;
  const promptEl = document.getElementById('receipt-upload-prompt');
  const previewEl = document.getElementById('receipt-file-preview');
  if (promptEl) promptEl.classList.remove('hidden');
  if (previewEl) previewEl.classList.add('hidden');
}

// Redefine openCheckoutModal to initialize the 5 Tunisian payment methods
const origOpenCheckoutModal = window.openCheckoutModal;
window.openCheckoutModal = function() {
  if (state.cart.length === 0) {
    showToast('Votre panier est vide !', 'error');
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    selectPaymentMethod(state.selectedPayment || 'd17');
    updateUserNavbarUI();
  }
};

// Aliases for compatibility
window.handleCheckoutSubmit = function(e) {
  submitOrder(e);
};

// Override submitOrder with Receipt check & WhatsApp redirection
window.submitOrder = function(e) {
  e.preventDefault();

  const name = document.getElementById('order-name')?.value.trim();
  const phone = document.getElementById('order-phone')?.value.trim();
  const email = document.getElementById('order-email')?.value.trim();
  const refCode = document.getElementById('order-reference-code')?.value.trim();
  const fileInput = document.getElementById('order-receipt-file');
  const hasFile = (fileInput && fileInput.files && fileInput.files.length > 0) || state.uploadedReceiptName;

  if (!name || !phone || !email) {
    showToast('Veuillez renseigner votre nom, téléphone et adresse email.', 'error');
    return;
  }

  // Verify receipt or reference is provided
  if (!hasFile && !refCode) {
    showToast('⚠️ Veuillez téléverser votre reçu ou indiquer la référence de transaction.', 'error');
    const dropzone = document.getElementById('receipt-upload-prompt');
    if (dropzone) {
      dropzone.parentElement.classList.add('border-pink-500', 'animate-pulse');
      setTimeout(() => dropzone.parentElement.classList.remove('border-pink-500', 'animate-pulse'), 2000);
    }
    return;
  }

  const { total } = getCartTotals();
  const totalTND = Math.round(total);

  const methods = typeof TUNISIA_PAYMENT_METHODS !== 'undefined' ? TUNISIA_PAYMENT_METHODS : [];
  const currentMethod = methods.find(m => m.id === state.selectedPayment) || { name: 'D17 (Poste Tunisienne)' };

  const orderRef = '#ION-TN-' + Math.floor(10000 + Math.random() * 90000);
  const receiptMention = hasFile 
    ? `Reçu joint dans la discussion (${state.uploadedReceiptName || 'capture-recu.jpg'})`
    : `Réf. Transaction : ${refCode}`;

  // Build items list
  let itemsText = '';
  let itemsSummary = [];
  state.cart.forEach(item => {
    const variantInfo = item.variant 
      ? ` [Montant : ${item.variant.amountLabel} • Région : ${item.variant.regionFlag || ''} ${item.variant.regionName}]`
      : '';
    itemsText += `• ${item.title}${variantInfo} (x${item.quantity}) - ${item.priceTND * item.quantity} TND\n`;
    itemsSummary.push(item.title);
  });

  // Construct comprehensive WhatsApp message
  let message = `🎮 *COMMANDE IONARA STORE TUNISIE* 🇹🇳\n`;
  message += `📦 *Référence :* ${orderRef}\n\n`;
  message += `👤 *Client :* ${name}\n`;
  message += `📱 *Tél / WhatsApp :* ${phone}\n`;
  message += `📧 *Email :* ${email}\n\n`;
  message += `🛒 *Articles commandés :*\n${itemsText}\n`;
  message += `💰 *Total réglé :* ${totalTND} TND\n`;
  message += `💳 *Mode de paiement :* ${currentMethod.name}\n`;
  message += `📎 *Preuve de paiement :* ${receiptMention}\n\n`;
  message += `⚡ *Bonjour l'équipe IONARA, voici ma commande avec le reçu ci-joint, merci de vérifier et de m'envoyer mes identifiants de jeu garantis !*`;

  // Save order to user profile if logged in
  if (state.user) {
    if (!state.user.orders) state.user.orders = [];
    state.user.orders.unshift({
      reference: orderRef,
      date: new Date().toLocaleDateString('fr-TN'),
      total: totalTND,
      paymentMethod: currentMethod.name,
      itemsSummary: itemsSummary.join(', ')
    });
    localStorage.setItem('ionara_user', JSON.stringify(state.user));
  }

  // Clear cart and UI
  state.cart = [];
  saveCart();
  updateCartUI();
  closeCheckoutModal();

  showToast('✅ Commande validée ! Redirection vers WhatsApp...', 'success');

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/21627031500?text=${encoded}`;
  
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 400);
};

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initUserAuth();
});


// Explicit global exposure for UI callbacks
window.initUserAuth = initUserAuth;
window.updateUserNavbarUI = updateUserNavbarUI;
window.openAccountModal = openAccountModal;
window.closeAccountModal = closeAccountModal;
window.switchAuthTab = switchAuthTab;
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.renderAccountDashboard = renderAccountDashboard;
window.selectPaymentMethod = selectPaymentMethod;
window.copyToClipboard = copyToClipboard;
window.handleReceiptFileChange = handleReceiptFileChange;
window.clearReceiptFile = clearReceiptFile;


// ==========================================
// QUICK GIFTCARD CONFIGURATOR MODAL
// ==========================================
let quickGiftCardProduct = null;
let quickGiftCardSelection = {
  regionId: 'us',
  regionName: 'USA (États-Unis)',
  regionFlag: '🇺🇸',
  amount: 10,
  amountLabel: '10$',
  priceTND: 35,
  priceEUR: 11,
  priceUSD: 10
};

function openQuickGiftCardModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product || !product.giftCardConfig) {
    addToCart(productId);
    return;
  }

  quickGiftCardProduct = product;
  const cfg = product.giftCardConfig;
  const defRegion = cfg.regions.find(r => r.id === cfg.defaultRegion) || cfg.regions[0];
  const defDenom = cfg.denominations.find(d => d.value === cfg.defaultAmount) || cfg.denominations[0];

  quickGiftCardSelection = {
    regionId: defRegion.id,
    regionName: defRegion.name,
    regionFlag: defRegion.flag,
    amount: defDenom.value,
    amountLabel: defDenom.label,
    priceTND: defDenom.priceTND,
    priceEUR: defDenom.priceEUR || 0,
    priceUSD: defDenom.priceUSD || 0
  };

  const modal = document.getElementById('quick-giftcard-modal');
  if (!modal) {
    // If no modal on page, redirect to product page
    window.location.href = 'product.html?id=' + productId;
    return;
  }

  renderQuickGiftCardUI();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeQuickGiftCardModal() {
  const modal = document.getElementById('quick-giftcard-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function renderQuickGiftCardUI() {
  if (!quickGiftCardProduct || !quickGiftCardProduct.giftCardConfig) return;
  const cfg = quickGiftCardProduct.giftCardConfig;

  // Title & Poster
  const titleEl = document.getElementById('qgc-title');
  const imgEl = document.getElementById('qgc-img');
  const priceEl = document.getElementById('qgc-price');
  if (titleEl) titleEl.textContent = quickGiftCardProduct.title;
  if (imgEl) {
    imgEl.src = quickGiftCardProduct.image;
    imgEl.alt = quickGiftCardProduct.title;
  }
  if (priceEl) {
    priceEl.textContent = formatPrice(quickGiftCardSelection.priceTND, quickGiftCardSelection.priceEUR, quickGiftCardSelection.priceUSD);
  }

  // Regions buttons
  const regionsContainer = document.getElementById('qgc-regions-container');
  if (regionsContainer) {
    regionsContainer.innerHTML = cfg.regions.map(r => {
      const isSelected = r.id === quickGiftCardSelection.regionId;
      return `
        <button 
          type="button" 
          onclick="selectQuickRegion('${r.id}')"
          class="p-2 sm:p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
            isSelected 
              ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/20' 
              : 'border-white/10 bg-slate-900/80 hover:border-white/30 text-zinc-300'
          }"
        >
          <span class="text-base sm:text-lg shrink-0">${r.flag}</span>
          <div class="truncate">
            <span class="block text-xs font-bold text-white truncate">${r.name}</span>
            <span class="block text-[10px] text-zinc-400 uppercase">${r.currency}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  // Denominations buttons (clickable presets, user clicks, does not type)
  const denomsContainer = document.getElementById('qgc-denoms-container');
  if (denomsContainer) {
    denomsContainer.innerHTML = cfg.denominations.map(d => {
      const isSelected = d.value === quickGiftCardSelection.amount;
      const formatted = formatPrice(d.priceTND, d.priceEUR, d.priceUSD);
      return `
        <button 
          type="button" 
          onclick="selectQuickAmount(${d.value})"
          class="relative p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer ${
            isSelected 
              ? 'border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/20 scale-[1.02]' 
              : 'border-white/10 bg-slate-900/80 hover:border-pink-500/40 text-zinc-300 hover:scale-[1.01]'
          }"
        >
          ${d.isPopular ? '<span class="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-black uppercase">TOP</span>' : ''}
          <span class="block text-sm sm:text-base font-black text-white font-headline">${d.label}</span>
          <span class="block text-[11px] font-bold text-pink-300 mt-0.5">${formatted}</span>
        </button>
      `;
    }).join('');
  }
}

function selectQuickRegion(regId) {
  if (!quickGiftCardProduct) return;
  const reg = quickGiftCardProduct.giftCardConfig.regions.find(r => r.id === regId);
  if (!reg) return;
  quickGiftCardSelection.regionId = reg.id;
  quickGiftCardSelection.regionName = reg.name;
  quickGiftCardSelection.regionFlag = reg.flag;
  renderQuickGiftCardUI();
  playSound('click');
}

function selectQuickAmount(val) {
  if (!quickGiftCardProduct) return;
  const denom = quickGiftCardProduct.giftCardConfig.denominations.find(d => d.value === val);
  if (!denom) return;
  quickGiftCardSelection.amount = denom.value;
  quickGiftCardSelection.amountLabel = denom.label;
  quickGiftCardSelection.priceTND = denom.priceTND;
  quickGiftCardSelection.priceEUR = denom.priceEUR || 0;
  quickGiftCardSelection.priceUSD = denom.priceUSD || 0;
  renderQuickGiftCardUI();
  playSound('click');
}

function confirmQuickGiftCard(action = 'cart') {
  if (!quickGiftCardProduct) return;
  addToCart(quickGiftCardProduct.id, { ...quickGiftCardSelection });
  closeQuickGiftCardModal();
  if (action === 'checkout') {
    openCheckoutModal();
  }
}

window.openQuickGiftCardModal = openQuickGiftCardModal;
window.closeQuickGiftCardModal = closeQuickGiftCardModal;
window.selectQuickRegion = selectQuickRegion;
window.selectQuickAmount = selectQuickAmount;
window.confirmQuickGiftCard = confirmQuickGiftCard;
