import type { CartItem } from './types';
import accessoriesData from './accessories.json';
import { initCart, addCartItem, openCartDrawer } from './cart';
import { initI18n, getLanguage, t, onLanguageChange, toggleLanguage } from './i18n';

type AccessoryCategory = 'microphones' | 'earphones';
type AccessoryFilter = 'all' | AccessoryCategory;

interface AccessorySpec {
  label: string;
  labelEs: string;
  value: string;
}

interface Accessory {
  id: string;
  name: string;
  nameEs: string;
  category: AccessoryCategory;
  badge: string;
  badgeEs: string;
  image: string;
  secondaryImage?: string;
  description: string;
  descriptionEs: string;
  connector: string;
  connectorEs?: string;
  compatibility: string[];
  specs: AccessorySpec[];
  inStock: boolean;
  priceEstimate?: string;
}

const accessories: Accessory[] = accessoriesData as Accessory[];

const WHATSAPP_NUMBER = '14074273356';

const grid = document.getElementById('accessories-grid');
const filterBar = document.getElementById('accessory-filters');
const resultCount = document.getElementById('accessory-result-count');
const modal = document.getElementById('accessory-modal');
const modalContent = document.getElementById('accessory-modal-content');

let activeFilter: AccessoryFilter = 'all';

function isEs(): boolean {
  return getLanguage() === 'es';
}

function localizedName(a: Accessory): string {
  return isEs() ? a.nameEs : a.name;
}

function localizedBadge(a: Accessory): string {
  return isEs() ? a.badgeEs : a.badge;
}

function localizedDescription(a: Accessory): string {
  return isEs() ? a.descriptionEs : a.description;
}

function localizedConnector(a: Accessory): string {
  return isEs() && a.connectorEs ? a.connectorEs : a.connector;
}

function localizedSpecLabel(s: AccessorySpec): string {
  return isEs() ? s.labelEs : s.label;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function whatsappInquiryLink(a: Accessory): string {
  const message = isEs()
    ? `Hola G-TECH, me interesa el accesorio "${a.nameEs}" (${a.connectorEs || a.connector}). ¿Tienen disponibilidad y precio?`
    : `Hello G-TECH, I am interested in the "${a.name}" accessory (${a.connector}). Is it available and at what price?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function addAccessoryToQuote(a: Accessory): void {
  const item: CartItem = {
    id: a.id,
    name: `${localizedName(a)}`,
    badge: `${localizedConnector(a)}`,
    image: a.image,
    quantity: 1,
    inStock: a.inStock
  };
  addCartItem(item);
  openCartDrawer();
}

function closeModal(): void {
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function openSpecsModal(a: Accessory): void {
  if (!modal || !modalContent) return;

  const specsRows = a.specs
    .map(
      (s) => `
      <tr class="border-b border-gray-100 last:border-0">
        <td class="py-2.5 pr-4 text-xs font-bold uppercase tracking-wider text-gray-500 align-top">${escapeHtml(localizedSpecLabel(s))}</td>
        <td class="py-2.5 text-sm font-semibold text-navy-800">${escapeHtml(s.value)}</td>
      </tr>`
    )
    .join('');

  const compatPills = a.compatibility
    .map(
      (c) =>
        `<span class="inline-block px-2 py-0.5 rounded-md bg-navy-50 border border-navy-100 text-[11px] font-semibold text-navy-800">${escapeHtml(c)}</span>`
    )
    .join('');

  const secondaryBlock = a.secondaryImage
    ? `
      <div class="mt-6">
        <p class="text-[10px] font-bold uppercase tracking-widest text-crimson-700 mb-2">${escapeHtml(t('accessories_page.specs_secondary'))}</p>
        <a href="${escapeHtml(a.secondaryImage)}" target="_blank" rel="noopener noreferrer" class="block border border-gray-200 rounded-xl overflow-hidden hover:border-crimson-400 transition-colors">
          <img src="${escapeHtml(a.secondaryImage)}" alt="${escapeHtml(localizedName(a))}" class="w-full h-auto object-contain bg-white" loading="lazy">
        </a>
      </div>`
    : '';

  modalContent.innerHTML = `
    <div class="relative">
      <button type="button" data-accessory-modal-close class="absolute -top-2 -right-2 md:top-0 md:right-0 z-30 bg-white/95 hover:bg-white text-gray-500 hover:text-navy-800 rounded-full p-2.5 shadow-md border border-gray-200 transition-all" aria-label="${escapeHtml(t('accessories_page.close'))}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="flex flex-col sm:flex-row gap-5">
        <div class="sm:w-48 flex-shrink-0">
          <div class="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden aspect-square">
            <img src="${escapeHtml(a.image)}" alt="${escapeHtml(localizedName(a))}" class="w-full h-full object-contain">
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <span class="inline-block px-2.5 py-1 rounded-md bg-crimson-50 border border-crimson-200 text-crimson-800 text-[10px] font-extrabold uppercase tracking-widest">${escapeHtml(localizedBadge(a))}</span>
          <h3 class="text-lg sm:text-xl font-extrabold text-navy-800 mt-2">${escapeHtml(localizedName(a))}</h3>
          <p class="text-sm text-gray-600 mt-2 leading-relaxed">${escapeHtml(localizedDescription(a))}</p>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-50 border border-navy-200 text-[11px] font-bold text-navy-800">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              ${escapeHtml(t('accessories_page.specs_connector'))}: ${escapeHtml(localizedConnector(a))}
            </span>
            ${a.priceEstimate ? `<span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">${escapeHtml(t('accessories_page.specs_price'))}: ${escapeHtml(a.priceEstimate)}</span>` : ''}
          </div>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-[10px] font-bold uppercase tracking-widest text-navy-800 mb-2">${escapeHtml(t('accessories_page.specs_title'))}</p>
        <table class="w-full">${specsRows}</table>
      </div>

      <div class="mt-6">
        <p class="text-[10px] font-bold uppercase tracking-widest text-navy-800 mb-2">${escapeHtml(t('accessories_page.specs_compatible'))}</p>
        <div class="flex flex-wrap gap-1.5">${compatPills}</div>
      </div>

      ${secondaryBlock}

      <div class="mt-7 flex flex-col sm:flex-row gap-2.5">
        <button type="button" data-accessory-quote="${escapeHtml(a.id)}" class="flex-1 px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-crimson-700 hover:bg-crimson-800 transition-all text-sm active:scale-95">
          ${escapeHtml(t('accessories_page.btn_add_quote'))}
        </button>
        <a href="${escapeHtml(whatsappInquiryLink(a))}" target="_blank" rel="noopener noreferrer" class="flex-1 px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 transition-all text-sm text-center active:scale-95">
          ${escapeHtml(t('accessories_page.btn_wa'))}
        </a>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function renderCard(a: Accessory): string {
  const topSpecs = a.specs
    .slice(0, 3)
    .map(
      (s) => `
      <li class="flex items-start gap-1.5 text-[11px] text-gray-600">
        <span class="w-1 h-1 rounded-full bg-crimson-500 mt-1.5 flex-shrink-0"></span>
        <span><span class="font-semibold text-navy-800">${escapeHtml(localizedSpecLabel(s))}:</span> ${escapeHtml(s.value)}</span>
      </li>`
    )
    .join('');

  return `
    <div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div class="relative aspect-square bg-gray-50 overflow-hidden group cursor-pointer" data-accessory-specs="${escapeHtml(a.id)}">
        <img src="${escapeHtml(a.image)}" alt="${escapeHtml(localizedName(a))}" loading="lazy"
             class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
             onerror="this.src='/images/G-510.webp'">
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-navy-900/85 text-white text-[10px] font-extrabold uppercase tracking-widest">${escapeHtml(localizedBadge(a))}</span>
        <span class="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur border border-gray-200 text-navy-800 text-[10px] font-extrabold tabular-nums">${escapeHtml(a.priceEstimate || '')}</span>
      </div>

      <div class="p-5 flex flex-col flex-1 space-y-3">
        <div>
          <h3 class="text-base font-extrabold text-navy-800 leading-snug">${escapeHtml(localizedName(a))}</h3>
          <p class="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">${escapeHtml(localizedDescription(a))}</p>
        </div>

        <ul class="space-y-1.5 pt-1">${topSpecs}</ul>

        <div class="flex items-center gap-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-navy-600">
          <svg class="w-3.5 h-3.5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          ${escapeHtml(localizedConnector(a))}
        </div>

        <div class="mt-auto pt-3 space-y-2">
          <div class="flex gap-2">
            <button type="button" data-accessory-quote="${escapeHtml(a.id)}" class="flex-1 px-3 py-2.5 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all active:scale-95">
              ${escapeHtml(t('accessories_page.btn_add_quote'))}
            </button>
            <a href="${escapeHtml(whatsappInquiryLink(a))}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(t('accessories_page.btn_wa'))}" aria-label="${escapeHtml(t('accessories_page.btn_wa'))}" class="w-11 h-[42px] flex-shrink-0 inline-flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all active:scale-95">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 5.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
          <button type="button" data-accessory-specs="${escapeHtml(a.id)}" class="w-full px-3 py-2.5 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-800 border border-navy-200 text-[11px] font-extrabold uppercase tracking-wider transition-all active:scale-95">
            ${escapeHtml(t('accessories_page.btn_specs'))}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderGrid(): void {
  if (!grid) return;

  const visible = activeFilter === 'all' ? accessories : accessories.filter(a => a.category === activeFilter);

  grid.innerHTML = visible.map(renderCard).join('');

  if (resultCount) {
    resultCount.textContent = `${visible.length} ${t('accessories_page.results')}`;
  }

  filterBar?.querySelectorAll<HTMLElement>('[data-accessory-filter]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.accessoryFilter === activeFilter);
  });
}

function updateStaticTranslations(): void {
  const lang = getLanguage();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll('.lang-toggle-container').forEach((el) => {
    el.setAttribute('data-lang', lang);
  });

  const switchLabel = lang === 'en' ? 'Cambiar a Español' : 'Switch to English';
  document.querySelectorAll('.lang-toggle-label').forEach((el) => {
    el.textContent = switchLabel;
  });
}

function findAccessory(id: string | null | undefined): Accessory | undefined {
  if (!id) return undefined;
  return accessories.find(a => a.id === id);
}

function initAccessoryEvents(): void {
  filterBar?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-accessory-filter]');
    if (!btn) return;
    const value = btn.dataset.accessoryFilter as AccessoryFilter | undefined;
    if (!value) return;
    activeFilter = value;
    renderGrid();
  });

  grid?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const quoteBtn = target.closest<HTMLElement>('[data-accessory-quote]');
    if (quoteBtn) {
      const acc = findAccessory(quoteBtn.dataset.accessoryQuote);
      if (acc) addAccessoryToQuote(acc);
      return;
    }

    const specsBtn = target.closest<HTMLElement>('[data-accessory-specs]');
    if (specsBtn) {
      const acc = findAccessory(specsBtn.dataset.accessorySpecs);
      if (acc) openSpecsModal(acc);
    }
  });

  modal?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target === modal) {
      closeModal();
      return;
    }

    if (target.closest('[data-accessory-modal-close]')) {
      closeModal();
      return;
    }

    const quoteBtn = target.closest<HTMLElement>('[data-accessory-quote]');
    if (quoteBtn) {
      const acc = findAccessory(quoteBtn.dataset.accessoryQuote);
      if (acc) {
        addAccessoryToQuote(acc);
        closeModal();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

function initLanguageToggle(): void {
  document.getElementById('lang-toggle-desktop')?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleLanguage();
  });
}

function initCartButton(): void {
  document.getElementById('cart-btn')?.addEventListener('click', () => openCartDrawer());
}

initI18n();
updateStaticTranslations();
initCart();
initAccessoryEvents();
initLanguageToggle();
initCartButton();
renderGrid();

onLanguageChange(() => {
  updateStaticTranslations();
  renderGrid();
  if (modal && !modal.classList.contains('hidden')) closeModal();
});

(window as any).closeModal = closeModal;
(window as any).openCartDrawer = openCartDrawer;
