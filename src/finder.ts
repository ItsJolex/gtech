import type { Product, QuizQuestion, QuizRecommendation } from './types';
import { products, getAvailableProducts } from './products';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Entorno Operativo Principal',
    subtitle: '¿Dónde operarás principalmente el equipo?',
    options: [
      {
        label: 'Seguridad Privada, Eventos o Comercio',
        description: 'Patrullas urbanas, centros comerciales, oficinas, logística retail',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        tags: ['security', 'keypad', 'commercial', 'global-lte']
      },
      {
        label: 'Zonas Peligrosas, Refinerías o Químicas',
        description: 'Petroquímica, gas, minería, manejo de materiales inflamables',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        tags: ['atex', 'explosion-proof', 'oil-gas']
      },
      {
        label: 'Operaciones Marítimas, Acuáticas o Rescate Fluvial',
        description: 'Guardacostas, rescate en agua, puertos, navegación fluvial',
        icon: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z',
        tags: ['marine', 'floating', 'ip68', 'water-rescue', 'global-lte']
      },
      {
        label: 'Flotas de Transporte, Ambulancias o Logística Vehicular',
        description: 'Camiones, flotas comerciales, emergencias médicas, transporte pesado',
        icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
        tags: ['vehicle', 'fleet', 'mobile', 'base-station', '12v-24v', 'global-lte']
      },
      {
        label: 'Operaciones Tácticas, Fuerzas Especiales o Terreno Remoto',
        description: 'Militar, policial táctico, zonas sin cobertura celular, operaciones encubiertas',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        tags: ['hybrid-rf', 'dual-antenna', 'tactical', 'dual-knob', 'long-range']
      }
    ]
  },
  {
    id: 2,
    title: 'Tipo de Cobertura y Señal',
    subtitle: '¿Cómo necesitas comunicarte?',
    options: [
      {
        label: 'Solo cobertura nacional/urbana por red celular 4G LTE',
        description: 'Comunicación Push-to-Talk sobre red celular existente, sin radiofrecuencia directa',
        icon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 002 12a9 9 0 0018 0c0-1.26-.2-2.51-.59-3.59z',
        tags: ['global-lte', 'voice-only']
      },
      {
        label: 'Híbrido: Celular + Radiofrecuencia analógica directa (sin depender de internet)',
        description: 'Comunicación directa línea de vista UHF/VHF + PoC celular para respaldo total',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002-2v-1a2 2 0 012-2h1.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9z',
        tags: ['hybrid-rf', 'dual-antenna', 'tri-mode', 'vhf', 'uhf']
      }
    ]
  },
  {
    id: 3,
    title: '¿Requieres Grabación de Video o Visión Nocturna?',
    subtitle: 'Evidencia visual y operaciones nocturnas',
    options: [
      {
        label: 'Sí, requiero cámara corporal (Bodycam) 1080p y visión nocturna',
        description: 'Grabación Full HD, 8 LEDs infrarrojos, GPS live tracking, evidencia legal',
        icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z',
        tags: ['bodycam', 'video', 'night-vision', 'gps', 'security', 'law-enforcement']
      },
      {
        label: 'No, únicamente comunicación de voz ultranítida Push-To-Talk',
        description: 'Audio de alta potencia con cancelación DSP, enfoque en comunicación verbal pura',
        icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1zm10 0h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1z',
        tags: ['voice-only', 'audio', 'dsp']
      }
    ]
  },
  {
    id: 4,
    title: 'Preferencia de Porte y Ergonomía',
    subtitle: '¿Cómo llevarás el equipo durante la jornada?',
    options: [
      {
        label: 'Manos libres ultraliviano de clip (solapa / cinturón)',
        description: '85g, PTT central sobredimensionado, ideal para patrullas y hospitalidad',
        icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z',
        tags: ['wearable', 'clip-on', 'lightweight', 'hands-free']
      },
      {
        label: 'Portátil tradicional de mano con teclado alfanumérico',
        description: 'Teclado DTMF completo, marcación directa, pantalla a color, agarre ergonómico',
        icon: 'M8 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-4',
        tags: ['keypad', 'dtmf', 'handheld', 'tactical']
      },
      {
        label: 'Uso rudo con perillas giratorias táctiles para guantes',
        description: 'Dual/Top knobs para canal y volumen, operable con guantes, blindaje Mil-Spec',
        icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 15h.01M18 12h.01',
        tags: ['dual-knob', 'rotary', 'gloves', 'mil-spec', 'armor']
      },
      {
        label: 'Equipo fijo instalado en tablero de vehículo',
        description: 'Transceptor móvil 12V/24V, micrófono de palma, antena externa, montaje en dash',
        icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
        tags: ['vehicle', 'mobile', 'base-station', '12v-24v', 'fleet']
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
  
  const envTag = selectedTags.find(t => ['security', 'atex', 'marine', 'vehicle', 'tactical'].includes(t));
  if (envTag) {
    const envLabels: Record<string, string> = {
      security: 'Seguridad Privada y Eventos',
      atex: 'Entornos Antiexplosión (ATEX)',
      marine: 'Operaciones Marítimas y Flotabilidad',
      vehicle: 'Flotas Vehiculares y Logística',
      tactical: 'Operaciones Tácticas y Terreno Remoto'
    };
    const cert = product.comparison.certifications;
    reasons.push(`Cumple con tu necesidad de <strong>${envLabels[envTag]}</strong> gracias a su certificación <strong>${cert}</strong>.`);
  }
  
  const connTag = selectedTags.find(t => ['global-lte', 'hybrid-rf'].includes(t));
  if (connTag) {
    const connLabels: Record<string, string> = {
      'global-lte': 'cobertura nacional/global 4G LTE',
      'hybrid-rf': 'comunicación híbrida RF analógica + celular PoC'
    };
    reasons.push(`Garantiza comunicación mediante <strong>${connLabels[connTag]}</strong>.`);
  }
  
  const formTag = selectedTags.find(t => ['wearable', 'keypad', 'dual-knob', 'vehicle'].includes(t));
  if (formTag) {
    const formLabels: Record<string, string> = {
      wearable: 'porte manos libres ultraliviano de clip',
      keypad: 'teclado alfanumérico DTMF completo para marcación directa',
      'dual-knob': 'perillas giratorias tácticas operables con guantes',
      vehicle: 'instalación fija vehicular 12V/24V con micrófono de palma'
    };
    reasons.push(`Ergonomía optimizada para <strong>${formLabels[formTag]}</strong>.`);
  }
  
  if (selectedTags.includes('bodycam') && productTags.includes('bodycam')) {
    reasons.push(`Integra <strong>Bodycam 1080p con visión nocturna IR</strong> y GPS live tracking para evidencia legal.`);
  }
  
  if (reasons.length < 2) {
    reasons.push(`Destaca por su <strong>${product.comparison.protection}</strong> y <strong>${product.comparison.batteryRuntime}</strong>.`);
  }
  
  return reasons.slice(0, 3);
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
    <section id="finder" class="py-20 bg-navy-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(172,34,32,0.08)_0%,_transparent_70%)]"></div>
      <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 relative z-10">
          <span class="text-crimson-400 font-bold tracking-widest uppercase text-sm mb-2 block">Asistente Táctico de Misión</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">ENCUENTRA TU EQUIPO EXACTO</h2>
          <p class="text-navy-300 mt-2">4 preguntas directas. Análisis de perfil operativo. Recomendación justificada técnicamente.</p>
        </div>
        
        <div id="finder-content" class="relative z-10">
          ${renderStep(0)}
        </div>
      </div>
    </section>
  `;
  
  attachStepListeners(0);
}

function renderStep(step: number): string {
  if (step >= QUIZ_QUESTIONS.length) {
    return renderResult();
  }
  
  const question = QUIZ_QUESTIONS[step];
  const progress = ((step) / QUIZ_QUESTIONS.length) * 100;
  
  return `
    <div class="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in">
      <div class="mb-8">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="text-crimson-400 font-bold uppercase tracking-wider">Paso ${step + 1} de ${QUIZ_QUESTIONS.length}</span>
          <span class="text-navy-400 font-mono">${Math.round(progress)}%</span>
        </div>
        <div class="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
          <div class="h-full bg-crimson-600 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
        </div>
      </div>
      
      <div class="mb-8">
        <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">${question.title}</h3>
        <p class="text-navy-300 text-sm">${question.subtitle}</p>
      </div>
      
      <div class="space-y-3" id="question-options">
        ${question.options.map((opt, optionIndex) => `
          <button data-option-index="${optionIndex}" data-tags="${opt.tags.join(',')}" class="finder-option w-full text-left p-5 rounded-2xl border-2 border-navy-700 bg-navy-900/50 hover:border-crimson-600 hover:bg-navy-800/50 transition-all duration-200 group flex items-start gap-4">
            <div class="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-crimson-900/30 transition-colors">
              <svg class="w-6 h-6 text-navy-400 group-hover:text-crimson-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${opt.icon}"></path></svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white group-hover:text-crimson-200 transition-colors">${opt.label}</div>
              <div class="text-navy-400 text-sm mt-1 group-hover:text-navy-300 transition-colors">${opt.description}</div>
            </div>
            <svg class="w-5 h-5 text-navy-600 group-hover:text-crimson-500 transition-transform group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        `).join('')}
      </div>
      
      ${step > 0 ? `
        <div class="mt-6 pt-6 border-t border-navy-700">
          <button id="finder-prev" class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-navy-300 bg-navy-700 hover:bg-navy-600 transition-colors flex items-center justify-center gap-2 mx-auto sm:mx-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            Paso Anterior
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
      <div class="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-3xl p-8 shadow-2xl text-center animate-fade-in">
        <svg class="w-16 h-16 mx-auto mb-4 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3 class="text-xl font-bold text-white mb-2">No hay coincidencias exactas</h3>
        <p class="text-navy-300 mb-6">Ajusta tus respuestas o contacta a un experto para asesoría personalizada.</p>
        <button onclick="resetFinder()" class="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-white bg-crimson-700 hover:bg-crimson-800 transition-colors">Reiniciar Test</button>
      </div>
    `;
  }
  
  const { product, matchScore, reasons, alternative } = primary;
  
  return `
    <div class="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 bg-crimson-900/50 border border-crimson-700 rounded-full px-6 py-3 mb-4">
          <div class="w-10 h-10 bg-crimson-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span class="text-white font-bold text-lg">${matchScore}% Match con tu Misión</span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Modelo Recomendado</h3>
        <p class="text-navy-300">${product.name} <span class="text-crimson-400 font-bold">[${product.badge}]</span></p>
      </div>
      
      <div class="aspect-[3/4] bg-navy-900 rounded-2xl overflow-hidden border border-navy-700 mb-6 flex items-center justify-center">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
      </div>
      
      <div class="space-y-4 mb-6">
        ${reasons.map((reason) => `
          <div class="bg-navy-900/50 border border-navy-700 rounded-xl p-4 flex items-start gap-3">
            <div class="w-8 h-8 bg-crimson-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-crimson-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="text-navy-200 text-sm leading-relaxed">${reason}</div>
          </div>
        `).join('')}
      </div>
      
      ${alternative ? `
        <div class="bg-navy-900/30 border border-navy-700 rounded-2xl p-4 mb-6">
          <p class="text-navy-400 text-sm mb-2 font-medium">Alternativa Sólida</p>
          <div class="flex items-center gap-3">
            <div class="w-16 h-16 bg-navy-900 rounded-xl overflow-hidden border border-navy-700 flex-shrink-0">
              <img src="${alternative.image}" alt="${alternative.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <p class="text-white font-semibold">${alternative.name}</p>
              <p class="text-crimson-400 text-sm font-bold uppercase tracking-wider">${alternative.badge}</p>
            </div>
          </div>
        </div>
      ` : ''}
      
      <div class="flex flex-col sm:flex-row gap-3">
        <button onclick="addToCart('${product.id}'); openCartDrawer()" class="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-white bg-crimson-700 hover:bg-crimson-800 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          Añadir al Carrito
        </button>
        <button onclick="generateWhatsAppForProduct('${product.id}')" class="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Cotizar por WhatsApp
        </button>
      </div>
      
      <button onclick="resetFinder()" class="mt-6 w-full sm:w-auto mx-auto sm:mx-0 px-6 py-3 rounded-xl font-medium uppercase tracking-wider text-navy-300 bg-navy-700 hover:bg-navy-600 transition-colors">
        Reiniciar Test
      </button>
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
        // For simplicity, we'll just reset and let user re-answer
        currentStep--;
        // Remove tags from the last question
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
  
  const lines = [
    '*G-TECH.US | SOLICITUD DE COTIZACIÓN*',
    '-----------------------------------------',
    'Estimado equipo de ventas técnicas, solicito disponibilidad y cotización formal para el siguiente equipamiento:',
    '',
    `• 1x ${product.name} [${product.badge}]`,
    '',
    '*Total unidades:* 1 equipo',
    '*Ubicación / Despacho:* [Indicar ciudad o país]',
    '-----------------------------------------',
    'Enviado desde G-TECH.US Tactical Portal'
  ];
  
  const message = lines.join('\n');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/584149428999?text=${encodedMessage}`;
  
  window.open(url, '_blank');
}

(window as any).resetFinder = () => resetFinder();
(window as any).generateWhatsAppForProduct = (id: string) => generateWhatsAppForProduct(id);