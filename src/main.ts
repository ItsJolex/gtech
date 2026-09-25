import productsData from '../products.json';
import type { Product } from './types';
import { initCart, openCartDrawer, closeCartDrawer, addToCart, subscribe as subscribeCart, renderCartDrawer } from './cart';
import { initComparison } from './comparison';
import { initFinder, resetFinder } from './finder';
import { initI18n, getLanguage, toggleLanguage, t, tSpecLabel, onLanguageChange, getLocalizedProduct } from './i18n';
import { initLegalModule, openLegalModal } from './legal';

function buildDeepSpecsHTML(p: Product, fromModal: boolean = false): string {
  const lang = getLanguage();
  const localized = getLocalizedProduct(p);

  const stockBadge = !p.inStock
    ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-100 text-crimson-800 text-xs font-bold uppercase tracking-wider">${t('catalog.sold_out')}</span>`
    : p.stockStatus === 'low_stock'
      ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">${t('catalog.low_stock')}</span>`
      : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">${t('catalog.in_stock')}</span>`;

  const waInquiryMsg = lang === 'es'
    ? `Hola G-TECH, solicito la ficha técnica oficial y disponibilidad del equipo ${encodeURIComponent(localized.name)}`
    : `Hello G-TECH, I'm inquiring about technical specs for the ${encodeURIComponent(localized.name)}`;

  return `
    <div class="relative ${fromModal ? 'animate-deep-specs-in' : 'animate-fade-in'}">
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          ${fromModal ? `
            <button onclick="window.openModal('${p.id}')" class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-800 hover:text-crimson-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              ${t('catalog.back_to_overview')}
            </button>
          ` : `
            <span class="text-xs font-extrabold uppercase tracking-widest text-crimson-700 bg-crimson-50 px-2.5 py-1 rounded-md border border-crimson-100">
              ${t('catalog.view_dossier')}
            </span>
          `}
          <span class="text-xs text-gray-500 font-medium">${t('catalog.model_id')}: ${p.id}</span>
        </div>

        <button onclick="closeModal()" class="text-gray-400 hover:text-navy-900 p-1.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- IMAGE AT THE TOP -->
      <div id="deep-specs-top-hero" class="w-full max-w-sm mx-auto aspect-square bg-navy-950/10 rounded-2xl flex items-center justify-center border border-gray-200/80 relative mb-6 shadow-sm overflow-hidden group">
        <img src="${p.image}" alt="${localized.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">

        <div class="absolute top-2 left-2 flex items-center gap-1.5">
          <span class="bg-navy-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            ${localized.badge}
          </span>
          ${stockBadge}
        </div>

        <!-- SIM Quick Action Button in Deep Hero -->
        <button onclick="window.openSimPricingModal('${p.id}')"
                class="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center sm:gap-1.5 transition-all hover:scale-105 text-xs font-bold text-emerald-300"
                title="${t('catalog.sim_rates')}" aria-label="SIM Coverage Rates">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><rect x="8" y="10" width="8" height="8" rx="1"/><path d="M12 10v8M8 14h8"/></svg>
          <span class="hidden sm:inline">${t('catalog.sim_rates')}</span>
        </button>
      </div>

      <!-- PRODUCT TITLE & BRIEF -->
      <div class="text-center max-w-2xl mx-auto mb-6">
        <h2 class="text-xl sm:text-2xl font-black text-navy-900 tracking-tight mb-2">${localized.name}</h2>
        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">${localized.description}</p>
      </div>

      <!-- EXTENSIVE SPECIFICATIONS DOSSIER -->
      <div class="space-y-4 mb-6">
        <!-- Section 1: Radio Frequency & Network Connectivity -->
        <div class="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-crimson-600"></span>
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-navy-900">${t('modal.rf_title')}</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Telemetría de Red' : 'Network Telemetry'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.connectivity}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Sistema de Antenas' : 'Antenna Port System'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.antenna}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'SIM y Cifrado' : 'SIM & Encryption'}</span>
              <span class="text-xs sm:text-sm font-bold text-emerald-700">Multi-IMSI 4G / AES-256 Voice</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Audio, Keypad & Dispatch Controls -->
        <div class="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-navy-900">${t('modal.audio_title')}</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Potencia Acústica' : 'Speaker Output Pressure'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.audioOutput}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Interfaz y Teclado' : 'Interface & Keypad'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.controls}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Protocolo de Emergencia' : 'Emergency Protocol'}</span>
              <span class="text-xs sm:text-sm font-bold text-crimson-700">${p.comparison.emergency}</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Battery Runtime, Form Factor & Rugged Durability -->
        <div class="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-navy-900">${t('modal.durability_title')}</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Autonomía de Batería' : 'Shift Battery Endurance'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.batteryRuntime}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Protección y Grado IP' : 'Ingress & Durability Rating'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.protection}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Factor de Forma' : 'Chassis Form Factor'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.formFactor}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Óptica y Sensor de Video' : 'Optics & Video Sensor'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.videoVision}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${lang === 'es' ? 'Homologaciones' : 'Regulatory Approvals'}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">${p.comparison.certifications}</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <span class="block text-[11px] font-semibold text-gray-400 uppercase">${t('catalog.operating_temp')}</span>
              <span class="text-xs sm:text-sm font-bold text-navy-900">-20°C to +60°C (-4°F to 140°F)</span>
            </div>
          </div>
        </div>

        <!-- Section 4: Granular Hardware Specs Matrix -->
        <div class="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5">
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-navy-900 mb-3">${t('modal.specs_title')}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${p.specs.map(s => `
              <div class="flex items-center justify-between gap-3 bg-white px-3.5 py-2.5 rounded-lg border border-gray-100 text-xs">
                <span class="text-gray-500 font-medium flex-shrink-0">${tSpecLabel(s.label)}</span>
                <span class="font-bold text-navy-800 text-right break-words">${s.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Sticky Action Footer -->
      <div class="pt-4 border-t border-gray-100 space-y-2.5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button onclick="${!p.inStock ? `showOutOfStockFallback('${p.id}')` : `addToCart('${p.id}'); closeModal(); openCartDrawer()`}"
                  class="w-full px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-white ${!p.inStock ? 'bg-crimson-700 hover:bg-crimson-800' : 'bg-crimson-800 hover:bg-crimson-900'} transition-all text-center flex items-center justify-center gap-2 text-xs shadow-md hover:shadow-lg whitespace-nowrap tactical-glow-crimson"
                  title="${!p.inStock ? t('catalog.alternative') : t('catalog.add_to_quotation')}">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="truncate">${!p.inStock ? t('catalog.alternative') : t('catalog.add_to_quotation')}</span>
          </button>
          <a href="https://wa.me/14074273356?text=${waInquiryMsg}"
             target="_blank"
             class="w-full px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-green-500 hover:bg-green-600 transition-all text-center flex items-center justify-center gap-2 text-xs shadow-md hover:shadow-lg whitespace-nowrap"
             title="${t('catalog.whatsapp_inquiry')}">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span class="truncate">${t('catalog.whatsapp_inquiry')}</span>
          </a>
        </div>
        <button onclick="closeModal()" class="w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-gray-500 hover:text-navy-900 bg-gray-100 hover:bg-gray-200 transition-colors text-xs text-center">
          ${t('catalog.close_dossier')}
        </button>
      </div>
    </div>
  `;
}

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIconBars = document.getElementById('menu-icon-bars');
const menuIconClose = document.getElementById('menu-icon-close');

function setMobileMenu(open: boolean) {
  if (!mobileMenu) return;
  if (open) {
    mobileMenu.classList.remove('hidden');
    menuIconBars?.classList.add('hidden');
    menuIconClose?.classList.remove('hidden');
  } else {
    mobileMenu.classList.add('hidden');
    menuIconBars?.classList.remove('hidden');
    menuIconClose?.classList.add('hidden');
  }
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isClosed = mobileMenu.classList.contains('hidden');
    setMobileMenu(isClosed);
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMobileMenu(false);
    });
  });
}

const catalogContainer = document.getElementById('catalog-grid');
const modalOverlay = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');
const cartBtn = document.getElementById('cart-btn');
const mobileCartBtn = document.getElementById('mobile-cart-btn');

function renderCatalog(): void {
  if (!catalogContainer) return;
  const lang = getLanguage();

  catalogContainer.innerHTML = productsData.map(product => {
    const localized = getLocalizedProduct(product);
    const waQuoteText = lang === 'es'
      ? `Hola G-TECH, me interesa cotizar el equipo táctico ${encodeURIComponent(localized.name)}`
      : `Hello G-TECH, I'm interested in the ${encodeURIComponent(localized.name)}`;

    return `
      <div class="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-sm hover:shadow-md border border-gray-100 flex flex-col relative group cursor-pointer transition-all duration-200 card-hardware-accel" onclick="openModal('${product.id}')">

        <div class="aspect-square bg-navy-950/10 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 relative overflow-hidden flex items-center justify-center border border-gray-200/70 group/cardimg shadow-xs">
          <img src="${product.image}" alt="${localized.name}" class="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-300" loading="lazy">

          <!-- Top Badges Header -->
          <div class="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            <span class="bg-navy-900/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-tight truncate max-w-[65%] sm:max-w-[70%]">
              ${localized.badge}
            </span>
            ${product.stockStatus === 'low_stock' && product.inStock ? `
              <span class="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider shadow flex-shrink-0">${t('catalog.low_stock')}</span>
            ` : ''}
          </div>

          ${!product.inStock ? `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span class="bg-crimson-800 text-white px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow">${t('catalog.sold_out')}</span>
            </div>
          ` : ''}

          <!-- BOTTOM-LEFT: Cellular SIM Pricing Button -->
          <button onclick="event.stopPropagation(); window.openSimPricingModal('${product.id}')"
                  class="absolute bottom-2 left-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-sm border border-white/20 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group/sim"
                  title="${t('catalog.sim_rates')}"
                  aria-label="View SIM pricing">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover/sim:text-emerald-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
              <rect x="8" y="10" width="8" height="8" rx="1"/>
              <path d="M12 10v8M8 14h8"/>
            </svg>
          </button>

          <!-- BOTTOM-RIGHT: Deep-Dive Technical Specs Button -->
          <button onclick="event.stopPropagation(); window.openDeepDiveModal('${product.id}', 'from_catalog')"
                  class="absolute bottom-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-sm border border-white/20 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group/spec"
                  title="${t('catalog.full_specs')}"
                  aria-label="View detailed specifications">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover/spec:text-amber-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>

        <h3 class="text-xs sm:text-base font-bold text-navy-800 line-clamp-2 leading-snug mb-1 min-h-[2.4rem] sm:min-h-[2.5rem]" title="${localized.name}">
          ${localized.name}
        </h3>

        <p class="hidden sm:block text-gray-500 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
          ${localized.description}
        </p>

        <div class="sm:hidden mb-2 text-[10px] text-gray-500 truncate">
          <span class="text-navy-700 font-semibold">${product.specs?.[0]?.value || '4G LTE PoC'}</span>
        </div>

        <div class="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-100">
          <button onclick="event.stopPropagation(); addToCart('${product.id}')"
                  class="flex-1 py-1.5 px-2 bg-crimson-800 hover:bg-crimson-900 text-white rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                  title="${t('catalog.quote_btn')}" aria-label="Add to quotation">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span class="truncate">${t('catalog.quote_btn')}</span>
          </button>

          <a href="https://wa.me/14074273356?text=${waQuoteText}"
             target="_blank" onclick="event.stopPropagation()"
             class="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95"
             title="${t('catalog.whatsapp_direct')}" aria-label="Inquire via WhatsApp">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>

      </div>
    `;
  }).join('');
}

function updateStaticTranslations(): void {
  const lang = getLanguage();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  const desktopToggle = document.getElementById('lang-toggle-desktop');
  const mobileToggle = document.getElementById('lang-toggle-mobile');

  if (desktopToggle) {
    desktopToggle.setAttribute('data-lang', lang);
  }
  if (mobileToggle) {
    mobileToggle.setAttribute('data-lang', lang);
  }

  const switchLabel = lang === 'en' ? 'Cambiar a Español' : 'Switch to English';
  document.querySelectorAll('.lang-toggle-label').forEach((el) => {
    el.textContent = switchLabel;
  });
}

if (modalOverlay && modalContent) {
  (window as any).openModal = (id: string) => {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    const lang = getLanguage();
    const localized = getLocalizedProduct(p);

    const stockBadge = !p.inStock
      ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-100 text-crimson-800 text-xs font-bold uppercase tracking-wider"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ${t('catalog.sold_out')}</span>`
      : p.stockStatus === 'low_stock'
        ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ${t('catalog.low_stock')}</span>`
        : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${t('catalog.in_stock')}</span>`;

    const waModalMsg = lang === 'es'
      ? `Hola G-TECH, deseo cotizar formalmente el equipo ${encodeURIComponent(localized.name)}`
      : `Hello G-TECH, I'm interested in requesting a quote for ${encodeURIComponent(localized.name)}`;

    modalContent.innerHTML = `
      <div class="relative">
        <button onclick="closeModal()" class="absolute -top-2 -right-2 md:top-0 md:right-0 z-30 bg-white/95 hover:bg-white text-gray-500 hover:text-navy-800 rounded-full p-2.5 shadow-md border border-gray-200 transition-all focus:outline-none" aria-label="Close modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div id="modal-product-img-wrapper" class="w-full md:w-1/2 aspect-square max-w-sm md:max-w-none mx-auto bg-navy-950/10 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200/80 relative group/modalphoto shadow-sm flex-shrink-0">
            <img id="modal-product-img" src="${p.image}" alt="${localized.name}" class="w-full h-full object-cover rounded-2xl transition-transform duration-300">
            ${!p.inStock ? `
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <span class="bg-crimson-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-lg shadow-xl">${t('catalog.sold_out')}</span>
              </div>
            ` : ''}

            <!-- BOTTOM-LEFT: SIM Rates Overlay Button Inside Modal -->
            <button onclick="window.openSimPricingModal('${p.id}')"
                    class="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center sm:gap-1.5 transition-all hover:scale-105 active:scale-95 group/msim"
                    title="${t('catalog.sim_rates')}" aria-label="SIM Plans">
              <svg class="w-4 h-4 text-emerald-400 group-hover/msim:text-emerald-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
                <rect x="8" y="10" width="8" height="8" rx="1"/>
                <path d="M12 10v8M8 14h8"/>
              </svg>
              <span class="hidden sm:inline text-[11px] font-bold tracking-wider uppercase text-emerald-300">${t('catalog.sim_plans')}</span>
            </button>

            <!-- BOTTOM-RIGHT: Deep Specs Button Inside Modal -->
            <button onclick="window.transitionToDeepDive('${p.id}')"
                    class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center sm:gap-1.5 transition-all hover:scale-105 active:scale-95 group/mspec"
                    title="${t('catalog.full_specs')}" aria-label="Full Technical Specs">
              <svg class="w-4 h-4 text-amber-300 group-hover/mspec:text-amber-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span class="hidden sm:inline text-[11px] font-bold tracking-wider uppercase text-amber-200">${t('catalog.full_specs')}</span>
            </button>
          </div>

          <div id="modal-product-summary" class="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <div class="pr-8 mb-2 flex items-center gap-3 flex-wrap">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-navy-800 leading-tight">${localized.name}</h2>
                ${stockBadge}
              </div>
              <div class="mb-4">
                <span class="inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-crimson-50 text-crimson-800 border border-crimson-100">${localized.badge}</span>
              </div>
              <p class="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">${localized.description}</p>
              
              <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">${t('catalog.view_dossier')}</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  ${p.specs.map(s => `
                    <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <span class="block text-xs text-gray-500 mb-0.5">${tSpecLabel(s.label)}</span>
                      <span class="block text-sm font-bold text-navy-800 break-words">${s.value}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Annual SIM Plan Indicator Banner -->
              <div class="mb-4 p-3 bg-emerald-50/80 hover:bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors" onclick="window.openSimPricingModal('${p.id}')">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-xl flex-shrink-0">📡</span>
                  <div class="min-w-0">
                    <span class="block text-xs font-bold text-emerald-900 truncate">${lang === 'es' ? 'Planes SIM PoC Anuales Disponibles' : 'Annual PoC SIM Plans Available'}</span>
                    <span class="block text-[11px] text-emerald-700 truncate font-medium">USA/CAN/MEX $30 • LatAm $45 • Europa $50 • Global $50 al año</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-emerald-800 underline flex-shrink-0 whitespace-nowrap">${lang === 'es' ? 'Ver Tarifas →' : 'View Rates →'}</span>
              </div>
            </div>
            
            <div class="pt-4 border-t border-gray-100 space-y-2">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <button onclick="${!p.inStock ? `showOutOfStockFallback('${p.id}')` : `addToCart('${p.id}'); closeModal(); openCartDrawer()`}"
                        class="w-full px-3 sm:px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-white ${!p.inStock ? 'bg-crimson-700 hover:bg-crimson-800' : 'bg-crimson-800 hover:bg-crimson-900'} transition-all text-center flex items-center justify-center gap-2 text-xs shadow-md hover:shadow-lg tactical-glow-crimson active:scale-95"
                        title="${!p.inStock ? t('catalog.alternative') : t('catalog.add_to_quotation')}">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  <span>${!p.inStock ? t('catalog.alternative') : t('catalog.add_to_quotation')}</span>
                </button>
                <a href="https://wa.me/14074273356?text=${waModalMsg}"
                   target="_blank"
                   class="w-full px-3 sm:px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-green-500 hover:bg-green-600 transition-all text-center flex items-center justify-center gap-2 text-xs shadow-md hover:shadow-lg active:scale-95"
                   title="${t('catalog.whatsapp_direct')}">
                  <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>${t('catalog.whatsapp_direct')}</span>
                </a>
              </div>
              <button onclick="closeModal()" class="w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-gray-500 hover:text-navy-900 bg-gray-100 hover:bg-gray-200 transition-colors text-xs text-center">
                ${t('catalog.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    closeCartDrawer();
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  (window as any).closeModal = () => {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
    document.body.style.overflow = '';
  };
  
  (window as any).showOutOfStockFallback = (id: string) => {
    const p = productsData.find(x => x.id === id);
    if (!p || !p.fallbackSimilarId) return;
    (window as any).closeModal();
    const fallback = productsData.find(x => x.id === p.fallbackSimilarId);
    if (fallback) {
      const event = new CustomEvent('compare-products', { detail: { id1: p.id, id2: fallback.id } });
      window.dispatchEvent(event);
    }
  };

  (window as any).openSimPricingModal = (productId?: string) => {
    const product = productId ? productsData.find(p => p.id === productId) : null;
    const lang = getLanguage();
    const isEs = lang === 'es';
    const localized = product ? getLocalizedProduct(product) : null;

    let selectedPlanId = 'us_can_mex';

    const plans = [
      {
        id: 'us_can_mex',
        flag: '🇺🇸 🇨🇦 🇲🇽',
        name: isEs ? 'United States, Canadá, México' : 'United States, Canada, Mexico',
        carriers: isEs ? 'Tier-1 Multi-Red: AT&T, T-Mobile, Verizon, Rogers, Telcel' : 'Tier-1 Multi-Carrier: AT&T, T-Mobile, Verizon, Rogers, Telcel',
        price: '$30',
        period: isEs ? 'al año' : '/year',
        equiv: isEs ? 'Tarifa plana oficial (~$2.50/mes)' : 'Official flat rate (~$2.50/mo)',
        badge: isEs ? 'Norteamérica Oficial' : 'Official North America'
      },
      {
        id: 'latam',
        flag: '🌎',
        name: isEs ? 'Latín América' : 'Latin America',
        carriers: isEs ? 'Multi-Operador: Claro, Movistar, Tigo, Entel, Personal & Digitel' : 'Multi-Carrier: Claro, Movistar, Tigo, Entel, Personal & Digitel',
        price: '$45',
        period: isEs ? 'al año' : '/year',
        equiv: isEs ? 'Tarifa plana oficial (~$3.75/mes)' : 'Official flat rate (~$3.75/mo)',
        badge: isEs ? 'Pan-Regional' : 'Pan-Regional'
      },
      {
        id: 'europe',
        flag: '🇪🇺 🇬🇧',
        name: isEs ? 'Europa' : 'Europe',
        carriers: isEs ? 'Roaming Completo UE/UK: Vodafone, Orange, Telefónica, O2' : 'Full EU/UK Roaming: Vodafone, Orange, Telefónica, O2',
        price: '$50',
        period: isEs ? 'al año' : '/year',
        equiv: isEs ? 'Tarifa plana oficial (~$4.16/mes)' : 'Official flat rate (~$4.16/mo)',
        badge: isEs ? 'Pan-Europeo' : 'Pan-European'
      },
      {
        id: 'global',
        flag: '🌐',
        name: isEs ? 'Global Multi' : 'Global Multi-Carrier',
        carriers: isEs ? 'Multi-IMSI Autónomo en más de 160 países' : 'Autonomous Multi-IMSI across 160+ countries',
        price: '$50',
        period: isEs ? 'al año' : '/year',
        equiv: isEs ? 'Tarifa plana oficial (~$4.16/mes)' : 'Official flat rate (~$4.16/mo)',
        badge: isEs ? 'Mundial 160+ Países' : 'Worldwide 160+ Countries'
      }
    ];

    const renderModalBody = () => {
      const activePlan = plans.find(p => p.id === selectedPlanId) || plans[0];
      const hardwareText = localized
        ? (isEs ? `el equipo táctico ${localized.name}` : `the tactical radio ${localized.name}`)
        : (isEs ? `equipos tácticos PoC` : `tactical PoC radios`);

      const waMsg = isEs
        ? `Hola G-TECH, deseo cotizar ${hardwareText} con el Plan SIM Anual de ${activePlan.name} (${activePlan.price} al año).`
        : `Hello G-TECH, I would like to inquire about ${hardwareText} with the ${activePlan.name} Annual SIM Plan (${activePlan.price}/year).`;

      modalContent.innerHTML = `
        <div class="relative">
          <button onclick="closeModal()" class="absolute -top-2 -right-2 md:top-0 md:right-0 z-30 bg-white/95 hover:bg-white text-gray-500 hover:text-navy-800 rounded-full p-2.5 shadow-md border border-gray-200 transition-all focus:outline-none" aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><rect x="8" y="10" width="8" height="8" rx="1"/><path d="M12 10v8M8 14h8"/></svg>
            </div>
            <div>
              <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest block">${t('catalog.sim_iot_telemetry')}</span>
              <h2 class="text-xl sm:text-2xl font-extrabold text-navy-800">${t('catalog.sim_headline')}</h2>
            </div>
          </div>

          <p class="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
            ${t('catalog.sim_lead')}
          </p>

          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">${t('catalog.sim_select_prompt')}</span>
            <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">${activePlan.name} • ${activePlan.price} ${activePlan.period}</span>
          </div>

          <!-- Multi-Country Rates Table (Interactive Selection) -->
          <div class="space-y-2.5 mb-6">
            ${plans.map(plan => {
              const isSelected = plan.id === selectedPlanId;
              return `
                <div onclick="window.selectSimPlan('${plan.id}')"
                     class="cursor-pointer border rounded-2xl p-3.5 sm:p-4 flex items-center justify-between transition-all ${
                       isSelected
                         ? 'bg-emerald-50/60 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                         : 'bg-white hover:bg-gray-50/80 border-gray-200/80'
                     }">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-2xl flex-shrink-0">${plan.flag}</span>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="text-sm font-bold text-navy-800">${plan.name}</h4>
                        <span class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-200/60 text-emerald-900 font-bold' : 'bg-gray-100 text-gray-600'
                        }">${plan.badge}</span>
                      </div>
                      <p class="text-[11px] text-gray-500 truncate">${plan.carriers}</p>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 pl-3">
                    <span class="text-lg sm:text-xl font-extrabold text-navy-900">${plan.price}</span>
                    <span class="text-xs font-bold text-gray-500 block leading-tight">${plan.period}</span>
                    <span class="block text-[10px] text-emerald-600 font-semibold mt-0.5">${plan.equiv}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- SIM Features Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] mb-6 text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('catalog.feat_activation')}</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('catalog.feat_aes')}</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('catalog.feat_apn')}</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('catalog.feat_carrier')}</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('catalog.feat_airtime')}</span>
            <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('catalog.feat_cancel')}</span>
          </div>

          <!-- Action Footer -->
          <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button onclick="closeModal()" class="w-full sm:w-auto px-6 py-3 rounded-full font-bold uppercase tracking-wider text-navy-800 bg-gray-100 hover:bg-gray-200 transition-colors text-xs text-center">
              ${t('catalog.close')}
            </button>
            <a href="https://wa.me/14074273356?text=${encodeURIComponent(waMsg)}"
               target="_blank"
               class="w-full sm:flex-1 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-white bg-crimson-800 hover:bg-crimson-900 transition-all text-center flex items-center justify-center gap-2 text-xs shadow-md hover:shadow-lg whitespace-nowrap active:scale-95">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              ${t('catalog.inquire_sim_whatsapp')}
            </a>
          </div>
        </div>
      `;
    };

    (window as any).selectSimPlan = (planId: string) => {
      selectedPlanId = planId;
      renderModalBody();
    };

    renderModalBody();
    closeCartDrawer();
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  (window as any).openDeepDiveModal = (productId: string, source: 'from_catalog' | 'from_modal' = 'from_catalog') => {
    const p = productsData.find(x => x.id === productId);
    if (!p) return;

    closeCartDrawer();
    modalContent.innerHTML = buildDeepSpecsHTML(p as Product, source === 'from_modal');
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  (window as any).transitionToDeepDive = (productId: string) => {
    const p = productsData.find(x => x.id === productId);
    if (!p) return;

    const imgWrapper = document.getElementById('modal-product-img-wrapper');
    const summaryCol = document.getElementById('modal-product-summary');

    if (imgWrapper && summaryCol) {
      summaryCol.style.transition = 'all 220ms ease-out';
      summaryCol.style.opacity = '0';
      summaryCol.style.transform = 'translateY(16px)';
      imgWrapper.classList.add('animate-photo-morph');

      setTimeout(() => {
        modalContent.innerHTML = buildDeepSpecsHTML(p as Product, true);
      }, 220);
    } else {
      modalContent.innerHTML = buildDeepSpecsHTML(p as Product, true);
    }
  };

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      (window as any).closeModal();
    }
  });
}

if (cartBtn) {
  cartBtn.addEventListener('click', () => openCartDrawer());
}

if (mobileCartBtn) {
  mobileCartBtn.addEventListener('click', () => {
    openCartDrawer();
    mobileMenu?.classList.add('hidden');
  });
}

subscribeCart(() => {
  const badge = document.getElementById('cart-badge');
  const mobileBadge = document.getElementById('mobile-cart-badge');
  const count = productsData.length > 0 ? 
    JSON.parse(localStorage.getItem('gtech_cart_v2') || '[]').reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;
  
  if (badge) {
    badge.textContent = count.toString();
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  if (mobileBadge) {
    mobileBadge.textContent = count.toString();
    mobileBadge.style.display = count > 0 ? 'flex' : 'none';
  }
});

// Wire Language Toggle Buttons
const desktopToggle = document.getElementById('lang-toggle-desktop');
const mobileToggle = document.getElementById('lang-toggle-mobile');

desktopToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  toggleLanguage();
});

mobileToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  toggleLanguage();
});

// Subscribe to Language Changes
onLanguageChange(() => {
  updateStaticTranslations();
  renderCatalog();
  renderCartDrawer();
});

// Initialize Systems
initI18n();
updateStaticTranslations();
renderCatalog();
initCart();
initComparison();
initFinder();
initLegalModule();

// Global Window Bindings
(window as any).addToCart = (id: string) => addToCart(id);
(window as any).openCartDrawer = () => openCartDrawer();
(window as any).closeCartDrawer = () => closeCartDrawer();
(window as any).resetFinder = () => resetFinder();
(window as any).openLegalModal = (type: any) => openLegalModal(type);