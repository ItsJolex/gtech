import type { Product, ComparisonDimensionData } from './types';
import { products, getAvailableProducts } from './products';
import { getLanguage, t, onLanguageChange, getLocalizedProduct } from './i18n';

const DIMENSION_LABELS: Record<keyof ComparisonDimensionData, { label: string; icon: string }> = {
  connectivity: { label: 'Coverage & RF Modes', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.343 9.343c5.858-5.857 15.355-5.857 21.213 0' },
  protection: { label: 'Protection & Ingress', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  batteryRuntime: { label: 'Battery Runtime', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  audioOutput: { label: 'Acoustic & Audio', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
  controls: { label: 'Keypad & Dispatch', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  formFactor: { label: 'Form Factor & Weight', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  antenna: { label: 'Antenna System', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  emergency: { label: 'Tactical Safety & SOS', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  videoVision: { label: 'Video & Night Vision', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  certifications: { label: 'Certifications', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
};

const DIMENSION_LABELS_ES: Record<keyof ComparisonDimensionData, string> = {
  connectivity: 'Cobertura y Modos RF',
  protection: 'Protección y Grado IP',
  batteryRuntime: 'Autonomía de Batería',
  audioOutput: 'Acústica y Audio',
  controls: 'Teclado y Despacho',
  formFactor: 'Factor de Forma y Peso',
  antenna: 'Sistema de Antena',
  emergency: 'Seguridad Táctica y SOS',
  videoVision: 'Video y Visión Nocturna',
  certifications: 'Certificaciones'
};

const DIMENSION_KEYS: (keyof ComparisonDimensionData)[] = [
  'connectivity',
  'protection',
  'batteryRuntime',
  'audioOutput',
  'controls',
  'formFactor',
  'antenna',
  'emergency',
  'videoVision',
  'certifications'
];

export function getShortModelName(p: Product): string {
  const map: Record<string, string> = {
    'G-889': 'G-889 (Dual-Antenna)',
    'G-F1': 'G-F1 (Smart PoC)',
    'G-280-2': 'G-280-2 (Dual-Mode)',
    'Model-G-M2': 'G-M2 (Wearable Clip)',
    'G-510': 'G-510 (Pocket PoC)',
    'G-H28': 'G-H28 (Tactical Keypad)',
    'G-P0-Black': 'P0 (Marine Floating)',
    'P0-Ex-Blue': 'P0-Ex (ATEX Marine)',
    'WA0058-Vehicle': 'WA0058 (Vehicle Base)',
    'WA0060-Armor': 'WA0060 (Mil-Spec Armor)',
    'WA0062-TriMode': 'WA0062 (Tri-Mode DMR)',
    'WA0064-LongRange': 'WA0064 (Long-Range)',
    'WA0055-GlobalLTE': 'WA0055 (Global LTE)',
    'WA0057-TacticalField': 'WA0057 (Tactical Field)',
    'WA0066-Alervites': 'Alervites (Ultra-Slim)',
    'WA0069-Bodycam': 'BQ-K8 (Bodycam 4G)'
  };
  return map[p.id] || p.shortName || p.name;
}

function getAdvantage(dimKey: keyof ComparisonDimensionData, p1: Product, p2: Product): 'p1' | 'p2' | 'tie' {
  const v1 = p1.comparison[dimKey].toLowerCase();
  const v2 = p2.comparison[dimKey].toLowerCase();

  const score1 = calculateAdvantageScore(v1, dimKey);
  const score2 = calculateAdvantageScore(v2, dimKey);

  if (score1 > score2) return 'p1';
  if (score2 > score1) return 'p2';
  return 'tie';
}

function calculateAdvantageScore(value: string, dimKey: keyof ComparisonDimensionData): number {
  let score = 0;

  switch (dimKey) {
    case 'connectivity':
      if (/tri.?mode|vhf.*uhf.*direct|line.of.sight|direct rf/.test(value)) score += 10;
      else if (/hybrid.*uhf|uhf 3w|analog.*4g|3w analog|híbrido/.test(value)) score += 7;
      else if (/dual.antenna|dual port|dual port.*lte/.test(value)) score += 6;
      else if (/global multi.band|worldwide|global lte/.test(value)) score += 5;
      else score += 3;
      break;
    case 'protection':
      if (/atex|explosion.proof|zone 1\/21|intrinsically safe|inherently safe/.test(value)) score += 10;
      else if (/float|flotante|floats on water|buoyancy|flotabilidad|acoustic chamber/.test(value)) score += 9;
      else if (/mil.std.810|mil.spec|exoskeleton|exoesqueleto|armor|blindad|impact.shield/.test(value)) score += 7;
      else if (/ip68|submersible/.test(value)) score += 6;
      else if (/ip67/.test(value)) score += 4;
      else score += 2;
      break;
    case 'batteryRuntime':
      const hoursMatch = value.match(/(\d+)\s*(horas?|hours?|hrs?)\b/i);
      if (hoursMatch) {
        const hours = parseInt(hoursMatch[1]);
        if (hours >= 36) score += 10;
        else if (hours >= 30) score += 8;
        else if (hours >= 28) score += 6;
        else if (hours >= 24) score += 4;
        else if (hours >= 20) score += 3;
        else score += 1;
      } else if (/unlimited|ilimitada|vehicle.powered|vehicular/.test(value)) {
        score += 10;
      }
      break;
    case 'audioOutput':
      if (/3\.0w|2\.5w/.test(value)) score += 8;
      else if (/2\.2w|2\.0w/.test(value)) score += 6;
      else if (/dsp|noise.reduction|noise.cancell|noise suppression|cancelación|cancellation/.test(value)) score += 5;
      else if (/1\.8w|1\.5w/.test(value)) score += 3;
      break;
    case 'controls':
      if (/full dtmf|dtmf.*(keypad|alphanumeric|complete|knob)|alphanumeric/.test(value)) score += 8;
      else if (/dual.*knob|dual radar|triple dial|rotary/.test(value)) score += 7;
      else if (/dispatch|individual.*group|group keys|one.touch|6.*keys|5.*keys/.test(value)) score += 5;
      else if (/oversized ptt|ptt sobredimensionado/.test(value)) score += 4;
      else if (/3.?key|3.?teclas|jog dial|4.?key/.test(value)) score += 3;
      break;
    case 'formFactor':
      if (/command|heavy.duty|armor|blindad|impact/.test(value)) score += 6;
      else if (/vehicle|fleet|dashboard|base station|tablero|vehicular/.test(value)) score += 5;
      else if (/wearable|clip.on|ultralight|ultraliviano|85g|lapel|solapero/.test(value)) score += 5;
      else if (/pocket|bolsillo|ultracompact|ultra.compact/.test(value)) score += 4;
      else if (/floating|marino flotante|marine.*float/.test(value)) score += 4;
      else if (/handheld|handheld terminal|táctico.*mano/.test(value)) score += 4;
      break;
    case 'antenna':
      if (/extended high.gain|ultra.high.gain|ultra.alta ganancia|long.range/.test(value)) score += 8;
      else if (/independent dual|dual.*(uv whip|lte stub|port)|whip.*stub/.test(value)) score += 7;
      else if (/high.gain (whip|stubby|uhf)|alta ganancia/.test(value)) score += 6;
      else if (/external.*antenna port|vehicle antenna/.test(value)) score += 5;
      else if (/protected|stubby|integrated|hidden|sealed/.test(value)) score += 3;
      break;
    case 'emergency':
      if (/sos frontal|instant front sos|front sos|instant.*sos/.test(value)) score += 8;
      else if (/flash alarm|strobe|linterna led estroboscópica|beacon/.test(value)) score += 7;
      else if (/guard channel|canal de guardia/.test(value)) score += 6;
      else if (/flotabilidad|buoyancy|floats/.test(value)) score += 5;
      else if (/emergency|alarm|alerta|sos|alert/.test(value)) score += 4;
      break;
    case 'videoVision':
      if (/1080p|bodycam|full hd|video.*record|infrared|night vision|ir leds|grabación|video|visor nocturno/.test(value)) score += 10;
      else score += 1;
      break;
    case 'certifications':
      const certCount = (value.match(/\//g) || []).length + 1;
      if (/atex|ex|iecEx/.test(value)) score += 5;
      if (/mil.std.810/.test(value)) score += 3;
      if (/ip68/.test(value)) score += 2;
      score += Math.min(certCount, 5);
      break;
  }

  return score;
}

function getAdvantageBadge(winner: 'p1' | 'p2' | 'tie', currentProduct: 'p1' | 'p2', compact = false): string {
  if (winner === 'tie') return '';
  if (winner !== currentProduct) return '';
  const isEs = getLanguage() === 'es';
  const cls = compact
    ? 'tactical-advantage-badge tactical-advantage-badge--compact'
    : 'tactical-advantage-badge';
  return `<span class="${cls}">${isEs ? 'Ventaja' : 'Advantage'}</span>`;
}

export function initComparison(): void {
  const container = document.getElementById('comparison-section');
  if (!container) return;

  const availableProducts = getAvailableProducts();
  const productOptions = availableProducts.map(p =>
    `<option value="${p.id}">${getShortModelName(p)}</option>`
  ).join('');

  container.innerHTML = `
    <section id="comparison" class="py-10 sm:py-16 bg-gray-50 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-10">
          <span id="compare-badge-title" class="text-crimson-800 font-bold tracking-widest uppercase text-sm mb-2 block">${t('comparison.engine_badge')}</span>
          <h2 id="compare-heading" class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-800">${t('comparison.engine_title')}</h2>
          <p id="compare-desc" class="text-gray-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">${t('comparison.engine_desc')}</p>
        </div>

        <div class="bg-white rounded-3xl p-4 sm:p-8 shadow-lg border border-gray-100 mb-8">
          <!-- 2-Column Model Selectors Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label id="label-select-1" for="compare-select-1" class="block text-xs sm:text-sm font-bold text-navy-800 mb-2 truncate">
                ${t('comparison.primary_device')}
              </label>
              <select id="compare-select-1" class="w-full px-3 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 text-navy-800 text-sm font-medium transition-all">
                <option value="">${getLanguage() === 'es' ? 'Selecciona un modelo...' : 'Select a model...'}</option>
                ${productOptions}
              </select>
            </div>

            <div>
              <label id="label-select-2" for="compare-select-2" class="block text-xs sm:text-sm font-bold text-navy-800 mb-2 truncate">
                ${t('comparison.compare_device')}
              </label>
              <select id="compare-select-2" class="w-full px-3 sm:px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 text-navy-800 text-sm font-medium transition-all">
                <option value="">${getLanguage() === 'es' ? 'Selecciona un modelo...' : 'Select a model...'}</option>
                ${productOptions}
              </select>
            </div>
          </div>

          <!-- Centered Preset Button -->
          <div class="flex justify-center items-center my-3 mb-6">
            <button id="compare-btn-preset" class="px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-white bg-navy-800 hover:bg-navy-900 transition-all shadow-md flex items-center justify-center gap-2 text-xs active:scale-95">
              <svg class="w-4 h-4 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              <span id="compare-preset-text">${t('comparison.compare_top_sellers')}</span>
            </button>
          </div>

          <div id="comparison-table-container" class="hidden">
            <div class="hidden sm:block">
              <table class="w-full table-fixed comparison-table">
                <thead>
                  <tr class="bg-navy-800 text-white">
                    <th id="compare-th-dim" class="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs w-[30%]">${t('comparison.technical_dimension')}</th>
                    <th id="compare-th-1" class="px-4 py-4 text-center font-bold uppercase tracking-wider text-xs w-[35%] border-l border-navy-700">Model 1</th>
                    <th id="compare-th-2" class="px-4 py-4 text-center font-bold uppercase tracking-wider text-xs w-[35%] border-l border-navy-700">Model 2</th>
                  </tr>
                </thead>
                <tbody id="comparison-tbody"></tbody>
              </table>
            </div>
          </div>

          <div id="comparison-mobile" class="hidden">
            <div class="block sm:hidden space-y-2.5" id="comparison-mobile-body"></div>
          </div>

          <div id="comparison-empty" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <p id="compare-empty-title" class="text-lg font-medium text-navy-700">${t('comparison.select_two')}</p>
            <p id="compare-empty-desc" class="text-sm mt-1">${t('comparison.pick_devices')}</p>
          </div>
        </div>
      </div>
    </section>
  `;

  const select1 = document.getElementById('compare-select-1') as HTMLSelectElement;
  const select2 = document.getElementById('compare-select-2') as HTMLSelectElement;
  const tbody = document.getElementById('comparison-tbody')!;
  const tableContainer = document.getElementById('comparison-table-container')!;
  const mobileContainer = document.getElementById('comparison-mobile')!;
  const mobileBody = document.getElementById('comparison-mobile-body')!;
  const emptyState = document.getElementById('comparison-empty')!;
  const presetBtn = document.getElementById('compare-btn-preset')!;

  function renderComparison(id1: string, id2: string): void {
    const p1 = products.find(p => p.id === id1);
    const p2 = products.find(p => p.id === id2);

    if (!p1 || !p2) return;

    emptyState.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    mobileContainer.classList.remove('hidden');

    const lang = getLanguage();
    const p1Localized = getLocalizedProduct(p1);
    const p2Localized = getLocalizedProduct(p2);

    const header1 = document.getElementById('compare-th-1');
    const header2 = document.getElementById('compare-th-2');
    if (header1) header1.textContent = p1Localized.name;
    if (header2) header2.textContent = p2Localized.name;

    tbody.innerHTML = DIMENSION_KEYS.map(key => {
      const dim = DIMENSION_LABELS[key];
      const dimLabel = lang === 'es' ? DIMENSION_LABELS_ES[key] : dim.label;
      const winner = getAdvantage(key, p1, p2);
      const p1Advantage = getAdvantageBadge(winner, 'p1');
      const p2Advantage = getAdvantageBadge(winner, 'p2');

      return `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="px-3 py-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${dim.icon}"></path></svg>
              </div>
              <span class="font-semibold text-navy-800 text-sm">${dimLabel}</span>
            </div>
          </td>
          <td class="px-4 py-4 text-center relative border-l border-gray-100 ${winner === 'p1' ? 'tactical-advantage-cell' : ''}">
            <div class="font-medium text-navy-800 text-sm leading-relaxed">${p1.comparison[key]}</div>
            ${p1Advantage}
          </td>
          <td class="px-4 py-4 text-center relative border-l border-gray-100 ${winner === 'p2' ? 'tactical-advantage-cell' : ''}">
            <div class="font-medium text-navy-800 text-sm leading-relaxed">${p2.comparison[key]}</div>
            ${p2Advantage}
          </td>
        </tr>
      `;
    }).join('');

    mobileBody.innerHTML = `
      <div class="sticky top-[80px] z-20 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-100 p-2 flex items-center gap-2">
        <div class="flex-1 flex items-center gap-1.5 min-w-0">
          <img src="${p1.image}" alt="${p1Localized.name}" class="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0">
          <span class="text-[10px] leading-tight font-bold text-navy-800 truncate">${p1Localized.name}</span>
        </div>
        <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider flex-shrink-0">vs</span>
        <div class="flex-1 flex items-center gap-1.5 min-w-0 justify-end">
          <span class="text-[10px] leading-tight font-bold text-navy-800 truncate text-right">${p2Localized.name}</span>
          <img src="${p2.image}" alt="${p2Localized.name}" class="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0">
        </div>
      </div>
      ${DIMENSION_KEYS.map(key => {
        const dim = DIMENSION_LABELS[key];
        const dimLabel = lang === 'es' ? DIMENSION_LABELS_ES[key] : dim.label;
        const winner = getAdvantage(key, p1, p2);
        const p1Advantage = getAdvantageBadge(winner, 'p1', true);
        const p2Advantage = getAdvantageBadge(winner, 'p2', true);

        return `
          <div class="bg-white rounded-xl border border-gray-100 p-2.5 shadow-sm">
            <div class="flex items-center gap-1.5 mb-1.5">
              <div class="w-6 h-6 bg-navy-100 rounded flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${dim.icon}"></path></svg>
              </div>
              <span class="font-bold text-navy-800 text-[11px] uppercase tracking-wider truncate">${dimLabel}</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <div class="relative rounded-lg bg-gray-50 p-1.5 ${winner === 'p1' ? 'tactical-advantage-cell' : ''}">
                <span class="block text-[10px] leading-snug text-navy-700">${p1.comparison[key]}</span>
                ${p1Advantage}
              </div>
              <div class="relative rounded-lg bg-gray-50 p-1.5 ${winner === 'p2' ? 'tactical-advantage-cell' : ''}">
                <span class="block text-[10px] leading-snug text-navy-700">${p2.comparison[key]}</span>
                ${p2Advantage}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  }

  function updateSelectorLabels(): void {
    const label1 = document.getElementById('label-select-1');
    const label2 = document.getElementById('label-select-2');
    const p1 = products.find(p => p.id === select1.value);
    const p2 = products.find(p => p.id === select2.value);
    const isEs = getLanguage() === 'es';
    if (label1) label1.textContent = p1 ? `${isEs ? 'Modelo' : 'Model'}: ${getShortModelName(p1)}` : t('comparison.primary_device');
    if (label2) label2.textContent = p2 ? `${isEs ? 'Modelo' : 'Model'}: ${getShortModelName(p2)}` : t('comparison.compare_device');
  }

  onLanguageChange(() => {
    updateSelectorLabels();
    const compareBadge = document.getElementById('compare-badge-title');
    const compareHeading = document.getElementById('compare-heading');
    const compareDesc = document.getElementById('compare-desc');
    const presetBtnText = document.getElementById('compare-preset-text');
    const thDim = document.getElementById('compare-th-dim');
    const emptyTitle = document.getElementById('compare-empty-title');
    const emptyDesc = document.getElementById('compare-empty-desc');

    if (compareBadge) compareBadge.textContent = t('comparison.engine_badge');
    if (compareHeading) compareHeading.textContent = t('comparison.engine_title');
    if (compareDesc) compareDesc.textContent = t('comparison.engine_desc');
    if (presetBtnText) presetBtnText.textContent = t('comparison.compare_top_sellers');
    if (thDim) thDim.textContent = t('comparison.technical_dimension');
    if (emptyTitle) emptyTitle.textContent = t('comparison.select_two');
    if (emptyDesc) emptyDesc.textContent = t('comparison.pick_devices');

    if (select1.value && select2.value && select1.value !== select2.value) {
      renderComparison(select1.value, select2.value);
    }
  });

  function handleSelectChange(): void {
    const id1 = select1.value;
    const id2 = select2.value;

    updateSelectorLabels();

    if (id1 && id2 && id1 !== id2) {
      renderComparison(id1, id2);
    } else {
      emptyState.classList.remove('hidden');
      tableContainer.classList.add('hidden');
      mobileContainer.classList.add('hidden');
    }
  }

  select1.addEventListener('change', handleSelectChange);
  select2.addEventListener('change', handleSelectChange);

  presetBtn.addEventListener('click', () => {
    // Top 3 bestsellers: G-889, WA0062-TriMode, WA0055-GlobalLTE
    const top3 = ['G-889', 'WA0062-TriMode', 'WA0055-GlobalLTE'];
    select1.value = top3[0];
    select2.value = top3[1];
    handleSelectChange();

    showToast(t('comparison.toast_top'));
  });

  // Listen for compare-products event from product modal
  window.addEventListener('compare-products', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail.id1 && detail.id2) {
      select1.value = detail.id1;
      select2.value = detail.id2;
      handleSelectChange();
      document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function showToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-24 right-4 bg-navy-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-in-right text-sm font-medium';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

(window as any).compareProducts = (id1: string, id2: string) => {
  const drawerContainer = document.getElementById('cart-drawer-container');
  if (drawerContainer) {
    drawerContainer.classList.add('hidden');
    document.body.style.overflow = '';
  }
  const event = new CustomEvent('compare-products', { detail: { id1, id2 } });
  window.dispatchEvent(event);
  document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
};