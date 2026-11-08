/**
 * IONARA WEB SHOP - Main Application Logic
 * Gestion des devises, du panier, des filtres, de la recherche et des modals
 */

// Application State
const state = {
  currentCurrency: localStorage.getItem('ionara_currency') || 'DZD',
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

// Sound Effects via Web Audio API (Zero external assets needed)
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

// Currency Formatter
function formatPrice(dzd, eur, usd) {
  if (state.currentCurrency === 'EUR') {
    return `${eur} €`;
  } else if (state.currentCurrency === 'USD') {
    return `$${usd}`;
  } else {
    return `${dzd.toLocaleString('fr-FR')} DA`;
  }
}

function getNumericPrice(product) {
  if (state.currentCurrency === 'EUR') return product.priceEUR;
  if (state.currentCurrency === 'USD') return product.priceUSD;
  return product.priceDZD;
}

function getCurrencySymbol() {
  return CURRENCIES[state.currentCurrency].symbol;
}

// Currency Switcher
function setCurrency(currency) {
  if (!CURRENCIES[currency]) return;
  state.currentCurrency = currency;
  localStorage.setItem('ionara_currency', currency);
  
  // Update select input and UI
  const selects = document.querySelectorAll('.currency-selector');
  selects.forEach(s => s.value = currency);

  renderProducts();
  renderBestsellers();
  renderFeaturedSpotlight();
  updateCartUI();
  if (state.quickViewProduct) {
    openQuickView(state.quickViewProduct.id);
  }

  showToast(`Devise changée : ${CURRENCIES[currency].label}`, 'info');
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
      console.log(`Loaded ${state.gamesCatalog.length} games for instant search.`);
      updateGamesCountBadge();
    }
  } catch (e) {
    console.log('Running without local JSON or in direct file mode.');
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

  spotlightContainer.innerHTML = `
    <div class="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-pink-950/40 p-8 lg:p-12 shadow-2xl backdrop-blur-xl">
      <!-- Ambient Backlight -->
      <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-pink-600/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Poster & Badges -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="relative group cursor-pointer" onclick="openQuickView('${pack.id}')">
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
              Le compte ultime rêvé par tout joueur. Une seule connexion pour débloquer GTA V, Red Dead 2, Elden Ring, Baldur's Gate 3, Cyberpunk 2077, God of War et plus d'un millier d'autres titres légendaires.
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
                  ${formatPrice(pack.priceDZD, pack.priceEUR, pack.priceUSD)}
                </span>
                <span class="text-lg text-zinc-500 line-through">
                  ${formatPrice(pack.oldPriceDZD, pack.oldPriceEUR, pack.oldPriceUSD)}
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
              <button 
                onclick="openQuickView('${pack.id}')"
                class="btn-neon-outline px-6 py-3.5 rounded-xl font-semibold text-zinc-200 text-sm sm:text-base hover:text-white transition cursor-pointer"
              >
                Détails du Compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

// Reusable Product Card HTML Builder
function createProductCardHTML(product) {
  return `
    <div class="game-card group relative flex flex-col rounded-2xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10">
      
      <!-- Poster Image with Badges -->
      <div class="poster-container relative aspect-[4/5] w-full overflow-hidden bg-black/40 cursor-pointer" onclick="openQuickView('${product.id}')">
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
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button 
            onclick="event.stopPropagation(); openQuickView('${product.id}')"
            class="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5"
          >
            <i data-lucide="eye" class="w-4 h-4"></i>
            Aperçu Rapide
          </button>
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

        <h3 class="text-lg font-bold text-white group-hover:text-pink-300 transition line-clamp-1 cursor-pointer" onclick="openQuickView('${product.id}')">
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
              ${formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
            </div>
            <div class="text-xs text-zinc-500 line-through">
              ${formatPrice(product.oldPriceDZD, product.oldPriceEUR, product.oldPriceUSD)}
            </div>
          </div>

          <button 
            onclick="addToCart('${product.id}')"
            class="p-2.5 rounded-xl bg-pink-500/15 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/30 hover:border-pink-500 transition-all duration-200 cursor-pointer shadow-md group/btn"
            title="Ajouter au panier"
          >
            <i data-lucide="shopping-cart" class="w-5 h-5 transition-transform group-hover/btn:scale-110"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Top 4 Bestsellers for Homepage (index.html)
function renderBestsellers() {
  const container = document.getElementById('bestsellers-grid');
  if (!container) return;

  const bestsellers = PRODUCTS_DATA.filter(p => p.isFeatured).slice(0, 4);
  container.innerHTML = bestsellers.map(createProductCardHTML).join('');
  if (window.lucide) lucide.createIcons();
}

// Render Full Products Grid for Dedicated Catalog Page (catalog.html)
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

// Platforms Carousel / List
function renderPlatforms() {
  const container = document.getElementById('platforms-list');
  if (!container) return;

  container.innerHTML = PLATFORMS_DATA.map(p => `
    <div class="flex items-center gap-3.5 px-4 py-3 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm hover:border-pink-500/30 transition group">
      <div class="w-10 h-10 rounded-xl bg-white/5 p-1.5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition">
        <img src="${p.icon}" alt="${p.name}" class="w-full h-full object-contain" onerror="this.src='assets/logo/ionara-logo.svg'">
      </div>
      <div>
        <div class="text-sm font-bold text-white group-hover:text-pink-300 transition">${p.name}</div>
        <div class="text-xs text-zinc-400">${p.count}</div>
      </div>
    </div>
  `).join('');
}

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
              <div class="text-xs text-zinc-400">${r.location}</div>
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
function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = state.cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      priceDZD: product.priceDZD,
      priceEUR: product.priceEUR,
      priceUSD: product.priceUSD,
      image: product.image,
      fallbackImage: product.fallbackImage,
      platform: product.platform,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`"${product.title}" ajouté au panier !`, 'success');
  playSound('add');
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
  playSound('click');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
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
    let p = item.priceDZD;
    if (state.currentCurrency === 'EUR') p = item.priceEUR;
    if (state.currentCurrency === 'USD') p = item.priceUSD;
    subtotal += p * item.quantity;
  });

  const discount = subtotal * (state.promoDiscount / 100);
  const total = subtotal - discount;

  return { subtotal, discount, total };
}

function updateCartUI() {
  // Update header badges
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

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <p class="text-zinc-400 font-medium">Votre panier est vide</p>
        <p class="text-xs text-zinc-500 mt-1">Explorez nos comptes et ajoutez des jeux !</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `0 ${getCurrencySymbol()}`;
    if (cartDiscountEl) cartDiscountEl.textContent = `0 ${getCurrencySymbol()}`;
    if (cartTotalEl) cartTotalEl.textContent = `0 ${getCurrencySymbol()}`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const symbol = getCurrencySymbol();
  const { subtotal, discount, total } = getCartTotals();

  cartItemsContainer.innerHTML = state.cart.map(item => {
    let price = item.priceDZD;
    if (state.currentCurrency === 'EUR') price = item.priceEUR;
    if (state.currentCurrency === 'USD') price = item.priceUSD;

    return `
      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <img 
          src="${item.image}" 
          alt="${item.title}"
          onerror="this.src='${item.fallbackImage}'"
          class="w-14 h-16 object-cover rounded-lg border border-white/10"
        />
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-white truncate">${item.title}</h4>
          <span class="text-xs text-pink-400">${item.platform}</span>
          <div class="text-sm font-semibold text-zinc-200 mt-1">
            ${(price * item.quantity).toLocaleString()} ${symbol}
          </div>
        </div>
        
        <div class="flex flex-col items-end gap-1.5">
          <button onclick="removeFromCart('${item.id}')" class="text-zinc-500 hover:text-red-400 transition p-1">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
          <div class="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-xs">
            <button onclick="updateCartQuantity('${item.id}', -1)" class="text-zinc-400 hover:text-white">-</button>
            <span class="font-bold text-white px-1">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', 1)" class="text-zinc-400 hover:text-white">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (cartSubtotalEl) cartSubtotalEl.textContent = `${Math.round(subtotal).toLocaleString()} ${symbol}`;
  if (cartDiscountEl) cartDiscountEl.textContent = `-${Math.round(discount).toLocaleString()} ${symbol}`;
  if (cartTotalEl) cartTotalEl.textContent = `${Math.round(total).toLocaleString()} ${symbol}`;

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
    showToast(`Code ${code} appliqué : -10% de réduction !`, 'success');
  } else if (code === 'VIP20') {
    state.promoDiscount = 20;
    state.activePromoCode = code;
    updateCartUI();
    showToast(`Code VIP20 appliqué : -20% de réduction !`, 'success');
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
          <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">Ce qui est garanti :</h4>
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
              ${formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
            </div>
            <div class="text-xs text-zinc-500 line-through">
              ${formatPrice(product.oldPriceDZD, product.oldPriceEUR, product.oldPriceUSD)}
            </div>
          </div>

          <button 
            onclick="addToCart('${product.id}'); closeQuickView();"
            class="flex-1 btn-neon-magenta py-3 px-6 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            Ajouter au Panier
          </button>
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

function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  const email = document.getElementById('order-email').value.trim();
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'BaridiMob';

  const { total } = getCartTotals();
  const symbol = getCurrencySymbol();

  // Create WhatsApp prefilled message
  let message = `Bonjour IONARA ! 🎮 Je souhaite commander :\n\n`;
  state.cart.forEach(item => {
    message += `• ${item.title} (x${item.quantity})\n`;
  });
  message += `\n💰 Total : ${Math.round(total).toLocaleString()} ${symbol}`;
  message += `\n👤 Client : ${name}`;
  message += `\n📱 WhatsApp / Tél : ${phone}`;
  message += `\n📧 Email : ${email}`;
  message += `\n💳 Mode de paiement choisi : ${paymentMethod}`;

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/213555000000?text=${encoded}`; // Ready for real phone number

  // Clear cart and show confirmation
  state.cart = [];
  saveCart();
  updateCartUI();
  closeCheckoutModal();

  showToast('Commande envoyée ! Redirection vers WhatsApp...', 'success');
  window.open(whatsappUrl, '_blank');
}

// Global Search Shortcuts (Ctrl + K)
function setupEventListeners() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('main-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // Navbar & Global Search Inputs
  const navSearch = document.getElementById('navbar-search-input');
  const mobileSearch = document.getElementById('mobile-search-input');
  const mainSearch = document.getElementById('main-search-input');

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (!document.getElementById('products-grid')) {
        // On homepage, redirect to dedicated catalog page with search parameter!
        window.location.href = `catalog.html?search=${encodeURIComponent(val)}`;
      }
    }
  };

  const handleGlobalSearch = (val) => {
    state.searchQuery = val.trim();
    if (navSearch && navSearch.value !== val) navSearch.value = val;
    if (mobileSearch && mobileSearch.value !== val) mobileSearch.value = val;
    if (mainSearch && mainSearch.value !== val) mainSearch.value = val;
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
  if (mainSearch) {
    mainSearch.addEventListener('input', (e) => handleGlobalSearch(e.target.value));
    mainSearch.addEventListener('keydown', handleSearchKey);
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
  const searchInput = document.getElementById('main-search-input') || document.getElementById('catalog-search-input');
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
  // If we are on index.html (no products-grid), redirect to catalog.html with parameter
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
