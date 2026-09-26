import { convertToWebP, formatBytes, type OptimizedImageResult } from './utils/imageOptimizer';
import type { Product, ProductColor, StockStatus } from './types';

interface ExtendedProduct extends Product {
  discountPrice?: string;
  isVisible?: boolean;
  category?: string;
  sortOrder?: number;
}

// Global State
let allProducts: ExtendedProduct[] = [];
let currentFilter = 'all';
let currentSearch = '';
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
async function handleLogin(password: string) {
  try {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.ok) {
      adminToken = data.token || password;
      sessionStorage.setItem('gtech_admin_token', adminToken!);
      authOverlay.classList.add('hidden');
      adminApp.classList.remove('hidden');
      loadProducts();
    } else {
      authError.textContent = data.error || 'Clave maestra incorrecta';
      authError.classList.remove('hidden');
    }
  } catch (err) {
    authError.textContent = 'Error al comunicarse con el servidor de autenticación';
    authError.classList.remove('hidden');
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

// -------------------------------------------------------------
// 2. DATA FETCHING (TURSO API)
// -------------------------------------------------------------
async function loadProducts() {
  if (!adminToken) return;

  productsContainer.innerHTML = `
    <div class="col-span-full py-16 text-center text-slate-500">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-crimson-600 border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm font-semibold">Cargando flota de radios desde Turso DB...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/admin/products', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (res.status === 401) {
      sessionStorage.removeItem('gtech_admin_token');
      adminToken = null;
      adminApp.classList.add('hidden');
      authOverlay.classList.remove('hidden');
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    allProducts = await res.json();
    updateCounts();
    renderProducts();
  } catch (err: any) {
    console.error('Error fetching products:', err);
    productsContainer.innerHTML = `
      <div class="col-span-full py-12 text-center text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6">
        <p class="font-bold text-sm">Error al cargar productos de Turso DB</p>
        <p class="text-xs text-slate-400 mt-1">${err.message}</p>
        <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">Reintentar</button>
      </div>
    `;
  }
}

function updateCounts() {
  const countAll = document.getElementById('count-all');
  const countVisible = document.getElementById('count-visible');
  const countHidden = document.getElementById('count-hidden');
  const countLow = document.getElementById('count-low');
  const radiosCountBadge = document.getElementById('radios-count-badge');

  const visible = allProducts.filter((p) => p.isVisible !== false).length;
  const hidden = allProducts.filter((p) => p.isVisible === false).length;
  const low = allProducts.filter((p) => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock').length;

  if (countAll) countAll.textContent = String(allProducts.length);
  if (countVisible) countVisible.textContent = String(visible);
  if (countHidden) countHidden.textContent = String(hidden);
  if (countLow) countLow.textContent = String(low);
  if (radiosCountBadge) radiosCountBadge.textContent = String(allProducts.length);
}

// -------------------------------------------------------------
// 3. PRODUCT RENDERING
// -------------------------------------------------------------
function renderProducts() {
  let filtered = allProducts.filter((p) => {
    // Status filter
    if (currentFilter === 'visible' && p.isVisible === false) return false;
    if (currentFilter === 'hidden' && p.isVisible !== false) return false;
    if (currentFilter === 'low_stock' && p.stockStatus !== 'low_stock' && p.stockStatus !== 'out_of_stock') return false;

    // Search term
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      const matchBadge = p.badge.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      return matchName || matchId || matchBadge || matchDesc;
    }

    return true;
  });

  if (filtered.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <svg class="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-sm font-bold text-slate-400">No se encontraron productos con los filtros aplicados</p>
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
      if (p.stockStatus === 'out_of_stock') {
        stockPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-950 text-rose-300 border border-rose-800">Agotado</span>';
      } else if (p.stockStatus === 'low_stock') {
        stockPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-800">Bajo Stock</span>';
      } else {
        stockPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">Disponible</span>';
      }

      return `
        <div class="bg-slate-900 border ${
          isVis ? 'border-slate-800' : 'border-dashed border-slate-800 opacity-60'
        } hover:border-slate-700 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all group relative">
          
          <!-- Top Row: Thumbnail + Badges -->
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 relative overflow-hidden flex-shrink-0">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform" onerror="this.src='/images/logo-patch.webp'" />
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
                  data-id="${p.id}"
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
              <span class="text-[10px] font-mono text-cyan-400 tracking-wider block">${p.id}</span>
              <h3 class="text-sm font-extrabold text-white leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">
                ${p.name}
              </h3>
              <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md">
                ${p.badge}
              </span>
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
            <button 
              type="button" 
              data-action="edit" 
              data-id="${p.id}"
              class="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              <span>Editar Ficha</span>
            </button>

            <button 
              type="button" 
              data-action="delete" 
              data-id="${p.id}"
              data-name="${p.name}"
              class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Eliminar radio permanentemente">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
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

  if (action === 'toggle-visibility') {
    const product = allProducts.find((p) => p.id === id);
    if (!product) return;
    const nextVis = !(product.isVisible !== false);

    try {
      target.textContent = 'Actualizando...';
      const res = await fetch('/api/admin/products', {
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
        showToast(`Radio ${product.name} marcado como ${nextVis ? 'Visible' : 'Oculto'}`);
      } else {
        showToast('Error al actualizar visibilidad', true);
      }
    } catch (err) {
      showToast('Error de conexión', true);
    }
  }

  if (action === 'edit') {
    const product = allProducts.find((p) => p.id === id);
    if (product) openProductModal(product);
  }

  if (action === 'delete') {
    const name = target.dataset.name || id;
    if (confirm(`¿Estás seguro de eliminar permanentemente el radio "${name}" (${id})? Esta acción no se puede deshacer.`)) {
      try {
        const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (res.ok) {
          allProducts = allProducts.filter((p) => p.id !== id);
          updateCounts();
          renderProducts();
          showToast(`Radio "${name}" eliminado de Turso DB`);
        } else {
          showToast('No se pudo eliminar el producto', true);
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
function openProductModal(product: ExtendedProduct | null = null) {
  editingProduct = product;
  const isEdit = Boolean(product);

  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalError = document.getElementById('modal-error');
  if (modalError) modalError.classList.add('hidden');

  if (isEdit && product) {
    if (modalTitle) modalTitle.textContent = `Editar: ${product.name}`;
    if (modalSubtitle) modalSubtitle.textContent = `Modificando ID: ${product.id}`;
    btnDeleteProduct.classList.remove('hidden');

    // Tab 1: General
    (document.getElementById('p-id') as HTMLInputElement).value = product.id;
    (document.getElementById('p-id') as HTMLInputElement).disabled = true;
    (document.getElementById('p-name') as HTMLInputElement).value = product.name;
    (document.getElementById('p-shortName') as HTMLInputElement).value = product.shortName || '';
    (document.getElementById('p-badge') as HTMLInputElement).value = product.badge;
    (document.getElementById('p-stockStatus') as HTMLSelectElement).value = product.stockStatus || 'in_stock';
    (document.getElementById('p-stockCount') as HTMLInputElement).value = product.stockCount !== undefined ? String(product.stockCount) : '';
    (document.getElementById('p-priceEstimate') as HTMLInputElement).value = product.priceEstimate || '';
    (document.getElementById('p-discountPrice') as HTMLInputElement).value = product.discountPrice || '';
    (document.getElementById('p-isVisible') as HTMLInputElement).checked = product.isVisible !== false;
    (document.getElementById('p-description') as HTMLTextAreaElement).value = product.description;
    pImageInput.value = product.image;
    imagePreview.src = product.image;
    optimizationStats.textContent = 'WebP Actual';
    optimizationStats.className = 'text-[10px] font-mono text-slate-400 text-center';

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
    // New Product Mode
    if (modalTitle) modalTitle.textContent = 'Crear Nuevo Radio Táctico';
    if (modalSubtitle) modalSubtitle.textContent = 'Se creará en Turso DB y aparecerá de inmediato en el catálogo.';
    btnDeleteProduct.classList.add('hidden');

    (document.getElementById('p-id') as HTMLInputElement).value = '';
    (document.getElementById('p-id') as HTMLInputElement).disabled = false;
    (document.getElementById('p-name') as HTMLInputElement).value = '';
    (document.getElementById('p-shortName') as HTMLInputElement).value = '';
    (document.getElementById('p-badge') as HTMLInputElement).value = 'POC TACTICAL RADIO';
    (document.getElementById('p-stockStatus') as HTMLSelectElement).value = 'in_stock';
    (document.getElementById('p-stockCount') as HTMLInputElement).value = '50';
    (document.getElementById('p-priceEstimate') as HTMLInputElement).value = '';
    (document.getElementById('p-discountPrice') as HTMLInputElement).value = '';
    (document.getElementById('p-isVisible') as HTMLInputElement).checked = true;
    (document.getElementById('p-description') as HTMLTextAreaElement).value = '';
    pImageInput.value = '/images/logo-patch.webp';
    imagePreview.src = '/images/logo-patch.webp';
    optimizationStats.textContent = 'Sin imagen';

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

    renderColorsRows([]);

    (document.getElementById('p-tags') as HTMLInputElement).value = 'poc, tactical, 4g, nationwide';
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

btnNewProduct?.addEventListener('click', () => openProductModal(null));
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
  const shortName = (document.getElementById('p-shortName') as HTMLInputElement).value.trim();
  const badge = (document.getElementById('p-badge') as HTMLInputElement).value.trim();
  const stockStatus = (document.getElementById('p-stockStatus') as HTMLSelectElement).value as StockStatus;
  const stockCountVal = (document.getElementById('p-stockCount') as HTMLInputElement).value;
  const stockCount = stockCountVal ? parseInt(stockCountVal, 10) : undefined;
  const priceEstimate = (document.getElementById('p-priceEstimate') as HTMLInputElement).value.trim();
  const discountPrice = (document.getElementById('p-discountPrice') as HTMLInputElement).value.trim();
  const isVisible = (document.getElementById('p-isVisible') as HTMLInputElement).checked;
  const description = (document.getElementById('p-description') as HTMLTextAreaElement).value.trim();
  const image = pImageInput.value.trim();

  if (!id || !name || !badge || !description || !image) {
    modalError.textContent = 'Por favor completa todos los campos requeridos con asterisco (*).';
    modalError.classList.remove('hidden');
    return;
  }

  // Build comparison
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

  // Build specs
  const specRows = Array.from(specsList.querySelectorAll('.spec-row'));
  const specs = specRows
    .map((r) => {
      const label = (r.querySelector('.spec-label') as HTMLInputElement).value.trim();
      const value = (r.querySelector('.spec-value') as HTMLInputElement).value.trim();
      return label && value ? { label, value } : null;
    })
    .filter(Boolean) as { label: string; value: string }[];

  // Build colors
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

  // Build tags
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

  btnSaveProduct.disabled = true;
  btnSaveProduct.textContent = 'Guardando en Turso...';

  try {
    const isEdit = Boolean(editingProduct);
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch('/api/admin/products', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.error || 'Error al guardar el producto');
    }

    showToast(`✓ Radio ${name} guardado exitosamente en Turso DB`);
    closeProductModal();
    loadProducts();
  } catch (err: any) {
    modalError.textContent = err.message || 'Error desconocido';
    modalError.classList.remove('hidden');
  } finally {
    btnSaveProduct.disabled = false;
    btnSaveProduct.textContent = 'Guardar en Turso';
  }
});

// Delete inside modal
btnDeleteProduct?.addEventListener('click', async () => {
  if (!editingProduct) return;
  const { id, name } = editingProduct;

  if (confirm(`¿Confirmas la eliminación permanente del radio "${name}" (${id})?`)) {
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (res.ok) {
        showToast(`Radio "${name}" eliminado`);
        closeProductModal();
        loadProducts();
      } else {
        alert('No se pudo eliminar el producto');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }
});

// Download JSON Backup
downloadBackupBtn?.addEventListener('click', () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allProducts, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `gtech-products-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Respaldo JSON descargado');
});

// -------------------------------------------------------------
// INITIAL STARTUP
// -------------------------------------------------------------
if (adminToken) {
  authOverlay.classList.add('hidden');
  adminApp.classList.remove('hidden');
  loadProducts();
} else {
  authOverlay.classList.remove('hidden');
  adminApp.classList.add('hidden');
}
