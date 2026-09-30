import './events.ts';
import { escapeHtml, safeUrl } from './utils/escape.ts';
import { convertToWebP, formatBytes, type OptimizedImageResult } from './utils/imageOptimizer';
import type { Product, ProductColor, StockStatus } from './types';

interface ExtendedProduct extends Product {
  discountPrice?: string;
  isVisible?: boolean;
  category?: string;
  sortOrder?: number;
  isDeleted?: boolean;
  deletedAt?: string;
  nameEs?: string;
  badgeEs?: string;
  descriptionEs?: string;
  connector?: string;
  connectorEs?: string;
  compatibility?: string[];
  secondaryImage?: string;
}

// Global State
let allProducts: ExtendedProduct[] = [];
let currentFilter = 'all';
let currentSearch = '';
let currentCategory: 'radio' | 'accessory' = 'radio';
let currentAccCategory = 'all';
let editingProduct: ExtendedProduct | null = null;
let adminToken: string | null = sessionStorage.getItem('gtech_admin_token');

// DOM Elements
const authOverlay = document.getElementById('auth-overlay') as HTMLDivElement;
const authForm = document.getElementById('auth-form') as HTMLFormElement;
const adminPassInput = document.getElementById('admin-pass') as HTMLInputElement;
const authError = document.getElementById('auth-error') as HTMLDivElement;
const adminApp = document.getElementById('admin-app') as HTMLDivElement;
const productsContainer = document.getElementById('products-container') as HTMLDivElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterPills = document.querySelectorAll('.filter-pill');
const accCategoryFilters = document.getElementById('accessory-category-filters') as HTMLDivElement | null;
const accCatPills = document.querySelectorAll('.acc-cat-pill');
const productModal = document.getElementById('product-modal') as HTMLDivElement;
const productForm = document.getElementById('product-form') as HTMLFormElement;
const btnCloseModal = document.getElementById('btn-close-modal') as HTMLButtonElement;
const btnCancelModal = document.getElementById('btn-cancel-modal') as HTMLButtonElement;
const btnSaveProduct = document.getElementById('btn-save-product') as HTMLButtonElement;
const btnDeleteProduct = document.getElementById('btn-delete-product') as HTMLButtonElement;
const btnNewProduct = document.getElementById('btn-new-product') as HTMLButtonElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
const downloadBackupBtn = document.getElementById('download-backup-btn') as HTMLButtonElement;
const togglePassBtn = document.getElementById('toggle-pass-visibility') as HTMLButtonElement;

// Image uploader DOM
const dropzoneArea = document.getElementById('dropzone-area') as HTMLDivElement;
const imageFileInput = document.getElementById('image-file-input') as HTMLInputElement;
const imagePreview = document.getElementById('image-preview') as HTMLImageElement;
const optimizationStats = document.getElementById('optimization-stats') as HTMLSpanElement;
const pImageInput = document.getElementById('p-image') as HTMLInputElement;

// Dynamic spec & color containers
const specsList = document.getElementById('specs-list') as HTMLDivElement;
const btnAddSpec = document.getElementById('btn-add-spec') as HTMLButtonElement;
const colorsList = document.getElementById('colors-list') as HTMLDivElement;
const btnAddColor = document.getElementById('btn-add-color') as HTMLButtonElement;

// Toast helper
function showToast(message: string, isError = false) {
  const toast = document.getElementById('toast') as HTMLDivElement;
  const toastMsg = document.getElementById('toast-message') as HTMLSpanElement;
  const toastIcon = document.getElementById('toast-icon') as HTMLSpanElement;

  toastMsg.textContent = message;
  toastIcon.textContent = isError ? '⚠️' : '✓';
  toast.className = `fixed bottom-6 right-6 z-50 transition-all duration-300 ${
    isError ? 'bg-rose-950 border-rose-800 text-rose-200' : 'bg-slate-900 border-slate-700 text-emerald-400'
  } border px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md transform translate-y-0 opacity-100`;

  setTimeout(() => {
    toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none';
  }, 4000);
}

// -------------------------------------------------------------
// 1. AUTHENTICATION FLOW
// -------------------------------------------------------------

function handle401(res: Response) {
  if (res.status === 401) {
    sessionStorage.removeItem('gtech_admin_token');
    adminToken = null;
    adminApp.classList.add('hidden');
    authOverlay.classList.remove('hidden');
    return true;
  }
  return false;
}

async function handleLogin(password: string) {
  try {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.ok) {
      adminToken = data.token;
      sessionStorage.setItem('gtech_admin_token', adminToken!);
      authOverlay.classList.add('hidden');
      adminApp.classList.remove('hidden');
      loadProducts();
      loadSettings();
    } else {
      authError.textContent = data.error || 'Clave maestra incorrecta';
      authError.classList.remove('hidden');
    }
  } catch (err) {
    authError.textContent = 'Error al comunicarse con el servidor de autenticación';
    authError.classList.remove('hidden');
  }
}

async function loadSettings() {
  if (!adminToken) return;
  try {
    const res = await fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.ok) {
      const settings = await res.json();
      const showPrices = settings.show_prices === 'true';
      updatePriceToggle(showPrices);
    }
  } catch (err) {
    console.warn('Could not load settings:', err);
  }
}

function updatePriceToggle(showPrices: boolean) {
  const toggleBtn = document.getElementById('toggle-price-display') as HTMLButtonElement;
  const slider = document.getElementById('toggle-price-slider') as HTMLSpanElement;
  const label = document.getElementById('toggle-price-label') as HTMLSpanElement;
  if (!toggleBtn || !slider || !label) return;
  
  if (showPrices) {
    toggleBtn.classList.remove('bg-slate-700');
    toggleBtn.classList.add('bg-emerald-600');
    slider.classList.remove('translate-x-1');
    slider.classList.add('translate-x-6');
    label.textContent = 'ON';
    label.classList.remove('text-slate-400');
    label.classList.add('text-emerald-400');
  } else {
    toggleBtn.classList.remove('bg-emerald-600');
    toggleBtn.classList.add('bg-slate-700');
    slider.classList.remove('translate-x-6');
    slider.classList.add('translate-x-1');
    label.textContent = 'OFF';
    label.classList.remove('text-emerald-400');
    label.classList.add('text-slate-400');
  }
}

authForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  authError.classList.add('hidden');
  const pass = adminPassInput.value.trim();
  if (pass) handleLogin(pass);
});

togglePassBtn?.addEventListener('click', () => {
  if (adminPassInput.type === 'password') {
    adminPassInput.type = 'text';
    togglePassBtn.textContent = 'Ocultar';
  } else {
    adminPassInput.type = 'password';
    togglePassBtn.textContent = 'Ver';
  }
});

logoutBtn?.addEventListener('click', () => {
  sessionStorage.removeItem('gtech_admin_token');
  adminToken = null;
  adminApp.classList.add('hidden');
  authOverlay.classList.remove('hidden');
  adminPassInput.value = '';
});

document.getElementById('toggle-price-display')?.addEventListener('click', async () => {
  if (!adminToken) return;
  
  const toggleBtn = document.getElementById('toggle-price-display') as HTMLButtonElement;
  
  const isCurrentlyOn = toggleBtn.classList.contains('bg-emerald-600');
  const newValue = !isCurrentlyOn;
  
  try {
    toggleBtn.disabled = true;
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ key: 'show_prices', value: String(newValue) }),
    });
    
    if (res.ok) {
      updatePriceToggle(newValue);
      showToast(`Precios en tienda pública: ${newValue ? 'ACTIVADOS' : 'DESACTIVADOS'}`);
    } else {
      showToast('Error al actualizar configuración', true);
    }
  } catch (err) {
    showToast('Error de conexión', true);
  } finally {
    toggleBtn.disabled = false;
  }
});

// -------------------------------------------------------------
// 2. DATA FETCHING (TURSO API)
// -------------------------------------------------------------
async function updateTabBadges() {
  if (!adminToken) return;
  try {
    const [radiosRes, accRes, quotesRes] = await Promise.all([
      fetch('/api/admin/products?category=radio', { headers: { Authorization: `Bearer ${adminToken}` } }),
      fetch('/api/admin/accessories', { headers: { Authorization: `Bearer ${adminToken}` } }),
      fetch('/api/admin/quotes', { headers: { Authorization: `Bearer ${adminToken}` } }),
    ]);

    if (radiosRes.ok) {
      const radios = await radiosRes.json();
      const count = radios.filter((r: any) => !r.isDeleted).length;
      const b = document.getElementById('radios-count-badge');
      if (b) b.textContent = String(count);
    }
    if (accRes.ok) {
      const accessories = await accRes.json();
      const count = accessories.filter((a: any) => !a.isDeleted).length;
      const b = document.getElementById('accessories-count-badge');
      if (b) b.textContent = String(count);
    }
    if (quotesRes.ok) {
      const quotes = await quotesRes.json();
      const pendingCount = quotes.filter((q: any) => q.status === 'pending').length;
      const b = document.getElementById('quotes-count-badge');
      if (b) b.textContent = String(pendingCount);
    }
  } catch (err) {
    console.warn('Could not update tab counts:', err);
  }
}

async function loadProducts() {
  if (!adminToken) return;

  const isAccessory = currentCategory === 'accessory';
  productsContainer.innerHTML = `
    <div class="col-span-full py-16 text-center text-slate-500">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-crimson-600 border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm font-semibold">Cargando ${isAccessory ? 'catálogo de accesorios' : 'flota de radios'} desde Turso DB...</p>
    </div>
  `;

  try {
    const endpoint = isAccessory ? '/api/admin/accessories' : '/api/admin/products?category=radio';
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (handle401(res)) return;

    if (handle401(res)) return;
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    allProducts = await res.json();
    updateCounts();
    renderProducts();
    updateTabBadges();
  } catch (err: any) {
    console.error('Error fetching data:', err);
    productsContainer.innerHTML = `
      <div class="col-span-full py-12 text-center text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6">
        <p class="font-bold text-sm">Error al cargar datos de Turso DB</p>
        <p class="text-xs text-slate-400 mt-1">${err.message}</p>
        <button data-action="reload" class="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">Reintentar</button>
      </div>
    `;
  }
}

function updateCounts() {
  const countAll = document.getElementById('count-all');
  const countVisible = document.getElementById('count-visible');
  const countHidden = document.getElementById('count-hidden');
  const countLow = document.getElementById('count-low');
  const countTrash = document.getElementById('count-trash');

  const visible = allProducts.filter((p) => p.isVisible !== false && !p.isDeleted).length;
  const hidden = allProducts.filter((p) => p.isVisible === false && !p.isDeleted).length;
  const low = allProducts.filter((p) => (p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock' || p.inStock === false) && !p.isDeleted).length;
  const trash = allProducts.filter((p) => p.isDeleted === true).length;

  if (countAll) countAll.textContent = String(allProducts.filter(p => !p.isDeleted).length);
  if (countVisible) countVisible.textContent = String(visible);
  if (countHidden) countHidden.textContent = String(hidden);
  if (countLow) countLow.textContent = String(low);
  if (countTrash) countTrash.textContent = String(trash);

  // Update accessory category counts
  const mic = allProducts.filter((p) => p.category === 'microphones' && !p.isDeleted).length;
  const ear = allProducts.filter((p) => p.category === 'earphones' && !p.isDeleted).length;
  const charg = allProducts.filter((p) => p.category === 'chargers' && !p.isDeleted).length;
  const countMic = document.getElementById('count-cat-mic');
  const countEar = document.getElementById('count-cat-ear');
  const countCharg = document.getElementById('count-cat-charg');
  if (countMic) countMic.textContent = String(mic);
  if (countEar) countEar.textContent = String(ear);
  if (countCharg) countCharg.textContent = String(charg);
}

// -------------------------------------------------------------
// 3. PRODUCT RENDERING
// -------------------------------------------------------------
function renderProducts() {
  const isAccessory = currentCategory === 'accessory';

  let filtered = allProducts.filter((p) => {
    // Status filter
    if (currentFilter === 'visible' && (p.isVisible === false || p.isDeleted === true)) return false;
    if (currentFilter === 'hidden' && (p.isVisible !== false || p.isDeleted === true)) return false;
    if (currentFilter === 'low_stock' && (p.stockStatus !== 'low_stock' && p.stockStatus !== 'out_of_stock' && p.inStock !== false || p.isDeleted === true)) return false;
    if (currentFilter === 'trash' && p.isDeleted !== true) return false;
    if (currentFilter === 'all' && p.isDeleted === true) return false;

    // Accessory category sub-filter
    if (isAccessory && currentAccCategory !== 'all' && p.category !== currentAccCategory) {
      return false;
    }

    // Search term
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchNameEs = (p.nameEs || '').toLowerCase().includes(q);
      const matchId = (p.id || '').toLowerCase().includes(q);
      const matchBadge = (p.badge || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchConnector = (p.connector || '').toLowerCase().includes(q);
      return matchName || matchNameEs || matchId || matchBadge || matchDesc || matchConnector;
    }

    return true;
  });

  if (filtered.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <svg class="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-sm font-bold text-slate-400">No se encontraron ${isAccessory ? 'accesorios' : 'productos'} con los filtros aplicados</p>
        <p class="text-xs text-slate-500 mt-1">Prueba con otro término o limpia la búsqueda.</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = filtered
    .map((p) => {
      const isVis = p.isVisible !== false;
      const isDiscount = Boolean(p.discountPrice);

      let stockPill = '';
      if (p.stockStatus === 'out_of_stock' || p.inStock === false) {
        stockPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-950 text-rose-300 border border-rose-800">Agotado</span>';
      } else if (p.stockStatus === 'low_stock') {
        stockPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-800">Bajo Stock</span>';
      } else {
        stockPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">Disponible</span>';
      }

      let categoryBadge = '';
      if (isAccessory && p.category) {
        const catMap: Record<string, string> = {
          microphones: '🎙️ Micrófono PTT',
          earphones: '🎧 Auricular Acústico',
          chargers: '⚡ Cargador / Base',
          cases: '🛡️ Funda de Silicona',
        };
        const catName = catMap[p.category] || p.category;
        categoryBadge = `
          <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/90 border border-cyan-800/60 px-2 py-0.5 rounded-md">
            ${catName}
          </span>
        `;
      }

      const connectorHtml = p.connector ? `
        <div class="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-2 py-0.5 rounded-md mt-1">
          <svg class="w-3 h-3 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span class="truncate">${escapeHtml(p.connector)}</span>
        </div>
      ` : '';

      const compatHtml = (p.compatibility && p.compatibility.length > 0) ? `
        <div class="text-[10px] text-slate-400 mt-1 truncate" title="Compatible con: ${p.compatibility.join(', ')}">
          <span class="text-slate-500 font-bold uppercase">Compat:</span> ${p.compatibility.join(', ')}
        </div>
      ` : '';

      return `
        <div class="bg-slate-900 border ${
          isVis ? 'border-slate-800' : 'border-dashed border-slate-800 opacity-60'
        } hover:border-slate-700 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all group relative">
          
          <!-- Top Row: Thumbnail + Badges -->
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden flex-shrink-0">
                <img src="${safeUrl(p.image)}" alt="${escapeHtml(p.name)}" class="w-full h-full object-contain group-hover:scale-105 transition-transform"  />
                <span class="absolute top-1 left-1 text-[8px] font-bold px-1 rounded bg-black/60 text-slate-300 uppercase">WebP</span>
              </div>

              <div class="flex-1 text-right space-y-1.5">
                <div class="flex items-center justify-end gap-1.5">
                  ${stockPill}
                </div>

                <!-- Instant Visibility Toggle -->
                <button 
                  type="button"
                  data-action="toggle-visibility"
                  data-id="${escapeHtml(p.id)}"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                    isVis
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-900'
                  }"
                  title="${isVis ? 'Clic para ocultar del catálogo público' : 'Clic para mostrar en el catálogo'}">
                  <span class="w-1.5 h-1.5 rounded-full ${isVis ? 'bg-emerald-400' : 'bg-slate-500'}"></span>
                  <span>${isVis ? 'Visible' : 'Oculto'}</span>
                </button>
              </div>
            </div>

            <!-- Title & Badge -->
            <div class="space-y-1 mb-3">
              <span class="text-[10px] font-mono text-cyan-400 tracking-wider block">${escapeHtml(p.id)}</span>
              <h3 class="text-sm font-extrabold text-white leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">
                ${escapeHtml(p.name)}
              </h3>
              ${p.nameEs && p.nameEs !== p.name ? `<p class="text-xs text-slate-400 line-clamp-1 italic">${p.nameEs}</p>` : ''}
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                ${categoryBadge}
                <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md">
                  ${escapeHtml(p.badge)}
                </span>
                ${connectorHtml}
              </div>
              ${compatHtml}
            </div>

            <!-- Price and Discount Tag -->
            <div class="pt-2 border-t border-slate-800/80 flex items-baseline justify-between mb-4">
              <div>
                ${
                  isDiscount
                    ? `
                  <div class="flex items-baseline gap-2">
                    <span class="text-base font-extrabold text-emerald-400">${p.discountPrice}</span>
                    <span class="text-xs text-slate-500 line-through">${p.priceEstimate || ''}</span>
                    <span class="text-[9px] font-bold uppercase bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Oferta</span>
                  </div>
                `
                    : `
                  <span class="text-sm font-bold text-white">${p.priceEstimate || 'Cotizar vía WhatsApp'}</span>
                `
                }
              </div>
              ${
                p.stockCount !== undefined
                  ? `<span class="text-[11px] font-mono text-slate-400">${p.stockCount} uds</span>`
                  : ''
              }
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            ${p.isDeleted === true ? `
              <button 
                type="button" 
                data-action="restore" 
                data-id="${escapeHtml(p.id)}"
                class="flex-1 bg-emerald-900/60 hover:bg-emerald-800 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span>Restaurar</span>
              </button>
              <button 
                type="button" 
                data-action="permanent-delete" 
                data-id="${escapeHtml(p.id)}"
                data-name="${escapeHtml(p.name)}"
                class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Eliminar permanentemente">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            ` : `
              <button 
                type="button" 
                data-action="edit" 
                data-id="${escapeHtml(p.id)}"
                class="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Editar ${isAccessory ? 'Accesorio' : 'Ficha'}</span>
              </button>

              <button 
                type="button" 
                data-action="delete" 
                data-id="${escapeHtml(p.id)}"
                data-name="${escapeHtml(p.name)}"
                class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Mover a la papelera">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            `}
          </div>

        </div>
      `;
    })
    .join('');
}

// -------------------------------------------------------------
// 4. ACTION DISPATCHER (CLICKS ON CARDS)
// -------------------------------------------------------------
productsContainer?.addEventListener('click', async (e) => {
  const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!id) return;

  const isAccessory = currentCategory === 'accessory';

  if (action === 'toggle-visibility') {
    const product = allProducts.find((p) => p.id === id);
    if (!product) return;
    const nextVis = !(product.isVisible !== false);

    try {
      target.textContent = 'Actualizando...';
      const endpoint = isAccessory ? '/api/admin/accessories' : '/api/admin/products';
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id, isVisible: nextVis }),
      });

      if (res.ok) {
        product.isVisible = nextVis;
        updateCounts();
        renderProducts();
        showToast(`${isAccessory ? 'Accesorio' : 'Radio'} ${product.name} marcado como ${nextVis ? 'Visible' : 'Oculto'}`);
      } else {
        showToast('Error al actualizar visibilidad', true);
      }
    } catch (err) {
      showToast('Error de conexión', true);
    }
  }

  if (action === 'edit') {
    const product = allProducts.find((p) => p.id === id);
    if (product) openProductModal(product, currentCategory);
  }

  if (action === 'delete') {
    const name = target.dataset.name || id;
    if (confirm(`¿Estás seguro de mover el ${isAccessory ? 'accesorio' : 'radio'} "${name}" (${id}) a la papelera?`)) {
      try {
        const endpoint = isAccessory
          ? `/api/admin/accessories?id=${encodeURIComponent(id)}`
          : `/api/admin/products?id=${encodeURIComponent(id)}`;

        const res = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (res.ok) {
          const product = allProducts.find((p) => p.id === id);
          if (product) product.isDeleted = true;
          updateCounts();
          renderProducts();
          updateTabBadges();
          showToast(`${isAccessory ? 'Accesorio' : 'Radio'} "${name}" movido a la papelera`);
        } else {
          showToast('No se pudo mover a la papelera', true);
        }
      } catch (err) {
        showToast('Error de conexión al eliminar', true);
      }
    }
  }

  if (action === 'restore') {
    const product = allProducts.find((p) => p.id === id);
    const name = product?.name || id;
    if (confirm(`¿Restaurar el ${isAccessory ? 'accesorio' : 'radio'} "${name}" (${id}) desde la papelera?`)) {
      try {
        const res = await fetch('/api/admin/restore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ id, type: currentCategory }),
        });

        if (res.ok) {
          const product = allProducts.find((p) => p.id === id);
          if (product) product.isDeleted = false;
          updateCounts();
          renderProducts();
          updateTabBadges();
          showToast(`${isAccessory ? 'Accesorio' : 'Radio'} "${name}" restaurado exitosamente`);
        } else {
          showToast('No se pudo restaurar el elemento', true);
        }
      } catch (err) {
        showToast('Error de conexión al restaurar', true);
      }
    }
  }

  if (action === 'permanent-delete') {
    const name = target.dataset.name || id;
    if (confirm(`¿ELIMINAR DEFINITIVAMENTE el ${isAccessory ? 'accesorio' : 'radio'} "${name}" (${id})? Esta acción NO se puede deshacer.`)) {
      try {
        const endpoint = isAccessory
          ? `/api/admin/accessories?id=${encodeURIComponent(id)}&permanent=true`
          : `/api/admin/products?id=${encodeURIComponent(id)}&permanent=true`;

        const res = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (res.ok) {
          allProducts = allProducts.filter((p) => p.id !== id);
          updateCounts();
          renderProducts();
          updateTabBadges();
          showToast(`${isAccessory ? 'Accesorio' : 'Radio'} "${name}" eliminado permanentemente`);
        } else {
          showToast('No se pudo eliminar el elemento', true);
        }
      } catch (err) {
        showToast('Error de conexión al eliminar', true);
      }
    }
  }
});

// -------------------------------------------------------------
// 5. SEARCH & FILTER LISTENERS
// -------------------------------------------------------------
searchInput?.addEventListener('input', (e) => {
  currentSearch = (e.target as HTMLInputElement).value.trim();
  renderProducts();
});

filterPills.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterPills.forEach((b) => {
      b.classList.remove('bg-slate-800', 'text-white');
      b.classList.add('bg-slate-950', 'text-slate-400');
    });
    btn.classList.add('bg-slate-800', 'text-white');
    btn.classList.remove('bg-slate-950', 'text-slate-400');

    currentFilter = (btn as HTMLElement).dataset.filter || 'all';
    renderProducts();
  });
});

accCatPills.forEach((btn) => {
  btn.addEventListener('click', () => {
    accCatPills.forEach((b) => {
      b.classList.remove('bg-cyan-900/60', 'text-cyan-300', 'border-cyan-700/60');
      b.classList.add('bg-slate-950', 'text-slate-400');
    });
    btn.classList.add('bg-cyan-900/60', 'text-cyan-300', 'border-cyan-700/60');
    btn.classList.remove('bg-slate-950', 'text-slate-400');

    currentAccCategory = (btn as HTMLElement).dataset.accCat || 'all';
    renderProducts();
  });
});

// -------------------------------------------------------------
// 6. AUTO-WEBP IMAGE PIPELINE SCRIPT
// -------------------------------------------------------------
async function handleFileProcess(file: File) {
  optimizationStats.textContent = 'Procesando y convirtiendo a WebP...';
  optimizationStats.className = 'text-[10px] font-mono text-amber-400 text-center animate-pulse';

  try {
    const result: OptimizedImageResult = await convertToWebP(file, 0.85);

    // Update preview & image data
    imagePreview.src = result.dataUrl;
    pImageInput.value = result.dataUrl; // Store as data URL or optimized WebP

    optimizationStats.textContent = `✓ WebP: ${formatBytes(result.originalSize)} → ${formatBytes(result.optimizedSize)} (-${result.savedPercent}%)`;
    optimizationStats.className = 'text-[10px] font-mono text-emerald-400 text-center font-bold';

    showToast(`Imagen convertida a WebP (-${result.savedPercent}% de espacio)`);
  } catch (err: any) {
    console.error('WebP conversion failed:', err);
    optimizationStats.textContent = 'Error al convertir imagen';
    optimizationStats.className = 'text-[10px] font-mono text-rose-400 text-center';
    showToast('Error al optimizar imagen', true);
  }
}

dropzoneArea?.addEventListener('click', () => imageFileInput?.click());

dropzoneArea?.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzoneArea.classList.add('border-crimson-500', 'bg-slate-900');
});

dropzoneArea?.addEventListener('dragleave', () => {
  dropzoneArea.classList.remove('border-crimson-500', 'bg-slate-900');
});

dropzoneArea?.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzoneArea.classList.remove('border-crimson-500', 'bg-slate-900');
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFileProcess(file);
  }
});

imageFileInput?.addEventListener('change', () => {
  const file = imageFileInput.files?.[0];
  if (file) handleFileProcess(file);
});

pImageInput?.addEventListener('input', () => {
  if (pImageInput.value) {
    imagePreview.src = pImageInput.value;
    optimizationStats.textContent = 'URL personalizada';
    optimizationStats.className = 'text-[10px] font-mono text-slate-400 text-center';
  }
});

// -------------------------------------------------------------
// 7. MODAL DRAWER & TABS CONTROLLER
// -------------------------------------------------------------
function openProductModal(product: ExtendedProduct | null = null, category: 'radio' | 'accessory' = currentCategory) {
  editingProduct = product;
  const isEdit = Boolean(product);
  const isAccessory = category === 'accessory';

  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalError = document.getElementById('modal-error');
  if (modalError) modalError.classList.add('hidden');

  // Toggle tab buttons in modal
  const tabDossier = document.getElementById('editor-tab-dossier');
  const tabSpecs = document.getElementById('editor-tab-specs');
  const tabColors = document.getElementById('editor-tab-colors');
  const tabTags = document.getElementById('editor-tab-tags');

  if (tabDossier) tabDossier.classList.toggle('hidden', isAccessory);
  if (tabColors) tabColors.classList.toggle('hidden', isAccessory);
  if (tabTags) tabTags.classList.toggle('hidden', isAccessory);
  if (tabSpecs) tabSpecs.textContent = isAccessory ? '2. Especificaciones' : '3. Especificaciones';

  // Toggle field sections in Tab 1
  const fieldShortName = document.getElementById('field-shortName');
  const fieldStockCount = document.getElementById('field-stockCount');
  const fieldDiscountPrice = document.getElementById('field-discountPrice');
  const fieldNameEs = document.getElementById('field-nameEs');
  const fieldBadgeEs = document.getElementById('field-badgeEs');
  const fieldAccCategory = document.getElementById('field-accCategory');
  const accHardwareFields = document.getElementById('accessory-hardware-fields');
  const fieldDescriptionEs = document.getElementById('field-descriptionEs');
  const fieldSecondaryImage = document.getElementById('field-secondaryImage');

  if (fieldShortName) fieldShortName.classList.toggle('hidden', isAccessory);
  if (fieldStockCount) fieldStockCount.classList.toggle('hidden', isAccessory);
  if (fieldDiscountPrice) fieldDiscountPrice.classList.toggle('hidden', isAccessory);
  if (fieldNameEs) fieldNameEs.classList.toggle('hidden', !isAccessory);
  if (fieldBadgeEs) fieldBadgeEs.classList.toggle('hidden', !isAccessory);
  if (fieldAccCategory) fieldAccCategory.classList.toggle('hidden', !isAccessory);
  if (accHardwareFields) accHardwareFields.classList.toggle('hidden', !isAccessory);
  if (fieldDescriptionEs) fieldDescriptionEs.classList.toggle('hidden', !isAccessory);
  if (fieldSecondaryImage) fieldSecondaryImage.classList.toggle('hidden', !isAccessory);

  if (isEdit && product) {
    if (modalTitle) modalTitle.textContent = isAccessory ? `Editar Accesorio: ${product.name}` : `Editar Radio: ${product.name}`;
    if (modalSubtitle) modalSubtitle.textContent = `Modificando ID: ${product.id}`;
    btnDeleteProduct.classList.remove('hidden');

    if (product.isDeleted) {
      btnDeleteProduct.textContent = 'Restaurar de Papelera';
      btnDeleteProduct.className = 'px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors border border-emerald-800/60';
    } else {
      btnDeleteProduct.textContent = 'Mover a Papelera';
      btnDeleteProduct.className = 'px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-900/60 transition-colors border border-rose-900/60';
    }

    // Tab 1: General
    (document.getElementById('p-id') as HTMLInputElement).value = product.id;
    (document.getElementById('p-id') as HTMLInputElement).disabled = true;
    (document.getElementById('p-name') as HTMLInputElement).value = product.name;
    (document.getElementById('p-shortName') as HTMLInputElement).value = product.shortName || '';
    (document.getElementById('p-badge') as HTMLInputElement).value = product.badge;
    (document.getElementById('p-stockStatus') as HTMLSelectElement).value = product.stockStatus || (product.inStock ? 'in_stock' : 'out_of_stock');
    (document.getElementById('p-stockCount') as HTMLInputElement).value = product.stockCount !== undefined ? String(product.stockCount) : '';
    (document.getElementById('p-priceEstimate') as HTMLInputElement).value = product.priceEstimate || '';
    (document.getElementById('p-discountPrice') as HTMLInputElement).value = product.discountPrice || '';
    (document.getElementById('p-isVisible') as HTMLInputElement).checked = product.isVisible !== false;
    (document.getElementById('p-description') as HTMLTextAreaElement).value = product.description;
    pImageInput.value = product.image;
    imagePreview.src = product.image;
    optimizationStats.textContent = 'WebP Actual';
    optimizationStats.className = 'text-[10px] font-mono text-slate-400 text-center';

    // Accessory specific fields
    const nameEsInput = document.getElementById('p-nameEs') as HTMLInputElement | null;
    const badgeEsInput = document.getElementById('p-badgeEs') as HTMLInputElement | null;
    const accCatSelect = document.getElementById('p-accCategory') as HTMLSelectElement | null;
    const connInput = document.getElementById('p-connector') as HTMLInputElement | null;
    const connEsInput = document.getElementById('p-connectorEs') as HTMLInputElement | null;
    const compatInput = document.getElementById('p-compatibility') as HTMLTextAreaElement | null;
    const descEsInput = document.getElementById('p-descriptionEs') as HTMLTextAreaElement | null;
    const secImgInput = document.getElementById('p-secondaryImage') as HTMLInputElement | null;

    if (nameEsInput) nameEsInput.value = product.nameEs || product.name || '';
    if (badgeEsInput) badgeEsInput.value = product.badgeEs || product.badge || '';
    if (accCatSelect) accCatSelect.value = product.category || 'microphones';
    if (connInput) connInput.value = product.connector || '';
    if (connEsInput) connEsInput.value = product.connectorEs || product.connector || '';
    if (compatInput) compatInput.value = (product.compatibility || []).join(', ');
    if (descEsInput) descEsInput.value = product.descriptionEs || product.description || '';
    if (secImgInput) secImgInput.value = product.secondaryImage || '';

    // Tab 2: Dossier
    const comp = product.comparison || ({} as any);
    (document.getElementById('dos-connectivity') as HTMLInputElement).value = comp.connectivity || '';
    (document.getElementById('dos-protection') as HTMLInputElement).value = comp.protection || '';
    (document.getElementById('dos-batteryRuntime') as HTMLInputElement).value = comp.batteryRuntime || '';
    (document.getElementById('dos-audioOutput') as HTMLInputElement).value = comp.audioOutput || '';
    (document.getElementById('dos-controls') as HTMLInputElement).value = comp.controls || '';
    (document.getElementById('dos-formFactor') as HTMLInputElement).value = comp.formFactor || '';
    (document.getElementById('dos-antenna') as HTMLInputElement).value = comp.antenna || '';
    (document.getElementById('dos-emergency') as HTMLInputElement).value = comp.emergency || '';
    (document.getElementById('dos-videoVision') as HTMLInputElement).value = comp.videoVision || '';
    (document.getElementById('dos-certifications') as HTMLInputElement).value = comp.certifications || '';

    // Tab 3: Specs
    renderSpecsRows(product.specs || []);

    // Tab 4: Colors
    renderColorsRows(product.colors || []);

    // Tab 5: Tags & Fallback
    (document.getElementById('p-tags') as HTMLInputElement).value = (product.tags || []).join(', ');
    (document.getElementById('p-fallbackId') as HTMLInputElement).value = product.fallbackSimilarId || '';
    (document.getElementById('p-fallbackReason') as HTMLInputElement).value = product.fallbackReason || '';
  } else {
    // New Mode
    if (modalTitle) modalTitle.textContent = isAccessory ? 'Crear Nuevo Accesorio' : 'Crear Nuevo Radio Táctico';
    if (modalSubtitle) modalSubtitle.textContent = isAccessory 
      ? 'Se guardará en Turso DB y aparecerá en el catálogo de accesorios.' 
      : 'Se guardará en Turso DB y aparecerá de inmediato en el catálogo.';
    btnDeleteProduct.classList.add('hidden');

    (document.getElementById('p-id') as HTMLInputElement).value = '';
    (document.getElementById('p-id') as HTMLInputElement).disabled = false;
    (document.getElementById('p-name') as HTMLInputElement).value = '';
    (document.getElementById('p-shortName') as HTMLInputElement).value = '';
    (document.getElementById('p-badge') as HTMLInputElement).value = isAccessory ? 'TACTICAL ACCESSORY' : 'POC TACTICAL RADIO';
    (document.getElementById('p-stockStatus') as HTMLSelectElement).value = 'in_stock';
    (document.getElementById('p-stockCount') as HTMLInputElement).value = isAccessory ? '100' : '50';
    (document.getElementById('p-priceEstimate') as HTMLInputElement).value = isAccessory ? '$35' : '';
    (document.getElementById('p-discountPrice') as HTMLInputElement).value = '';
    (document.getElementById('p-isVisible') as HTMLInputElement).checked = true;
    (document.getElementById('p-description') as HTMLTextAreaElement).value = '';
    pImageInput.value = '/images/logo-patch.webp';
    imagePreview.src = '/images/logo-patch.webp';
    optimizationStats.textContent = 'Sin imagen';

    const nameEsInput = document.getElementById('p-nameEs') as HTMLInputElement | null;
    const badgeEsInput = document.getElementById('p-badgeEs') as HTMLInputElement | null;
    const accCatSelect = document.getElementById('p-accCategory') as HTMLSelectElement | null;
    const connInput = document.getElementById('p-connector') as HTMLInputElement | null;
    const connEsInput = document.getElementById('p-connectorEs') as HTMLInputElement | null;
    const compatInput = document.getElementById('p-compatibility') as HTMLTextAreaElement | null;
    const descEsInput = document.getElementById('p-descriptionEs') as HTMLTextAreaElement | null;
    const secImgInput = document.getElementById('p-secondaryImage') as HTMLInputElement | null;

    if (nameEsInput) nameEsInput.value = '';
    if (badgeEsInput) badgeEsInput.value = isAccessory ? 'ACCESORIO TÁCTICO' : '';
    if (accCatSelect) accCatSelect.value = 'microphones';
    if (connInput) connInput.value = isAccessory ? 'Type-K (2-Pin Kenwood)' : '';
    if (connEsInput) connEsInput.value = isAccessory ? 'Type-K (2 Pines Kenwood)' : '';
    if (compatInput) compatInput.value = isAccessory ? 'G-510, G-280, G-H28, G-F1, G-889, G-K8, G-8900 Pro' : '';
    if (descEsInput) descEsInput.value = '';
    if (secImgInput) secImgInput.value = '';

    if (isAccessory) {
      renderSpecsRows([
        { label: 'Cable', value: 'Reforzado Kevlar espiralado retractil' },
        { label: 'Clip', value: 'Clip giratorio 360 grados de acero inoxidable' },
        { label: 'Micrófono', value: 'Cápsula condensador omnidireccional con filtro de viento' },
      ]);
    } else {
      (document.getElementById('dos-connectivity') as HTMLInputElement).value = '4G LTE Nationwide POC';
      (document.getElementById('dos-protection') as HTMLInputElement).value = 'IP67 Waterproof & Dustproof';
      (document.getElementById('dos-batteryRuntime') as HTMLInputElement).value = '24 Hours Full Shift';
      (document.getElementById('dos-audioOutput') as HTMLInputElement).value = '2.0W High Pressure Audio';
      (document.getElementById('dos-controls') as HTMLInputElement).value = 'Tactile PTT & Emergency Key';
      (document.getElementById('dos-formFactor') as HTMLInputElement).value = 'Ergonomic Rugged Handheld';
      (document.getElementById('dos-antenna') as HTMLInputElement).value = 'High-Gain Antennas';
      (document.getElementById('dos-emergency') as HTMLInputElement).value = 'Dedicated Top SOS Button';
      (document.getElementById('dos-videoVision') as HTMLInputElement).value = 'Not available';
      (document.getElementById('dos-certifications') as HTMLInputElement).value = 'CE / FCC Certified';

      renderSpecsRows([
        { label: 'Red', value: '4G LTE Push-To-Talk' },
        { label: 'Batería', value: '4000mAh Li-ion' },
      ]);
    }

    renderColorsRows([]);
    (document.getElementById('p-tags') as HTMLInputElement).value = isAccessory ? 'accessory, tactical, mic, ptt' : 'poc, tactical, 4g, nationwide';
    (document.getElementById('p-fallbackId') as HTMLInputElement).value = '';
    (document.getElementById('p-fallbackReason') as HTMLInputElement).value = '';
  }

  // Switch to Tab 1 by default
  switchEditorTab('general');
  productModal.classList.remove('hidden');
  productModal.classList.add('flex');
}

function closeProductModal() {
  productModal.classList.add('hidden');
  productModal.classList.remove('flex');
  editingProduct = null;
}

btnNewProduct?.addEventListener('click', () => openProductModal(null, currentCategory));
btnCloseModal?.addEventListener('click', closeProductModal);
btnCancelModal?.addEventListener('click', closeProductModal);

// Switch Tabs inside Editor
const editorTabs = document.querySelectorAll('.editor-tab');
editorTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabName = (tab as HTMLElement).dataset.tab;
    if (tabName) switchEditorTab(tabName);
  });
});

function switchEditorTab(tabName: string) {
  editorTabs.forEach((tab) => {
    if ((tab as HTMLElement).dataset.tab === tabName) {
      tab.classList.add('border-crimson-600', 'text-white');
      tab.classList.remove('border-transparent', 'text-slate-400');
    } else {
      tab.classList.remove('border-crimson-600', 'text-white');
      tab.classList.add('border-transparent', 'text-slate-400');
    }
  });

  const tabContents = ['general', 'dossier', 'specs', 'colors', 'tags'];
  tabContents.forEach((t) => {
    const el = document.getElementById(`tab-content-${t}`);
    if (el) {
      if (t === tabName) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
}

// -------------------------------------------------------------
// 8. DYNAMIC SPECS ROWS
// -------------------------------------------------------------
function renderSpecsRows(specs: { label: string; value: string }[]) {
  specsList.innerHTML = '';
  specs.forEach((s) => addSpecRow(s.label, s.value));
  if (specs.length === 0) {
    addSpecRow('', '');
  }
}

function addSpecRow(label = '', value = '') {
  const row = document.createElement('div');
  row.className = 'spec-row flex items-center gap-2';
  row.innerHTML = `
    <input type="text" placeholder="Etiqueta (ej. Red o Batería)" value="${label}" class="spec-label w-1/3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
    <input type="text" placeholder="Valor (ej. 4G LTE o 4000mAh)" value="${value}" class="spec-value flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
    <button type="button" class="btn-remove-row p-2 text-slate-500 hover:text-rose-400 transition-colors" title="Eliminar fila">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  row.querySelector('.btn-remove-row')?.addEventListener('click', () => row.remove());
  specsList.appendChild(row);
}

btnAddSpec?.addEventListener('click', () => addSpecRow('', ''));

// -------------------------------------------------------------
// 9. DYNAMIC COLORS ROWS
// -------------------------------------------------------------
function renderColorsRows(colors: ProductColor[]) {
  colorsList.innerHTML = '';
  colors.forEach((c) => addColorRow(c));
}

function addColorRow(c: Partial<ProductColor> = {}) {
  const row = document.createElement('div');
  row.className = 'color-row bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center';
  row.innerHTML = `
    <input type="text" placeholder="ID (ej. black)" value="${c.id || ''}" class="col-id bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white" />
    <input type="text" placeholder="Nombre EN" value="${c.name || ''}" class="col-name bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white" />
    <input type="text" placeholder="Nombre ES" value="${c.nameEs || ''}" class="col-nameEs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white" />
    <div class="flex items-center gap-1.5">
      <input type="color" value="${c.hex || '#000000'}" class="col-hex-picker w-7 h-7 bg-transparent rounded cursor-pointer" />
      <input type="text" placeholder="#000000" value="${c.hex || '#000000'}" class="col-hex flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono" />
    </div>
    <div class="flex items-center gap-1">
      <input type="text" placeholder="Ruta imagen WebP" value="${c.image || ''}" class="col-image flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono" />
      <button type="button" class="btn-remove-color p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  `;

  const picker = row.querySelector('.col-hex-picker') as HTMLInputElement;
  const hexInput = row.querySelector('.col-hex') as HTMLInputElement;
  picker?.addEventListener('input', () => (hexInput.value = picker.value));
  hexInput?.addEventListener('input', () => (picker.value = hexInput.value));

  row.querySelector('.btn-remove-color')?.addEventListener('click', () => row.remove());
  colorsList.appendChild(row);
}

btnAddColor?.addEventListener('click', () => addColorRow({}));

// -------------------------------------------------------------
// 10. SAVE / UPDATE PRODUCT SUBMIT
// -------------------------------------------------------------
productForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  btnSaveProduct?.click();
});

btnSaveProduct?.addEventListener('click', async () => {
  const modalError = document.getElementById('modal-error') as HTMLDivElement;
  modalError.classList.add('hidden');

  const id = (document.getElementById('p-id') as HTMLInputElement).value.trim();
  const name = (document.getElementById('p-name') as HTMLInputElement).value.trim();
  const badge = (document.getElementById('p-badge') as HTMLInputElement).value.trim();
  const stockStatus = (document.getElementById('p-stockStatus') as HTMLSelectElement).value as StockStatus;
  const priceEstimate = (document.getElementById('p-priceEstimate') as HTMLInputElement).value.trim();
  const isVisible = (document.getElementById('p-isVisible') as HTMLInputElement).checked;
  const description = (document.getElementById('p-description') as HTMLTextAreaElement).value.trim();
  const image = pImageInput.value.trim();

  if (!id || !name || !badge || !description || !image) {
    modalError.textContent = 'Por favor completa todos los campos requeridos con asterisco (*).';
    modalError.classList.remove('hidden');
    return;
  }

  // Build specs
  const specRows = Array.from(specsList.querySelectorAll('.spec-row'));
  const specs = specRows
    .map((r) => {
      const label = (r.querySelector('.spec-label') as HTMLInputElement).value.trim();
      const value = (r.querySelector('.spec-value') as HTMLInputElement).value.trim();
      return label && value ? { label, value } : null;
    })
    .filter(Boolean) as { label: string; value: string }[];

  const isAccessory = currentCategory === 'accessory';

  btnSaveProduct.disabled = true;
  btnSaveProduct.textContent = 'Guardando en Turso...';

  try {
    const isEdit = Boolean(editingProduct);
    const method = isEdit ? 'PUT' : 'POST';

    if (isAccessory) {
      const accCategory = (document.getElementById('p-accCategory') as HTMLSelectElement)?.value || 'microphones';
      const nameEs = (document.getElementById('p-nameEs') as HTMLInputElement)?.value.trim() || name;
      const badgeEs = (document.getElementById('p-badgeEs') as HTMLInputElement)?.value.trim() || badge;
      const connector = (document.getElementById('p-connector') as HTMLInputElement)?.value.trim() || '';
      const connectorEs = (document.getElementById('p-connectorEs') as HTMLInputElement)?.value.trim() || connector;
      const compatibilityRaw = (document.getElementById('p-compatibility') as HTMLTextAreaElement)?.value || '';
      const compatibility = compatibilityRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const descriptionEs = (document.getElementById('p-descriptionEs') as HTMLTextAreaElement)?.value.trim() || description;
      const secondaryImage = (document.getElementById('p-secondaryImage') as HTMLInputElement)?.value.trim() || undefined;

      const payload = {
        id,
        name,
        nameEs,
        category: accCategory,
        badge,
        badgeEs,
        image,
        secondaryImage,
        description,
        descriptionEs,
        connector,
        connectorEs,
        compatibility,
        specs,
        inStock: stockStatus !== 'out_of_stock',
        priceEstimate: priceEstimate || undefined,
        isVisible,
      };

      const res = await fetch('/api/admin/accessories', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (handle401(res)) return;
    if (!res.ok) {
        throw new Error(resData.error || 'Error al guardar el accesorio');
      }

      showToast(`✓ Accesorio "${name}" guardado exitosamente en Turso DB`);
    } else {
      const shortName = (document.getElementById('p-shortName') as HTMLInputElement).value.trim();
      const stockCountVal = (document.getElementById('p-stockCount') as HTMLInputElement).value;
      const stockCount = stockCountVal ? parseInt(stockCountVal, 10) : undefined;
      const discountPrice = (document.getElementById('p-discountPrice') as HTMLInputElement).value.trim();

      const comparison = {
        connectivity: (document.getElementById('dos-connectivity') as HTMLInputElement).value.trim(),
        protection: (document.getElementById('dos-protection') as HTMLInputElement).value.trim(),
        batteryRuntime: (document.getElementById('dos-batteryRuntime') as HTMLInputElement).value.trim(),
        audioOutput: (document.getElementById('dos-audioOutput') as HTMLInputElement).value.trim(),
        controls: (document.getElementById('dos-controls') as HTMLInputElement).value.trim(),
        formFactor: (document.getElementById('dos-formFactor') as HTMLInputElement).value.trim(),
        antenna: (document.getElementById('dos-antenna') as HTMLInputElement).value.trim(),
        emergency: (document.getElementById('dos-emergency') as HTMLInputElement).value.trim(),
        videoVision: (document.getElementById('dos-videoVision') as HTMLInputElement).value.trim(),
        certifications: (document.getElementById('dos-certifications') as HTMLInputElement).value.trim(),
      };

      const colorRows = Array.from(colorsList.querySelectorAll('.color-row'));
      const colors: ProductColor[] = colorRows
        .map((r) => {
          const colId = (r.querySelector('.col-id') as HTMLInputElement).value.trim();
          const colName = (r.querySelector('.col-name') as HTMLInputElement).value.trim();
          const colNameEs = (r.querySelector('.col-nameEs') as HTMLInputElement).value.trim();
          const colHex = (r.querySelector('.col-hex') as HTMLInputElement).value.trim();
          const colImg = (r.querySelector('.col-image') as HTMLInputElement).value.trim();
          if (colId && colName) {
            return {
              id: colId,
              name: colName,
              nameEs: colNameEs || undefined,
              hex: colHex || '#000000',
              image: colImg || image,
            };
          }
          return null;
        })
        .filter(Boolean) as ProductColor[];

      const tagsRaw = (document.getElementById('p-tags') as HTMLInputElement).value;
      const tags = tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const fallbackSimilarId = (document.getElementById('p-fallbackId') as HTMLInputElement).value.trim() || undefined;
      const fallbackReason = (document.getElementById('p-fallbackReason') as HTMLInputElement).value.trim() || undefined;

      const payload: ExtendedProduct = {
        id,
        name,
        shortName: shortName || undefined,
        badge,
        image,
        description,
        inStock: stockStatus !== 'out_of_stock',
        stockStatus,
        stockCount,
        priceEstimate: priceEstimate || undefined,
        discountPrice: discountPrice || undefined,
        isVisible,
        fallbackSimilarId,
        fallbackReason,
        specs,
        comparison,
        tags,
        colors: colors.length > 0 ? colors : undefined,
        category: 'radio',
      };

      const res = await fetch('/api/admin/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (handle401(res)) return;
    if (!res.ok) {
        throw new Error(resData.error || 'Error al guardar el producto');
      }

      showToast(`✓ Radio "${name}" guardado exitosamente en Turso DB`);
    }

    closeProductModal();
    loadProducts();
    updateTabBadges();
  } catch (err: any) {
    modalError.textContent = err.message || 'Error desconocido';
    modalError.classList.remove('hidden');
  } finally {
    btnSaveProduct.disabled = false;
    btnSaveProduct.textContent = 'Guardar en Turso';
  }
});

// Delete / Restore inside modal
btnDeleteProduct?.addEventListener('click', async () => {
  if (!editingProduct) return;
  const { id, name } = editingProduct;
  const isAccessory = currentCategory === 'accessory';

  if (editingProduct.isDeleted) {
    if (confirm(`¿Confirmas restaurar el ${isAccessory ? 'accesorio' : 'radio'} "${name}" (${id}) desde la papelera?`)) {
      try {
        const res = await fetch('/api/admin/restore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ id, type: currentCategory }),
        });

        if (res.ok) {
          showToast(`"${name}" restaurado exitosamente`);
          closeProductModal();
          loadProducts();
          updateTabBadges();
        } else {
          alert('No se pudo restaurar el elemento');
        }
      } catch (err) {
        alert('Error de conexión al restaurar');
      }
    }
    return;
  }

  if (confirm(`¿Confirmas mover el ${isAccessory ? 'accesorio' : 'producto'} "${name}" (${id}) a la papelera?\n\nPodrás restaurarlo o eliminarlo definitivamente desde la pestaña Papelera.`)) {
    try {
      const endpoint = isAccessory
        ? `/api/admin/accessories?id=${encodeURIComponent(id)}`
        : `/api/admin/products?id=${encodeURIComponent(id)}`;

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (res.ok) {
        showToast(`"${name}" movido a la papelera`);
        closeProductModal();
        loadProducts();
        updateTabBadges();
      } else {
        alert('No se pudo eliminar el elemento');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }
});

// Download JSON Backup
downloadBackupBtn?.addEventListener('click', () => {
  const isAccessory = currentCategory === 'accessory';
  const prefix = isAccessory ? 'gtech-accessories-backup' : 'gtech-products-backup';
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allProducts, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${prefix}-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`Respaldo JSON de ${isAccessory ? 'accesorios' : 'radios'} descargado`);
});

// -------------------------------------------------------------
// INITIAL STARTUP
// -------------------------------------------------------------
if (adminToken) {
  authOverlay.classList.add('hidden');
  adminApp.classList.remove('hidden');
  loadProducts();
  loadSettings();
} else {
  authOverlay.classList.remove('hidden');
  adminApp.classList.add('hidden');
}

// -------------------------------------------------------------
// TAB NAVIGATION: RADIOS / ACCESSORIES / QUOTES & ORDERS
// -------------------------------------------------------------
const tabRadios = document.getElementById('tab-radios');
const tabAccessories = document.getElementById('tab-accessories');
const tabQuotes = document.getElementById('tab-quotes');
const catalogView = document.getElementById('catalog-view');
const quotesView = document.getElementById('quotes-view');
const quotesContainer = document.getElementById('quotes-container');
const searchQuotesInput = document.getElementById('search-quotes-input') as HTMLInputElement | null;
const btnRefreshQuotes = document.getElementById('btn-refresh-quotes');
const quoteFilterPills = document.querySelectorAll('.quote-filter-pill');

// Quotes State
interface QuoteItem {
  id: string;
  name: string;
  badge: string;
  quantity: number;
  selectedColor?: string | null;
}

interface QuoteRecord {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  companyName?: string | null;
  destination: string;
  notes?: string | null;
  items: QuoteItem[];
  totalUnits: number;
  simPlan: string;
  channel: string;
  status: 'pending' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  ipAddress?: string | null;
  createdAt: string;
  updatedAt: string;
}

let allQuotes: QuoteRecord[] = [];
let currentQuoteFilter = 'all';
let currentQuoteSearch = '';

function setNewProductLabel(label: string) {
  const labelSpan = btnNewProduct?.querySelector('span');
  if (labelSpan) {
    labelSpan.textContent = label;
  } else if (btnNewProduct) {
    btnNewProduct.textContent = label;
  }
}

function setActiveTab(category: 'radio' | 'accessory' | 'quotes') {
  const titleEl = document.getElementById('catalog-section-title');
  const descEl = document.getElementById('catalog-section-desc');

  if (category === 'quotes') {
    tabQuotes?.classList.add('bg-rose-700', 'text-white', 'shadow-sm');
    tabQuotes?.classList.remove('text-slate-400');
    tabRadios?.classList.remove('bg-crimson-700', 'text-white', 'shadow-sm');
    tabRadios?.classList.add('text-slate-400');
    tabAccessories?.classList.remove('bg-crimson-700', 'text-white', 'shadow-sm');
    tabAccessories?.classList.add('text-slate-400');

    catalogView?.classList.add('hidden');
    quotesView?.classList.remove('hidden');
    loadQuotes();
    return;
  }

  // Radios or Accessories tab
  quotesView?.classList.add('hidden');
  catalogView?.classList.remove('hidden');

  tabQuotes?.classList.remove('bg-rose-700', 'text-white', 'shadow-sm');
  tabQuotes?.classList.add('text-slate-400');

  currentCategory = category;

  if (category === 'radio') {
    tabRadios?.classList.add('bg-crimson-700', 'text-white', 'shadow-sm');
    tabRadios?.classList.remove('text-slate-400');
    tabAccessories?.classList.remove('bg-crimson-700', 'text-white', 'shadow-sm');
    tabAccessories?.classList.add('text-slate-400');
    setNewProductLabel('Nuevo Radio Táctico');
    if (titleEl) titleEl.textContent = 'Inventario Activo de Radios PoC';
    if (descEl) descEl.textContent = 'Modifica precios, inventario, ficha técnica o alterna visibilidad. Cualquier cambio se sincroniza en vivo con Turso.';
    if (accCategoryFilters) {
      accCategoryFilters.classList.add('hidden');
      accCategoryFilters.classList.remove('flex');
    }
  } else {
    tabAccessories?.classList.add('bg-crimson-700', 'text-white', 'shadow-sm');
    tabAccessories?.classList.remove('text-slate-400');
    tabRadios?.classList.remove('bg-crimson-700', 'text-white', 'shadow-sm');
    tabRadios?.classList.add('text-slate-400');
    setNewProductLabel('Nuevo Accesorio');
    if (titleEl) titleEl.textContent = 'Catálogo de Accesorios Tácticos';
    if (descEl) descEl.textContent = 'Micrófonos PTT, auriculares tácticos y estaciones de carga. Sincronizado en vivo con Turso DB.';
    if (accCategoryFilters) {
      accCategoryFilters.classList.remove('hidden');
      accCategoryFilters.classList.add('flex');
    }
    currentAccCategory = 'all';
    accCatPills.forEach((p) => {
      if ((p as HTMLElement).dataset.accCat === 'all') {
        p.classList.add('bg-cyan-900/60', 'text-cyan-300', 'border-cyan-700/60');
        p.classList.remove('bg-slate-950', 'text-slate-400');
      } else {
        p.classList.remove('bg-cyan-900/60', 'text-cyan-300', 'border-cyan-700/60');
        p.classList.add('bg-slate-950', 'text-slate-400');
      }
    });
  }
  currentFilter = 'all';
  filterPills.forEach((b) => {
    if ((b as HTMLElement).dataset.filter === 'all') {
      b.classList.add('bg-slate-800', 'text-white');
      b.classList.remove('bg-slate-950', 'text-slate-400');
    } else {
      b.classList.remove('bg-slate-800', 'text-white');
      b.classList.add('bg-slate-950', 'text-slate-400');
    }
  });
  loadProducts();
}

tabRadios?.addEventListener('click', () => setActiveTab('radio'));
tabAccessories?.addEventListener('click', () => setActiveTab('accessory'));
tabQuotes?.addEventListener('click', () => setActiveTab('quotes'));

// -------------------------------------------------------------
// QUOTES & ORDERS TURSO DB MANAGEMENT
// -------------------------------------------------------------
async function loadQuotes() {
  if (!adminToken || !quotesContainer) return;

  quotesContainer.innerHTML = `
    <div class="py-16 text-center text-slate-500">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm font-semibold">Cargando cotizaciones desde Turso DB...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/admin/quotes', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (res.ok) {
      allQuotes = await res.json();
      updateQuoteCounts();
      renderQuotes();
    } else {
      const errData = await res.json().catch(() => ({}));
      quotesContainer.innerHTML = `
        <div class="py-12 text-center text-rose-400">
          <p class="font-bold">Error al cargar cotizaciones</p>
          <p class="text-xs text-slate-500 mt-1">${errData.error || 'Verifica la conexión a Turso o credenciales.'}</p>
        </div>
      `;
    }
  } catch (err: any) {
    quotesContainer.innerHTML = `
      <div class="py-12 text-center text-rose-400">
        <p class="font-bold">Error de conexión con el servidor de cotizaciones</p>
      </div>
    `;
  }
}

function updateQuoteCounts() {
  const allCount = allQuotes.length;
  const pendingCount = allQuotes.filter((q) => q.status === 'pending').length;
  const contactedCount = allQuotes.filter((q) => q.status === 'contacted').length;
  const quotedCount = allQuotes.filter((q) => q.status === 'quoted').length;
  const completedCount = allQuotes.filter((q) => q.status === 'completed').length;

  const qAll = document.getElementById('qcount-all');
  const qPending = document.getElementById('qcount-pending');
  const qContacted = document.getElementById('qcount-contacted');
  const qQuoted = document.getElementById('qcount-quoted');
  const qCompleted = document.getElementById('qcount-completed');
  const qBadge = document.getElementById('quotes-count-badge');

  if (qAll) qAll.textContent = String(allCount);
  if (qPending) qPending.textContent = String(pendingCount);
  if (qContacted) qContacted.textContent = String(contactedCount);
  if (qQuoted) qQuoted.textContent = String(quotedCount);
  if (qCompleted) qCompleted.textContent = String(completedCount);
  if (qBadge) qBadge.textContent = String(pendingCount);
}


function renderQuotes() {
  if (!quotesContainer) return;

  const filtered = allQuotes.filter((q) => {
    // Status filter
    if (currentQuoteFilter !== 'all' && q.status !== currentQuoteFilter) {
      return false;
    }

    // Search filter
    if (currentQuoteSearch) {
      const s = currentQuoteSearch.toLowerCase();
      const matchNum = (q.quoteNumber || '').toLowerCase().includes(s);
      const matchName = (q.customerName || '').toLowerCase().includes(s);
      const matchEmail = (q.customerEmail || '').toLowerCase().includes(s);
      const matchCompany = (q.companyName || '').toLowerCase().includes(s);
      const matchDest = (q.destination || '').toLowerCase().includes(s);
      return matchNum || matchName || matchEmail || matchCompany || matchDest;
    }

    return true;
  });

  if (filtered.length === 0) {
    quotesContainer.innerHTML = `
      <div class="py-16 text-center text-slate-500">
        <svg class="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <p class="text-sm font-bold text-slate-400">No se encontraron cotizaciones con este criterio</p>
        <p class="text-xs text-slate-500 mt-1">Prueba seleccionando "Todas" o limpiando el cuadro de búsqueda.</p>
      </div>
    `;
    return;
  }

  const channelMap: Record<string, { label: string; color: string; icon: string }> = {
    gmail: {
      label: 'Gmail Web',
      color: 'bg-rose-950/80 text-rose-300 border-rose-800',
      icon: '📧',
    },
    email_client: {
      label: 'App Correo',
      color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      icon: '✉️',
    },
    clipboard: {
      label: 'Portapapeles',
      color: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: '📋',
    },
    whatsapp: {
      label: 'WhatsApp',
      color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      icon: '💬',
    },
  };

  const statusMap: Record<string, { label: string; badgeClass: string }> = {
    pending: { label: 'Pendiente', badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-700' },
    contacted: { label: 'Contactado', badgeClass: 'bg-cyan-950/90 text-cyan-300 border-cyan-700' },
    quoted: { label: 'Cotización Enviada', badgeClass: 'bg-purple-950/90 text-purple-300 border-purple-700' },
    completed: { label: 'Completada / Despachada', badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-700' },
    cancelled: { label: 'Cancelada', badgeClass: 'bg-slate-900 text-slate-400 border-slate-700' },
  };

  quotesContainer.innerHTML = filtered
    .map((q) => {
      const channelInfo = channelMap[q.channel] || channelMap.gmail;
      const statusInfo = statusMap[q.status] || statusMap.pending;

      const createdDate = q.createdAt
        ? new Date(q.createdAt).toLocaleString('es-ES', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : 'Reciente';

      const itemsListHtml = (q.items || [])
        .map((item) => {
          const colorBadge = item.selectedColor
            ? `<span class="px-1.5 py-0.2 rounded bg-slate-950 text-amber-300 border border-amber-600/40 text-[10px] ml-1">Color: ${escapeHtml(item.selectedColor)}</span>`
            : '';
          return `
            <div class="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
              <span class="text-white font-medium">
                <span class="text-rose-400 font-bold">${item.quantity}x</span> ${escapeHtml(item.name)} ${colorBadge}
              </span>
              <span class="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                ${escapeHtml(item.badge)}
              </span>
            </div>
          `;
        })
        .join('');

      const simPlanMap: Record<string, string> = {
        none: 'Solo Equipos (Sin SIM)',
        us_can_mex: '🇺🇸 🇨🇦 🇲🇽 USA, Canadá, México (+$30/año)',
        brazil: '🇧🇷 Brasil (+$45/año)',
        latam: '🌎 Latín América (+$45/año)',
        europe: '🇪🇺 Europa (+$50/año)',
        global: '🌐 Global Multi (+$50/año)',
      };
      const simText = simPlanMap[q.simPlan] || q.simPlan || 'Solo Equipos';

      const safeEmail = escapeHtml(q.customerEmail);
      const safePhone = escapeHtml(q.customerPhone);
      const safeDestination = escapeHtml(q.destination);
      const safeName = escapeHtml(q.customerName);
      const safeCompany = escapeHtml(q.companyName);
      const safeNotes = escapeHtml(q.notes);

      const directGmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        q.customerEmail
      )}&su=${encodeURIComponent(`[G-TECH] Respuesta a Cotización #${q.quoteNumber}`)}`;

      const phoneLink = safePhone
        ? `<a href="tel:${safePhone}" class="text-cyan-400 hover:underline flex items-center gap-1">📞 ${safePhone}</a>`
        : '<span class="text-slate-600">No especificado</span>';

      return `
        <div class="p-5 sm:p-6 bg-slate-900/90 border border-slate-800/90 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
          
          <!-- Top Row: Reference, Date, Channel & Status Select -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm sm:text-base font-mono font-extrabold text-white bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                #${escapeHtml(q.quoteNumber)}
              </span>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${channelInfo.color} flex items-center gap-1">
                <span>${channelInfo.icon}</span>
                <span>${channelInfo.label}</span>
              </span>
              <span class="text-xs text-slate-400">
                📅 ${createdDate}
              </span>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-auto">
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusInfo.badgeClass} hidden sm:inline-block">
                ${statusInfo.label}
              </span>
              <select 
                data-action="update-quote-status" data-id="${escapeHtml(q.id)}" 
                class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-rose-500">
                <option value="pending" ${q.status === 'pending' ? 'selected' : ''}>⏳ Pendiente</option>
                <option value="contacted" ${q.status === 'contacted' ? 'selected' : ''}>💬 Contactado</option>
                <option value="quoted" ${q.status === 'quoted' ? 'selected' : ''}>📄 Cotización Enviada</option>
                <option value="completed" ${q.status === 'completed' ? 'selected' : ''}>✅ Completada</option>
                <option value="cancelled" ${q.status === 'cancelled' ? 'selected' : ''}>❌ Cancelada</option>
              </select>
            </div>
          </div>

          <!-- Middle Row: Customer Details & Products Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            <!-- Customer Details Card -->
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Datos del Cliente</span>
              <div class="text-sm font-extrabold text-white flex items-center gap-2">
                <span>${safeName}</span>
                ${safeCompany ? `<span class="text-xs font-normal text-slate-400">(${safeCompany})</span>` : ''}
              </div>
              <div class="space-y-1 text-slate-300 pt-1">
                <div class="flex items-center gap-2">
                  <span class="text-slate-500">Email:</span>
                  <a href="mailto:${safeEmail}" class="text-cyan-400 hover:underline font-mono">${safeEmail}</a>
                  <a href="${directGmailHref}" target="_blank" class="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors" title="Responder por Gmail Web">
                    Gmail Web ↗
                  </a>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-500">Teléfono:</span>
                  ${phoneLink}
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-500">Destino de Entrega:</span>
                  <span class="text-white font-semibold">📍 ${safeDestination}</span>
                </div>
              </div>
            </div>

            <!-- Items & SIM Plan Card -->
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[10px] font-bold uppercase tracking-wider text-rose-400">Equipos Solicitados</span>
                <span class="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Total: ${q.totalUnits} unidad(es)
                </span>
              </div>
              <div class="space-y-1 max-h-28 overflow-y-auto pr-1">
                ${itemsListHtml}
              </div>
              <div class="pt-1.5 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center justify-between">
                <span class="text-slate-500">SIM Anual:</span>
                <span class="font-medium">${escapeHtml(simText)}</span>
              </div>
            </div>

          </div>

          <!-- Notes Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Notas del Cliente:</span>
              <p class="text-slate-300 italic leading-relaxed">
                ${safeNotes ? `"${safeNotes}"` : 'Sin notas operativas especiales.'}
              </p>
            </div>

            <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notas Administrativas / Seguimiento:</span>
                <button 
                  type="button" 
                  data-action="save-quote-notes" data-id="${escapeHtml(q.id)}" 
                  class="text-[10px] font-bold px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition-colors">
                  Guardar Nota
                </button>
              </div>
              <textarea 
                id="admin-notes-${escapeHtml(q.id)}" 
                rows="2" 
                placeholder="Escribe notas internas (ej. Factura #492 enviada por Geramel, tracking UPS...)" 
                class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 resize-none"
              >${safeNotes}</textarea>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <span class="text-[10px] text-slate-500 font-mono">ID: ${escapeHtml(q.id)}</span>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                data-action="delete-quote" data-id="${escapeHtml(q.id)}" 
                class="px-3 py-1.5 text-xs text-rose-400 hover:text-white hover:bg-rose-950/60 rounded-lg border border-rose-900/60 transition-colors"
                title="Eliminar registro de cotización">
                Eliminar
              </button>
            </div>
          </div>

        </div>
      `;
    })
    .join('');
}

// Global quote methods for inline HTML buttons
(window as any).updateAdminQuoteStatus = async (quoteId: string, status: string) => {
  if (!adminToken) return;
  try {
    const res = await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ id: quoteId, status }),
    });

    if (res.ok) {
      const q = allQuotes.find((x) => x.id === quoteId);
      if (q) q.status = status as any;
      updateQuoteCounts();
      renderQuotes();
      showToast('Estado de cotización actualizado');
    } else {
      showToast('Error al actualizar estado', true);
    }
  } catch (err) {
    showToast('Error de conexión', true);
  }
};

(window as any).saveAdminQuoteNotes = async (quoteId: string, notes: string) => {
  if (!adminToken) return;
  try {
    const res = await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ id: quoteId, notes }),
    });

    if (res.ok) {
      const q = allQuotes.find((x) => x.id === quoteId);
      if (q) q.notes = notes;
      showToast('Notas de cotización guardadas en Turso');
    } else {
      showToast('Error al guardar notas', true);
    }
  } catch (err) {
    showToast('Error de conexión', true);
  }
};

(window as any).deleteAdminQuote = async (quoteId: string) => {
  if (!adminToken) return;
  if (!confirm('¿Estás seguro de que deseas eliminar permanentemente este registro de cotización?')) {
    return;
  }

  try {
    const res = await fetch('/api/admin/quotes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ id: quoteId }),
    });

    if (res.ok) {
      allQuotes = allQuotes.filter((x) => x.id !== quoteId);
      updateQuoteCounts();
      renderQuotes();
      showToast('Cotización eliminada');
    } else {
      showToast('Error al eliminar cotización', true);
    }
  } catch (err) {
    showToast('Error de conexión', true);
  }
};

// Search & Filter Listeners for Quotes
searchQuotesInput?.addEventListener('input', (e) => {
  currentQuoteSearch = (e.target as HTMLInputElement).value.trim();
  renderQuotes();
});

btnRefreshQuotes?.addEventListener('click', () => {
  loadQuotes();
  showToast('Cotizaciones actualizadas');
});

quoteFilterPills.forEach((btn) => {
  btn.addEventListener('click', () => {
    quoteFilterPills.forEach((b) => {
      b.classList.remove('bg-slate-800', 'text-white');
      b.classList.add('bg-slate-950', 'text-slate-400');
    });
    btn.classList.add('bg-slate-800', 'text-white');
    btn.classList.remove('bg-slate-950', 'text-slate-400');

    currentQuoteFilter = (btn as HTMLElement).dataset.quoteFilter || 'all';
    renderQuotes();
  });
});

