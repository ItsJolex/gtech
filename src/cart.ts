import type { Product, CartItem } from './types';
import { getProductById } from './products';
import { t, getLanguage } from './i18n';

const CART_STORAGE_KEY = 'gtech_cart_v2';
const WHATSAPP_NUMBER = '+14074273356';

let cart: CartItem[] = [];
let listeners: Array<() => void> = [];
let selectedCartSimPlan: string = 'none';

function loadCart(): void {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch {
    cart = [];
  }
}

function saveCart(): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  notifyListeners();
}

function notifyListeners(): void {
  listeners.forEach(fn => fn());
}

export function initCart(): void {
  loadCart();
  renderCartDrawer();
  updateCartBadge();
}

export function subscribe(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function getCart(): CartItem[] {
  return [...cart];
}

export function getCartCount(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(productId: string, selectedColor?: string, customImage?: string): { success: boolean; message: string; fallbackProduct?: Product } {
  const product = getProductById(productId);
  
  if (!product) {
    return { success: false, message: 'Product not found' };
  }
  
  if (!product.inStock) {
    const fallbackProduct = product.fallbackSimilarId ? getProductById(product.fallbackSimilarId) : undefined;
    showOutOfStockModal(product, fallbackProduct);
    return { 
      success: false, 
      message: 'Product unavailable', 
      fallbackProduct 
    };
  }
  
  const existingItem = cart.find(item => item.id === productId && (item.selectedColor || '') === (selectedColor || ''));
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      badge: product.badge,
      image: customImage || product.image,
      quantity: 1,
      inStock: product.inStock,
      selectedColor: selectedColor || undefined
    });
  }
  
  saveCart();
  renderCartDrawer();
  updateCartBadge();
  animateCartBadge();
  
  const colorSuffix = selectedColor ? ` (${selectedColor})` : '';
  return { success: true, message: `${product.name}${colorSuffix} added to cart` };
}

export function removeFromCart(productId: string, selectedColor?: string): void {
  cart = cart.filter(item => !(item.id === productId && (item.selectedColor || '') === (selectedColor || '')));
  saveCart();
  renderCartDrawer();
  updateCartBadge();
}

export function updateQuantity(productId: string, delta: number, selectedColor?: string): void {
  const item = cart.find(i => i.id === productId && (i.selectedColor || '') === (selectedColor || ''));
  if (!item) return;
  
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId, selectedColor);
  } else {
    saveCart();
    renderCartDrawer();
    updateCartBadge();
  }
}

export function clearCart(): void {
  cart = [];
  saveCart();
  renderCartDrawer();
  updateCartBadge();
}

function updateCartBadge(): void {
  const badge = document.getElementById('cart-badge');
  const mobileBadge = document.getElementById('mobile-cart-badge');
  const count = getCartCount();
  if (badge) {
    badge.textContent = count.toString();
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  if (mobileBadge) {
    mobileBadge.textContent = count.toString();
    mobileBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function animateCartBadge(): void {
  const badge = document.getElementById('cart-badge');
  const mobileBadge = document.getElementById('mobile-cart-badge');
  if (badge) {
    badge.classList.add('animate-bounce-subtle');
    setTimeout(() => badge.classList.remove('animate-bounce-subtle'), 200);
  }
  if (mobileBadge) {
    mobileBadge.classList.add('animate-bounce-subtle');
    setTimeout(() => mobileBadge.classList.remove('animate-bounce-subtle'), 200);
  }
}

function showOutOfStockModal(product: Product, fallbackProduct?: Product): void {
  const modalOverlay = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-content');
  
  if (!modalOverlay || !modalContent) return;
  
  let fallbackHtml = '';
  if (fallbackProduct) {
    fallbackHtml = `
      <div class="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-emerald-800">${t('cart.oos_fallback_title')}</p>
            <p class="text-sm text-emerald-700 mt-1">${fallbackProduct.name} <span class="font-bold">[${fallbackProduct.badge}]</span></p>
            <p class="text-xs text-emerald-600 mt-2">${product.fallbackReason || t('cart.oos_fallback_default')}</p>
            <div class="mt-3 flex gap-2">
              <button onclick="compareProducts('${product.id}', '${fallbackProduct.id}')" class="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors">
                ${t('cart.oos_view_comparison')}
              </button>
              <button onclick="addToCart('${fallbackProduct.id}'); closeModal()" class="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300">
                ${t('cart.oos_add_this')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  modalContent.innerHTML = `
    <div class="relative">
      <button onclick="closeModal()" class="absolute -top-2 -right-2 md:top-0 md:right-0 z-30 bg-white/95 hover:bg-white text-gray-500 hover:text-navy-800 rounded-full p-2.5 shadow-md border border-gray-200 transition-all focus:outline-none" aria-label="Close modal">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-crimson-50 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-crimson-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-navy-800 mb-2">${t('cart.oos_title')}</h3>
        <p class="text-gray-600 mb-4">${product.name} <span class="font-semibold">[${product.badge}]</span> ${t('cart.oos_status')}</p>
        ${fallbackHtml}
        <div class="mt-6 pt-4 border-t border-gray-100">
          <button onclick="closeModal()" class="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-navy-800 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
            ${t('cart.oos_continue')}
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalOverlay.classList.remove('hidden');
  modalOverlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

export function renderCartDrawer(): void {
  const drawerContainer = document.getElementById('cart-drawer-container');
  if (!drawerContainer) return;
  
  const isEs = getLanguage() === 'es';

  if (cart.length === 0) {
    drawerContainer.innerHTML = `
      <div id="cart-drawer" class="fixed inset-y-0 right-0 z-[200] w-full sm:max-w-md bg-navy-900 border-l border-navy-700 shadow-2xl animate-slide-in-right flex flex-col">
        <div class="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <button onclick="closeCartDrawer()" class="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 shadow-lg backdrop-blur-sm transition-colors" aria-label="Close cart">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="flex flex-col h-full">
          <div class="p-6 border-b border-navy-700">
            <h2 class="text-xl font-bold text-white flex items-center gap-3">
              <svg class="w-6 h-6 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              ${t('cart.title')}
            </h2>
            <p class="text-navy-400 text-sm mt-1">0 ${isEs ? 'equipos seleccionados' : 'device(s) selected'}</p>
          </div>
          
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="text-center">
              <div class="w-24 h-24 mx-auto mb-4 bg-navy-800 rounded-2xl flex items-center justify-center border border-navy-700">
                <svg class="w-10 h-10 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 class="text-white font-semibold text-lg mb-2">${t('cart.empty_title')}</h3>
              <p class="text-navy-400 text-sm max-w-xs mx-auto">${t('cart.empty_desc')}</p>
              <button onclick="closeCartDrawer()" class="mt-6 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-white bg-crimson-700 hover:bg-crimson-800 transition-colors text-sm shadow-lg">
                ${t('cart.explore_btn')}
              </button>
            </div>
          </div>
          
          <div class="p-6 border-t border-navy-700 bg-navy-800/50 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div class="text-center text-navy-500 text-xs uppercase tracking-wider">${t('cart.total_units')}: 0</div>
          </div>
        </div>
      </div>
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[199] animate-fade-in" onclick="closeCartDrawer()" aria-hidden="true"></div>
    `;
    return;
  }
  
  const totalUnits = getCartCount();
  
  drawerContainer.innerHTML = `
    <div id="cart-drawer" class="fixed inset-y-0 right-0 z-[200] w-full sm:max-w-md bg-navy-900 border-l border-navy-700 shadow-2xl animate-slide-in-right flex flex-col">
      <div class="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <button onclick="closeCartDrawer()" class="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 shadow-lg backdrop-blur-sm transition-colors" aria-label="Close cart">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="flex flex-col h-full">
        <div class="p-6 border-b border-navy-700 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-3">
              <svg class="w-6 h-6 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              ${t('cart.title')}
            </h2>
            <p class="text-navy-400 text-sm mt-1">${cart.length} ${isEs ? 'modelo(s)' : 'model(s)'} • ${totalUnits} ${isEs ? 'unidad(es)' : 'unit(s)'}</p>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          ${cart.map(item => `
            <div class="bg-navy-800/50 border border-navy-700 rounded-xl p-3 flex gap-3">
              <div class="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-navy-900 rounded-lg overflow-hidden border border-navy-700 flex items-center justify-center">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
              </div>
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 class="text-white font-semibold text-sm truncate">${item.name}</h4>
                  <div class="flex items-center gap-1.5 flex-wrap mt-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-crimson-900/50 text-crimson-300 border border-crimson-800 inline-block">${item.badge}</span>
                    ${item.selectedColor ? `
                      <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-navy-950 text-amber-300 border border-amber-500/40 inline-block">Color: ${item.selectedColor}</span>
                    ` : ''}
                  </div>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-2 bg-navy-900 rounded-lg border border-navy-700 px-2 py-1">
                    <button onclick="updateCartQuantity('${item.id}', -1, '${item.selectedColor || ''}')" class="text-white hover:text-crimson-400 text-lg font-bold w-8 h-8 flex items-center justify-center rounded transition-colors" aria-label="Decrease quantity">−</button>
                    <span class="text-white font-bold text-sm w-8 text-center">${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', 1, '${item.selectedColor || ''}')" class="text-white hover:text-crimson-400 text-lg font-bold w-8 h-8 flex items-center justify-center rounded transition-colors" aria-label="Increase quantity">+</button>
                  </div>
                  <button onclick="removeFromCart('${item.id}', '${item.selectedColor || ''}')" class="text-navy-400 hover:text-crimson-400 p-1.5 transition-colors" aria-label="Remove from cart">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="p-6 border-t border-navy-700 bg-navy-800/50 space-y-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <!-- Optional SIM Plan Selection in Cart -->
          <div class="bg-navy-900/90 border border-navy-700/80 rounded-xl p-3">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><rect x="8" y="10" width="8" height="8" rx="1"/><path d="M12 10v8M8 14h8"/></svg>
                ${isEs ? 'Tarjeta SIM de Cobertura Anual' : 'Annual SIM Coverage Card'}
              </span>
              <span class="text-[10px] text-gray-400 font-medium">${isEs ? 'Opcional' : 'Optional'}</span>
            </div>
            <select onchange="window.setCartSimPlan(this.value)" class="w-full bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500">
              <option value="none" ${selectedCartSimPlan === 'none' ? 'selected' : ''}>${isEs ? 'Ninguna (Solo Equipos)' : 'None (Hardware Only)'}</option>
              <option value="us_can_mex" ${selectedCartSimPlan === 'us_can_mex' ? 'selected' : ''}>🇺🇸 🇨🇦 🇲🇽 USA, Canadá, México (+$30/año por radio)</option>
              <option value="brazil" ${selectedCartSimPlan === 'brazil' ? 'selected' : ''}>🇧🇷 Brasil (+$45/año por radio)</option>
              <option value="latam" ${selectedCartSimPlan === 'latam' ? 'selected' : ''}>🌎 Latín América (+$45/año por radio)</option>
              <option value="europe" ${selectedCartSimPlan === 'europe' ? 'selected' : ''}>🇪🇺 Europa (+$50/año por radio)</option>
              <option value="global" ${selectedCartSimPlan === 'global' ? 'selected' : ''}>🌐 Global Multi (+$50/año por radio)</option>
            </select>
          </div>

          <div class="flex items-center justify-between text-white">
            <span class="text-sm font-medium">${t('cart.total_units')}</span>
            <span class="text-lg font-bold text-crimson-400">${totalUnits}</span>
          </div>
          <button onclick="generateWhatsAppMessage()" class="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ${t('cart.request_btn')}
          </button>
          <button onclick="clearCart()" class="w-full py-3 rounded-xl font-medium uppercase tracking-wider text-navy-300 bg-navy-700 hover:bg-navy-600 transition-colors">
            ${t('cart.clear_btn')}
          </button>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[199] animate-fade-in" onclick="closeCartDrawer()" aria-hidden="true"></div>
  `;
}

export function openCartDrawer(): void {
  (window as any).closeModal?.();
  const drawerContainer = document.getElementById('cart-drawer-container');
  if (drawerContainer) {
    renderCartDrawer();
    drawerContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCartDrawer(): void {
  const drawerContainer = document.getElementById('cart-drawer-container');
  if (drawerContainer) {
    drawerContainer.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

export function updateCartQuantity(productId: string, delta: number, selectedColor?: string): void {
  updateQuantity(productId, delta, selectedColor || undefined);
}

export function generateWhatsAppMessage(): void {
  if (cart.length === 0) return;

  const totalUnits = getCartCount();
  const isEs = getLanguage() === 'es';
  const dateStr = new Date().toLocaleDateString(isEs ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const lines = isEs ? [
    `*G-TECH.US | SOLICITUD FORMAL DE COTIZACIÓN*`,
    '-----------------------------------------',
    `Fecha: ${dateStr}`,
    'Hola Geramel / Ventas Técnicas G-TECH, solicito cotización formal y disponibilidad para los siguientes equipos:',
    ''
  ] : [
    `*G-TECH.US | FORMAL QUOTATION REQUEST*`,
    '-----------------------------------------',
    `Date: ${dateStr}`,
    'Hello G-TECH Technical Sales, please provide stock availability and pricing for the following equipment:',
    ''
  ];

  cart.forEach(item => {
    const colorSuffix = item.selectedColor ? ` (Color: ${item.selectedColor})` : '';
    lines.push(`• *${item.quantity}x* ${item.name}${colorSuffix} [${item.badge}]`);
  });

  if (selectedCartSimPlan !== 'none') {
    const planNames: Record<string, { es: string; en: string }> = {
      us_can_mex: { es: 'United States, Canadá, México ($30/año por radio)', en: 'United States, Canada, Mexico ($30/yr per radio)' },
      brazil: { es: 'Brasil ($45/año por radio)', en: 'Brazil ($45/yr per radio)' },
      latam: { es: 'Latín América ($45/año por radio)', en: 'Latin America ($45/yr per radio)' },
      europe: { es: 'Europa ($50/año por radio)', en: 'Europe ($50/yr per radio)' },
      global: { es: 'Global Multi ($50/año por radio)', en: 'Global Multi ($50/yr per radio)' }
    };
    const chosen = planNames[selectedCartSimPlan];
    if (chosen) {
      lines.push(isEs ? `• *Tarjetas SIM Anuales Solicitadas:* ${totalUnits}x [${chosen.es}]` : `• *Annual SIM Cards Requested:* ${totalUnits}x [${chosen.en}]`);
    }
  }

  lines.push('');
  lines.push(isEs ? `*Total de Equipos:* ${totalUnits} unidad(es)` : `*Total Units:* ${totalUnits} device(s)`);
  lines.push(isEs ? '*Destino de Entrega:* [Por favor indique Ciudad / Estado / País]' : '*Delivery Destination:* [Please specify City / State]');
  lines.push('-----------------------------------------');
  lines.push(isEs ? 'Enviado desde el Portal Táctico G-TECH.US (🐺 G tech)' : 'Sent via G-TECH.US Tactical Portal (🐺 G tech)');

  const message = lines.join('\n');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;

  window.open(url, '_blank');
}

export function setCartSimPlan(planId: string): void {
  selectedCartSimPlan = planId;
}

(window as any).setCartSimPlan = (planId: string) => setCartSimPlan(planId);
(window as any).addToCart = (id: string, color?: string, img?: string) => addToCart(id, color, img);
(window as any).removeFromCart = (id: string, color?: string) => removeFromCart(id, color);
(window as any).updateCartQuantity = (id: string, delta: number, color?: string) => updateQuantity(id, delta, color);
(window as any).clearCart = () => clearCart();
(window as any).openCartDrawer = () => openCartDrawer();
(window as any).closeCartDrawer = () => closeCartDrawer();
(window as any).generateWhatsAppMessage = () => generateWhatsAppMessage();