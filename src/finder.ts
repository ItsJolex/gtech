import type { Product, QuizQuestion, QuizRecommendation } from './types';
import { products, getAvailableProducts } from './products';
import { getLanguage, t, onLanguageChange, getLocalizedProduct } from './i18n';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'What is your primary deployment environment?',
    subtitle: 'Select the main terrain or industry of your team.',
    options: [
      {
        label: 'Private Security, Events & Retail',
        description: 'Urban patrols, malls, offices, retail logistics',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        tags: ['security', 'keypad', 'commercial', 'global-lte']
      },
      {
        label: 'Hazardous, Petrochemical & ATEX Zones',
        description: 'Petrochemical, gas, mining, flammable material handling',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        tags: ['atex', 'explosion-proof', 'oil-gas']
      },
      {
        label: 'Maritime, Water Rescue & Marine Logistics',
        description: 'Coast guard, water rescue, ports, river navigation',
        icon: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z',
        tags: ['marine', 'floating', 'ip68', 'water-rescue', 'global-lte']
      },
      {
        label: 'Fleet Transport, Ambulances & Vehicle Logistics',
        description: 'Trucks, commercial fleets, medical emergencies, heavy hauling',
        icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
        tags: ['vehicle', 'fleet', 'mobile', 'base-station', '12v-24v', 'global-lte']
      },
      {
        label: 'Tactical Field Operations, Defense & Remote Missions',
        description: 'Military, tactical police, areas without cellular coverage, covert ops',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        tags: ['hybrid-rf', 'dual-antenna', 'tactical', 'dual-knob', 'long-range']
      }
    ]
  },
  {
    id: 2,
    title: 'What connectivity mode does your mission demand?',
    subtitle: 'Choose between cellular-based coverage or direct radiofrequency.',
    options: [
      {
        label: 'Nationwide 4G LTE Cellular PoC (Unlimited Range)',
        description: 'Push-to-Talk over existing cellular network, no direct RF required',
        icon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 002 12a9 9 0 0018 0c0-1.26-.2-2.51-.59-3.59z',
        tags: ['global-lte', 'voice-only']
      },
      {
        label: 'Hybrid RF (VHF/UHF Line-of-Sight + 4G LTE Backup)',
        description: 'Direct line-of-sight UHF/VHF + cellular PoC for total redundancy',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002-2v-1a2 2 0 012-2h1.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9z',
        tags: ['hybrid-rf', 'dual-antenna', 'tri-mode', 'vhf', 'uhf']
      }
    ]
  },
  {
    id: 3,
    title: 'Do you need video evidence or night vision recording?',
    subtitle: 'Evaluate if your officers require bodycam capabilities.',
    options: [
      {
        label: 'Yes, 1080p HD Bodycam with Infrared Night Vision',
        description: 'Full HD recording, 8 IR LEDs, live GPS tracking, legal evidence',
        icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z',
        tags: ['bodycam', 'video', 'night-vision', 'gps', 'security', 'law-enforcement']
      },
      {
        label: 'No, crystal-clear two-way voice Push-To-Talk only',
        description: 'High-power audio with DSP cancellation, pure voice focus',
        icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1zm10 0h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1z',
        tags: ['voice-only', 'audio', 'dsp']
      }
    ]
  },
  {
    id: 4,
    title: 'What form factor fits your team\'s routine best?',
    subtitle: 'Choose carrying and control preference.',
    options: [
      {
        label: 'Ultra-lightweight Hands-Free Lapel Clip',
        description: '85g, oversized central PTT, ideal for patrols and hospitality',
        icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z',
        tags: ['wearable', 'clip-on', 'lightweight', 'hands-free']
      },
      {
        label: 'Traditional Handheld with Full DTMF Alphanumeric Keypad',
        description: 'Full DTMF keypad, direct dialing, color display, ergonomic grip',
        icon: 'M8 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-4',
        tags: ['keypad', 'dtmf', 'handheld', 'tactical']
      },
      {
        label: 'Heavy-Duty Ruggedized Housing with Dual Top Rotary Knobs',
        description: 'Dual/top knobs for channel & volume, glove-operable, Mil-Spec armor',
        icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 15h.01M18 12h.01',
        tags: ['dual-knob', 'rotary', 'gloves', 'mil-spec', 'armor']
      },
      {
        label: 'Fixed Vehicle-Mounted Base Station with Palm Mic',
        description: '12V/24V mobile transceiver, palm mic, external antenna, dash mount',
        icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
        tags: ['vehicle', 'mobile', 'base-station', '12v-24v', 'fleet']
      }
    ]
  }
];

const QUIZ_QUESTIONS_ES = [
  {
    id: 1,
    title: '¿Cuál es el entorno principal de tu despliegue?',
    subtitle: 'Selecciona el terreno o industria principal de tu equipo operativo.',
    options: [
      {
        label: 'Seguridad Privada, Eventos y Retail',
        description: 'Patrullaje urbano, centros comerciales, oficinas, logística retail',
      },
      {
        label: 'Zonas Peligrosas, Petroquímica y Zonas ATEX',
        description: 'Petroquímica, gas, minería, manejo de materiales inflamables',
      },
      {
        label: 'Marítimo, Rescate Acuático y Logística Portuaria',
        description: 'Guardacostas, rescate en agua, puertos, navegación fluvial',
      },
      {
        label: 'Transporte de Flota, Ambulancias y Logística Vehicular',
        description: 'Camiones, flotas comerciales, emergencias médicas, carga pesada',
      },
      {
        label: 'Operaciones Tácticas de Campo, Defensa y Misiones Remotas',
        description: 'Militar, policía táctica, áreas sin cobertura celular, misiones encubiertas',
      }
    ]
  },
  {
    id: 2,
    title: '¿Qué modo de conectividad exige tu misión?',
    subtitle: 'Elige entre cobertura celular de alcance ilimitado o radiofrecuencia directa.',
    options: [
      {
        label: 'Celular 4G LTE Nacional PoC (Alcance Ilimitado)',
        description: 'Push-to-Talk sobre la red celular existente, sin necesidad de repetidoras RF',
      },
      {
        label: 'Híbrido RF (VHF/UHF Línea de Vista + Respaldo 4G LTE)',
        description: 'UHF/VHF directo en línea de vista + PoC celular para redundancia total',
      }
    ]
  },
  {
    id: 3,
    title: '¿Necesitas evidencia de video o grabación con visión nocturna?',
    subtitle: 'Evalúa si tus agentes requieren funciones de bodycam corporal.',
    options: [
      {
        label: 'Sí, Bodycam Full HD 1080p con Visión Nocturna Infrarroja',
        description: 'Grabación Full HD, 8 LEDs infrarrojos, GPS en tiempo real, evidencia judicial',
      },
      {
        label: 'No, solo comunicación de voz Push-To-Talk bidireccional ultranítida',
        description: 'Audio de alta potencia acústica con cancelación de ruido DSP, enfoque en voz pura',
      }
    ]
  },
  {
    id: 4,
    title: '¿Qué formato físico se adapta mejor a la rutina de tu equipo?',
    subtitle: 'Elige tu preferencia de porte y controles ergonómicos.',
    options: [
      {
        label: 'Clip de Solapa Ultraliviano para Manos Libres',
        description: '85g, botón PTT central de gran tamaño, ideal para patrullaje discreto y hotelería',
      },
      {
        label: 'Portátil Tradicional con Teclado Alfanumérico Completo DTMF',
        description: 'Teclado numérico completo, marcación directa, pantalla a color, agarre ergonómico',
      },
      {
        label: 'Chasis Blindado de Alta Resistencia con Doble Perilla Superior',
        description: 'Doble dial para canal y volumen, operable con guantes, blindaje Mil-Spec',
      },
      {
        label: 'Estación Base Móvil Fija para Vehículo con Micrófono de Palma',
        description: 'Transmisor móvil 12V/24V, micrófono ergonómico, antena externa, montaje vehicular',
      }
    ]
  }
];

function calculateMatchScore(product: Product, selectedTags: string[]): number {
  let score = 0;
  const productTags = product.tags || [];

  selectedTags.forEach(tag => {
    if (productTags.includes(tag)) {
      score += 10;
    }
  });

  if (product.inStock) score += 5;
  else score -= 20;

  return Math.min(Math.max(score, 0), 100);
}

function generateReasons(product: Product, selectedTags: string[]): string[] {
  const reasons: string[] = [];
  const productTags = product.tags || [];
  const isEs = getLanguage() === 'es';

  const envTag = selectedTags.find(t => ['security', 'atex', 'marine', 'vehicle', 'tactical'].includes(t));
  if (envTag) {
    if (isEs) {
      const envLabels: Record<string, string> = {
        security: 'Seguridad Privada y Eventos',
        atex: 'Entornos con Riesgo de Explosión (ATEX)',
        marine: 'Operaciones Marítimas y Flotabilidad',
        vehicle: 'Flotas Vehiculares y Logística',
        tactical: 'Operaciones Tácticas y Terreno Remoto'
      };
      const cert = product.comparison.certifications;
      reasons.push(`Responde a tu necesidad de <strong>${envLabels[envTag]}</strong> gracias a su certificación <strong>${cert}</strong>.`);
    } else {
      const envLabels: Record<string, string> = {
        security: 'Private Security & Events',
        atex: 'Explosion-Proof (ATEX) Environments',
        marine: 'Maritime Operations & Buoyancy',
        vehicle: 'Vehicle Fleets & Logistics',
        tactical: 'Tactical Operations & Remote Terrain'
      };
      const cert = product.comparison.certifications;
      reasons.push(`Fits your need for <strong>${envLabels[envTag]}</strong> thanks to its <strong>${cert}</strong> certification.`);
    }
  }

  const connTag = selectedTags.find(t => ['global-lte', 'hybrid-rf'].includes(t));
  if (connTag) {
    if (isEs) {
      const connLabels: Record<string, string> = {
        'global-lte': 'cobertura celular nacional e internacional 4G LTE',
        'hybrid-rf': 'comunicación híbrida de radiofrecuencia analógica + PoC celular'
      };
      reasons.push(`Garantiza comunicación continua mediante <strong>${connLabels[connTag]}</strong>.`);
    } else {
      const connLabels: Record<string, string> = {
        'global-lte': 'nationwide/global 4G LTE coverage',
        'hybrid-rf': 'hybrid analog RF + cellular PoC communication'
      };
      reasons.push(`Guarantees communication via <strong>${connLabels[connTag]}</strong>.`);
    }
  }

  const formTag = selectedTags.find(t => ['wearable', 'keypad', 'dual-knob', 'vehicle'].includes(t));
  if (formTag) {
    if (isEs) {
      const formLabels: Record<string, string> = {
        wearable: 'porte de clip manos libres ultraliviano',
        keypad: 'teclado numérico completo DTMF para marcación directa',
        'dual-knob': 'perillas tácticas giratorias operables con guantes',
        vehicle: 'instalación fija vehicular 12V/24V con micrófono de palma'
      };
      reasons.push(`Ergonomía optimizada para <strong>${formLabels[formTag]}</strong>.`);
    } else {
      const formLabels: Record<string, string> = {
        wearable: 'ultra-lightweight hands-free clip carry',
        keypad: 'full DTMF alphanumeric keypad for direct dialing',
        'dual-knob': 'tactical rotary knobs operable with gloves',
        vehicle: 'fixed 12V/24V vehicle installation with palm mic'
      };
      reasons.push(`Ergonomics optimized for <strong>${formLabels[formTag]}</strong>.`);
    }
  }

  if (selectedTags.includes('bodycam') && productTags.includes('bodycam')) {
    reasons.push(isEs
      ? `Integra <strong>Bodycam 1080p con visión nocturna IR</strong> y telemetría GPS en tiempo real para evidencia judicial.`
      : `Integrates a <strong>1080p Bodycam with IR night vision</strong> and GPS live tracking for legal evidence.`
    );
  }

  if (reasons.length < 2) {
    reasons.push(isEs
      ? `Destaca por su <strong>${product.comparison.protection}</strong> y autonomía de <strong>${product.comparison.batteryRuntime}</strong>.`
      : `Highlights its <strong>${product.comparison.protection}</strong> and <strong>${product.comparison.batteryRuntime}</strong>.`
    );
  }

  return reasons.slice(0, 2);
}

function findRecommendations(selectedTags: string[]): QuizRecommendation[] {
  const availableProducts = getAvailableProducts();

  const scored = availableProducts.map(product => ({
    product,
    score: calculateMatchScore(product, selectedTags)
  })).sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  const primary = scored[0];
  const alternative = scored[1];

  return [
    {
      product: primary.product,
      matchScore: primary.score,
      reasons: generateReasons(primary.product, selectedTags),
      alternative: alternative ? alternative.product : undefined
    }
  ];
}

let currentStep = 0;
let selectedTags: string[] = [];

export function initFinder(): void {
  const container = document.getElementById('finder-section');
  if (!container) return;

  container.innerHTML = `
    <section id="finder" class="py-10 sm:py-16 bg-navy-800 relative overflow-hidden scroll-mt-20">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(172,34,32,0.08)_0%,_transparent_70%)]"></div>
      <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-6 sm:mb-10 relative z-10">
          <span id="finder-badge-el" class="text-crimson-400 font-bold tracking-widest uppercase text-sm mb-2 block">${t('finder.badge')}</span>
          <h2 id="finder-headline-el" class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">${t('finder.headline')}</h2>
          <p id="finder-subheadline-el" class="text-navy-300 text-sm sm:text-base mt-1">${t('finder.subheadline')}</p>
        </div>

        <div id="finder-content" class="relative z-10">
          ${renderStep(0)}
        </div>
      </div>
    </section>
  `;

  attachStepListeners(0);

  onLanguageChange(() => {
    const badgeEl = document.getElementById('finder-badge-el');
    const headlineEl = document.getElementById('finder-headline-el');
    const subheadlineEl = document.getElementById('finder-subheadline-el');
    const content = document.getElementById('finder-content');

    if (badgeEl) badgeEl.textContent = t('finder.badge');
    if (headlineEl) headlineEl.textContent = t('finder.headline');
    if (subheadlineEl) subheadlineEl.textContent = t('finder.subheadline');

    if (content) {
      content.innerHTML = renderStep(currentStep);
      attachStepListeners(currentStep);
    }
  });
}

function renderStep(step: number): string {
  if (step >= QUIZ_QUESTIONS.length) {
    return renderResult();
  }

  const isEs = getLanguage() === 'es';
  const questionBase = QUIZ_QUESTIONS[step];
  const questionEs = QUIZ_QUESTIONS_ES[step];

  const title = isEs && questionEs ? questionEs.title : questionBase.title;
  const subtitle = isEs && questionEs ? questionEs.subtitle : questionBase.subtitle;
  const progress = ((step) / QUIZ_QUESTIONS.length) * 100;

  return `
    <div class="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-3 sm:p-6 shadow-2xl animate-fade-in">
      <div class="mb-4">
        <div class="flex items-center justify-between text-xs sm:text-sm mb-2">
          <span class="text-crimson-400 font-bold uppercase tracking-wider">${t('finder.step_of')} ${step + 1} ${t('finder.of')} ${QUIZ_QUESTIONS.length}</span>
          <span class="text-navy-400 font-mono">${Math.round(progress)}%</span>
        </div>
        <div class="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden">
          <div class="h-full bg-crimson-600 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-base sm:text-xl font-bold text-white mb-1">${title}</h3>
        <p class="text-navy-300 text-xs sm:text-sm">${subtitle}</p>
      </div>

      <div class="space-y-2" id="question-options">
        ${questionBase.options.map((opt, optionIndex) => {
          const optEs = questionEs?.options?.[optionIndex];
          const label = isEs && optEs ? optEs.label : opt.label;
          const description = isEs && optEs ? optEs.description : opt.description;

          return `
            <button data-option-index="${optionIndex}" data-tags="${opt.tags.join(',')}" class="finder-option w-full text-left p-3 sm:p-4 rounded-xl border-2 border-navy-700 bg-navy-900/50 hover:border-crimson-600 hover:bg-navy-800/50 transition-all duration-200 group flex items-start gap-3">
              <div class="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-crimson-900/30 transition-colors">
                <svg class="w-4 h-4 text-navy-400 group-hover:text-crimson-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${opt.icon}"></path></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-white text-xs sm:text-sm group-hover:text-crimson-200 transition-colors leading-snug">${label}</div>
                <div class="text-navy-400 text-[11px] sm:text-sm mt-0.5 group-hover:text-navy-300 transition-colors hidden sm:block">${description}</div>
              </div>
              <svg class="w-4 h-4 text-navy-600 group-hover:text-crimson-500 transition-transform group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          `;
        }).join('')}
      </div>

      ${step > 0 ? `
        <div class="mt-4 pt-4 border-t border-navy-700">
          <button id="finder-prev" class="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-navy-300 bg-navy-700 hover:bg-navy-600 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            ${t('finder.prev_step')}
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderResult(): string {
  const recommendations = findRecommendations(selectedTags);
  const primary = recommendations[0];

  if (!primary) {
    return `
      <div class="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-4 sm:p-8 shadow-2xl text-center animate-fade-in">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3 class="text-lg sm:text-xl font-bold text-white mb-2">${t('finder.no_matches')}</h3>
        <p class="text-navy-300 text-sm mb-6">${t('finder.adjust_answers')}</p>
        <button onclick="resetFinder()" class="px-5 py-3 rounded-full font-bold uppercase tracking-wider text-white bg-crimson-700 hover:bg-crimson-800 transition-colors text-sm">${t('finder.restart_test')}</button>
      </div>
    `;
  }

  const { product, matchScore, reasons, alternative } = primary;
  const localizedProduct = getLocalizedProduct(product);
  const localizedAlt = alternative ? getLocalizedProduct(alternative) : undefined;

  return `
    <div class="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-3 sm:p-6 shadow-2xl animate-fade-in">
      <div class="flex items-center justify-between mb-3 gap-2">
        <div class="inline-flex items-center gap-2 bg-crimson-900/50 border border-crimson-700 rounded-full px-3 py-1.5">
          <svg class="w-4 h-4 text-crimson-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-white font-bold text-xs sm:text-sm">${matchScore}% ${t('finder.mission_match')}</span>
        </div>
        <button onclick="resetFinder()" class="flex-shrink-0 px-3 py-1.5 rounded-lg font-medium uppercase tracking-wider text-navy-300 bg-navy-700 hover:bg-navy-600 transition-colors text-[10px] sm:text-xs">
          ${t('finder.restart')}
        </button>
      </div>

      <div class="flex items-center gap-3 mb-3">
        <img src="${product.image}" alt="${localizedProduct.name}" class="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-navy-900 border border-navy-700 object-contain p-1 flex-shrink-0">
        <div class="min-w-0">
          <h3 class="text-white font-bold text-sm sm:text-base mb-1">${localizedProduct.name}</h3>
          <span class="text-crimson-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">${localizedProduct.badge}</span>
          <p class="text-navy-400 text-[11px] sm:text-sm mt-1 line-clamp-2">${localizedProduct.description}</p>
        </div>
      </div>

      <div class="space-y-1.5 mb-3">
        ${reasons.map((reason) => `
          <div class="bg-navy-900/50 border border-navy-700 rounded-lg p-2 flex items-start gap-2">
            <div class="w-5 h-5 bg-crimson-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3 h-3 text-crimson-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="text-navy-200 text-[11px] sm:text-sm leading-relaxed">${reason}</div>
          </div>
        `).join('')}
      </div>

      ${localizedAlt ? `
        <div class="bg-navy-900/30 border border-navy-700 rounded-xl p-2.5 mb-3">
          <p class="text-navy-400 text-[10px] sm:text-xs mb-1.5 font-medium uppercase tracking-wider">${t('finder.solid_alternative')}</p>
          <div class="flex items-center gap-2">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-navy-900 rounded-lg overflow-hidden border border-navy-700 flex-shrink-0">
              <img src="${localizedAlt.image}" alt="${localizedAlt.name}" class="w-full h-full object-contain p-0.5">
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-xs sm:text-sm truncate">${localizedAlt.name}</p>
              <p class="text-crimson-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">${localizedAlt.badge}</p>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <button onclick="addToCart('${product.id}'); openCartDrawer()" class="py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-crimson-700 hover:bg-crimson-800 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 text-[11px] sm:text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          ${t('finder.add_to_quote')}
        </button>
        <button onclick="generateWhatsAppForProduct('${product.id}')" class="py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 text-[11px] sm:text-sm">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ${t('finder.whatsapp_quote')}
        </button>
      </div>
    </div>
  `;
}

function attachStepListeners(_step: number): void {
  const content = document.getElementById('finder-content');
  if (!content) return;

  content.querySelectorAll('.finder-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const tags = target.dataset.tags?.split(',') || [];

      selectedTags = [...selectedTags, ...tags];

      currentStep++;
      content.innerHTML = renderStep(currentStep);
      attachStepListeners(currentStep);
    });
  });

  const prevBtn = document.getElementById('finder-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        const lastQuestion = QUIZ_QUESTIONS[currentStep - 1];
        currentStep--;
        lastQuestion.options.forEach(opt => {
          opt.tags.forEach(tag => {
            selectedTags = selectedTags.filter(t => t !== tag);
          });
        });
        content.innerHTML = renderStep(currentStep);
        attachStepListeners(currentStep);
      }
    });
  }

  const resetBtn = content.querySelector('button[onclick="resetFinder()"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFinder);
  }
}

export function resetFinder(): void {
  currentStep = 0;
  selectedTags = [];

  const content = document.getElementById('finder-content');
  if (content) {
    content.innerHTML = renderStep(0);
    attachStepListeners(0);
  }
}

export function generateWhatsAppForProduct(productId: string): void {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const lang = getLanguage();
  const localized = getLocalizedProduct(product);

  const lines = lang === 'es' ? [
    '*G-TECH.US | SOLICITUD FORMAL DE COTIZACIÓN*',
    '-----------------------------------------',
    'Hola Ventas Técnicas de G-TECH, solicito disponibilidad y precio para el siguiente equipo:',
    '',
    `• 1x ${localized.name} [${localized.badge}]`,
    '',
    '*Unidades Totales:* 1 equipo',
    '*Destino de Entrega:* [Por favor indicar Ciudad / Estado]',
    '-----------------------------------------',
    'Enviado mediante Portal Táctico G-TECH.US'
  ] : [
    '*G-TECH.US | FORMAL QUOTATION REQUEST*',
    '-----------------------------------------',
    'Hello G-TECH Technical Sales, please provide stock availability and pricing for the following equipment:',
    '',
    `• 1x ${localized.name} [${localized.badge}]`,
    '',
    '*Total Units:* 1 device',
    '*Delivery Destination:* [Please specify City / State]',
    '-----------------------------------------',
    'Sent via G-TECH.US Tactical Portal'
  ];

  const message = lines.join('\n');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/14074273356?text=${encodedMessage}`;

  window.open(url, '_blank');
}

(window as any).resetFinder = () => resetFinder();
(window as any).generateWhatsAppForProduct = (id: string) => generateWhatsAppForProduct(id);