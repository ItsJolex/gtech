import type { Product, ComparisonDimensionData } from './types';
import { products, getAvailableProducts } from './products';

const DIMENSION_LABELS: Record<keyof ComparisonDimensionData, { label: string; icon: string }> = {
  connectivity: { label: 'Cobertura & Modos RF', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  protection: { label: 'Grado de Protección & Carcasa', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  batteryRuntime: { label: 'Rendimiento de Batería', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  audioOutput: { label: 'Sistema Acústico & Audio', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1zm10 0h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1z' },
  controls: { label: 'Teclado & Despacho', icon: 'M8 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-4' },
  formFactor: { label: 'Factor de Forma & Portabilidad', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  antenna: { label: 'Sistema de Antenas', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002-2v-1a2 2 0 012-2h1.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9z' },
  emergency: { label: 'Seguridad Táctica & Alarmas', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  videoVision: { label: 'Transmisión de Video & Visión Nocturna', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z' },
  certifications: { label: 'Homologación & Normativa', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
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
      if (/tri.modo|vhf.*uhf.*direct|line.of.sight/.test(value)) score += 10;
      else if (/híbrido|uhf 3w|analógico.*4g/.test(value)) score += 7;
      else if (/dual antenna|dual port|uv whip.*lte stub/.test(value)) score += 6;
      else if (/global multi.band|worldwide cellular/.test(value)) score += 5;
      else score += 3;
      break;
    case 'protection':
      if (/atex|ex explosion|zone 1\/21|intrínsecamente segura/.test(value)) score += 10;
      else if (/flotante|floats on water|buoyancy|cámara acústica/.test(value)) score += 9;
      else if (/mil.std.810h|mil.spec|exoesqueleto|blindado|impact.shielded|armor/.test(value)) score += 7;
      else if (/ip68|submersible/.test(value)) score += 6;
      else if (/ip67/.test(value)) score += 4;
      else score += 2;
      break;
    case 'batteryRuntime':
      const hoursMatch = value.match(/(\d+)\s*hora/);
      if (hoursMatch) {
        const hours = parseInt(hoursMatch[1]);
        if (hours >= 36) score += 10;
        else if (hours >= 30) score += 8;
        else if (hours >= 28) score += 6;
        else if (hours >= 24) score += 4;
        else if (hours >= 20) score += 3;
        else score += 1;
      } else if (/ilimitada|vehicular/.test(value)) {
        score += 10;
      }
      break;
    case 'audioOutput':
      if (/3\.0w|2\.5w/.test(value)) score += 8;
      else if (/2\.2w|2\.0w/.test(value)) score += 6;
      else if (/dsp|cancelación|noise.reduction/.test(value)) score += 5;
      else if (/1\.8w|1\.5w/.test(value)) score += 3;
      break;
    case 'controls':
      if (/dtmf completo|full dtmf|alfanumérico completo|full numeric/.test(value)) score += 8;
      else if (/dual top knobs|dual knob|triple dial|perillas rotatorias/.test(value)) score += 7;
      else if (/6 teclas|dispatch|individual.*group/.test(value)) score += 5;
      else if (/3.teclas|3.keys|navegación simplificada/.test(value)) score += 3;
      else if (/ptt sobredimensionado|oversized ptt/.test(value)) score += 4;
      break;
    case 'formFactor':
      if (/comando|command|heavy.duty|blindado/.test(value)) score += 6;
      else if (/vehicular|fleet|base station|tablero/.test(value)) score += 5;
      else if (/táctico de mano|portátil táctico/.test(value)) score += 4;
      else if (/wearable|clip.on|ultraliviano|85g|solapero/.test(value)) score += 5;
      else if (/bolsillo|ultracompacto|pocket/.test(value)) score += 4;
      else if (/marino.flotante|floating marine/.test(value)) score += 4;
      break;
    case 'antenna':
      if (/ultra.alta ganancia|extended high.gain|long.range/.test(value)) score += 8;
      else if (/dual independiente|dual port|uv whip.*lte stub/.test(value)) score += 7;
      else if (/látigo alta ganancia|high.gain whip/.test(value)) score += 6;
      else if (/stubby protegida|protected stubby|integrada oculta/.test(value)) score += 3;
      break;
    case 'emergency':
      if (/sos frontal|instant front sos|baliza audible/.test(value)) score += 8;
      else if (/flash alarm|linterna led estroboscópica|strobe/.test(value)) score += 7;
      else if (/flotabilidad|buoyancy|positiva/.test(value)) score += 5;
      else if (/alerta|emergency|sos/.test(value)) score += 4;
      break;
    case 'videoVision':
      if (/1080p|bodycam|video.*recording|infrarrojos|night vision|ir leds/.test(value)) score += 10;
      else score += 1;
      break;
    case 'certifications':
      const certCount = (value.match(/\//g) || []).length + 1;
      if (/atex|ex|iecEx/.test(value)) score += 5;
      if (/mil.std.810h/.test(value)) score += 3;
      if (/ip68/.test(value)) score += 2;
      score += Math.min(certCount, 5);
      break;
  }
  
  return score;
}

function getAdvantageBadge(winner: 'p1' | 'p2' | 'tie', currentProduct: 'p1' | 'p2'): string {
  if (winner === 'tie') return '';
  if (winner === currentProduct) {
    return `<span class="tactical-advantage-badge">Ventaja Táctica</span>`;
  }
  return '';
}

export function initComparison(): void {
  const container = document.getElementById('comparison-section');
  if (!container) return;
  
  const availableProducts = getAvailableProducts();
  const productOptions = availableProducts.map(p => 
    `<option value="${p.id}">${p.name} [${p.badge}]</option>`
  ).join('');
  
  container.innerHTML = `
    <section id="comparison" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-crimson-800 font-bold tracking-widest uppercase text-sm mb-2 block">Motor de Comparación Táctica</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-navy-800">¿NO SABES CUÁL ELEGIR?</h2>
          <p class="text-gray-600 mt-2 max-w-2xl mx-auto">Compara especificaciones técnicas de grado táctico frente a frente. 10 dimensiones analizadas objetivamente.</p>
        </div>
        
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label class="block text-sm font-semibold text-navy-800 mb-2">Modelo A</label>
              <select id="compare-select-1" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 text-navy-800 font-medium">
                <option value="">Seleccionar modelo...</option>
                ${productOptions}
              </select>
            </div>
            <div class="sm:col-span-2 lg:col-span-1 flex items-end">
              <button id="compare-btn-preset" class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-navy-800 hover:bg-navy-900 transition-colors flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Comparar los 3 Más Vendidos
              </button>
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy-800 mb-2">Modelo B</label>
              <select id="compare-select-2" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 text-navy-800 font-medium">
                <option value="">Seleccionar modelo...</option>
                ${productOptions}
              </select>
            </div>
          </div>
          
          <div id="comparison-table-container" class="hidden overflow-x-auto">
            <table class="w-full min-w-[800px] comparison-table">
              <thead>
                <tr class="bg-navy-800 text-white">
                  <th class="sticky left-0 z-10 px-4 py-4 text-left font-bold uppercase tracking-wider text-xs bg-navy-800 border-r border-navy-700 w-48">Dimensión</th>
                  <th class="px-4 py-4 text-center font-bold uppercase tracking-wider text-xs border-r border-navy-700">Modelo A</th>
                  <th class="px-4 py-4 text-center font-bold uppercase tracking-wider text-xs">Modelo B</th>
                </tr>
              </thead>
              <tbody id="comparison-tbody"></tbody>
            </table>
          </div>
          
          <div id="comparison-empty" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <p class="text-lg font-medium text-navy-700">Selecciona dos modelos para comparar</p>
            <p class="text-sm mt-1">Elige los equipos desde los selectores superiores</p>
          </div>
        </div>
      </div>
    </section>
  `;
  
  const select1 = document.getElementById('compare-select-1') as HTMLSelectElement;
  const select2 = document.getElementById('compare-select-2') as HTMLSelectElement;
  const tbody = document.getElementById('comparison-tbody')!;
  const tableContainer = document.getElementById('comparison-table-container')!;
  const emptyState = document.getElementById('comparison-empty')!;
  const presetBtn = document.getElementById('compare-btn-preset')!;
  
  function renderComparison(id1: string, id2: string): void {
    const p1 = products.find(p => p.id === id1);
    const p2 = products.find(p => p.id === id2);
    
    if (!p1 || !p2) return;
    
    emptyState.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    
    tbody.innerHTML = DIMENSION_KEYS.map(key => {
      const dim = DIMENSION_LABELS[key];
      const winner = getAdvantage(key, p1, p2);
      const p1Advantage = getAdvantageBadge(winner, 'p1');
      const p2Advantage = getAdvantageBadge(winner, 'p2');
      
      return `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="sticky left-0 z-10 px-4 py-4 bg-white border-r border-navy-700 w-48">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${dim.icon}"></path></svg>
              </div>
              <span class="font-semibold text-navy-800 text-sm">${dim.label}</span>
            </div>
          </td>
          <td class="px-4 py-4 text-center relative ${winner === 'p1' ? 'tactical-advantage-cell' : ''}">
            <div class="font-medium text-navy-800 text-sm">${p1.comparison[key]}</div>
            ${p1Advantage}
          </td>
          <td class="px-4 py-4 text-center relative ${winner === 'p2' ? 'tactical-advantage-cell' : ''}">
            <div class="font-medium text-navy-800 text-sm">${p2.comparison[key]}</div>
            ${p2Advantage}
          </td>
        </tr>
      `;
    }).join('');
  }
  
  function handleSelectChange(): void {
    const id1 = select1.value;
    const id2 = select2.value;
    
    if (id1 && id2 && id1 !== id2) {
      renderComparison(id1, id2);
    } else {
      emptyState.classList.remove('hidden');
      tableContainer.classList.add('hidden');
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
    
    // Show a toast or notification
    showToast('Comparando los 3 más vendidos: G-889 vs Tri-Mode vs Global LTE');
  });
  
  // Listen for compare-products event from cart modal
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
  const event = new CustomEvent('compare-products', { detail: { id1, id2 } });
  window.dispatchEvent(event);
  document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
};