export type Language = 'en' | 'es';

const STORAGE_KEY = 'gtech_lang';

type Translations = Record<string, { en: string; es: string }>;

export const translations: Translations = {
  // Top Bar
  'topbar.brand': {
    en: 'G-TECH Communications',
    es: 'G-TECH Comunicaciones'
  },
  'topbar.tagline': {
    en: 'Nationwide Cellular PoC Hardware',
    es: 'Hardware PoC Celular con Cobertura Nacional'
  },
  'topbar.switch_lang': {
    en: 'Cambiar a Español',
    es: 'Switch to English'
  },

  // Navigation
  'nav.systems': { en: 'Systems', es: 'Sistemas' },
  'nav.finder': { en: 'Mission Finder', es: 'Buscador' },
  'nav.compare': { en: 'Compare', es: 'Comparar' },
  'nav.specs': { en: 'Specs', es: 'Especificaciones' },
  'nav.contact': { en: 'Contact', es: 'Contacto' },
  'nav.get_quote': { en: 'Get a Quote', es: 'Cotizar' },

  // Hero
  'hero.slogan': {
    en: 'Push to Talk. Ready to Act.',
    es: 'Pulsa para Hablar. Listo para Actuar.'
  },
  'hero.title_pre': {
    en: 'TACTICAL PUSH-TO-TALK',
    es: 'PUSH-TO-TALK TÁCTICO'
  },
  'hero.title_highlight': {
    en: 'OVER CELLULAR',
    es: 'SOBRE RED CELULAR'
  },
  'hero.description': {
    en: 'Defense-grade PoC radios engineered for flawless, nationwide push-to-talk communication. Built to survive extreme environments with zero downtime.',
    es: 'Radios PoC de grado de defensa diseñadas para comunicación push-to-talk impecable con cobertura nacional. Construidas para resistir entornos extremos sin interrupciones.'
  },
  'hero.cta_explore': {
    en: 'Explore Systems',
    es: 'Explorar Sistemas'
  },
  'hero.cta_consult': {
    en: 'Consult an Engineer',
    es: 'Consultar con un Ingeniero'
  },
  'hero.trust_4g': { en: 'Nationwide 4G', es: '4G LTE Nacional' },
  'hero.trust_milspec': { en: 'Mil-Spec Tested', es: 'Probado Mil-Spec' },
  'hero.trust_dispatch': { en: 'Instant Dispatch', es: 'Despacho Inmediato' },
  'hero.badge_network': { en: '4G LTE Active', es: '4G LTE Activo' },
  'hero.badge_network_sub': { en: 'Network', es: 'Red' },
  'hero.badge_security': { en: 'AES-256 Encrypted', es: 'Cifrado AES-256' },
  'hero.badge_security_sub': { en: 'Security', es: 'Seguridad' },

  // Catalog Section
  'catalog.subtitle': { en: 'Professional Hardware', es: 'Hardware Profesional' },
  'catalog.title': { en: 'PoC Radios Catalog', es: 'Catálogo de Radios PoC' },
  'catalog.view_dossier': { en: 'Technical Dossier', es: 'Ficha Técnica' },
  'catalog.add_to_quote': { en: 'Add to Quote', es: 'Cotizar Equipo' },
  'catalog.added_to_quote': { en: 'Added to Quote', es: 'Agregado a Cotización' },
  'catalog.in_stock': { en: 'IN STOCK', es: 'EN STOCK' },
  'catalog.low_stock': { en: 'LOW STOCK', es: 'POCAS UNIDADES' },
  'catalog.sold_out': { en: 'SOLD OUT', es: 'AGOTADO' },
  'catalog.sim_rates': { en: 'SIM Coverage Rates', es: 'Tarifas SIM Globales' },

  // Specs Section
  'specs.card1_title': { en: 'Mil-Spec Certified', es: 'Certificación Mil-Spec' },
  'specs.card1_desc': {
    en: 'Tested to MIL-STD-810H standards for shock, vibration, and extreme temperatures.',
    es: 'Probado bajo estándares MIL-STD-810H para resistir caídas, vibración y temperaturas extremas.'
  },
  'specs.card2_title': { en: 'Zero-Fail Architecture', es: 'Arquitectura Cero Fallos' },
  'specs.card2_desc': {
    en: 'Redundant power arrays and automatic failover systems ensure 99.999% uptime.',
    es: 'Matrices de energía redundantes y conmutación por error automática para 99.999% de disponibilidad.'
  },
  'specs.card3_title': { en: 'AES-256 Encryption', es: 'Cifrado AES-256' },
  'specs.card3_desc': {
    en: 'Hardware-level encryption for all data-at-rest and communications telemetry.',
    es: 'Cifrado a nivel de hardware para datos en reposo y telemetría de comunicaciones.'
  },
  'specs.card4_title': { en: '24/7 Mission Support', es: 'Soporte de Misión 24/7' },
  'specs.card4_desc': {
    en: 'Direct engineering consultation and immediate hardware replacement guarantees.',
    es: 'Consultoría técnica directa y garantías de reemplazo de hardware inmediato.'
  },

  // Footer Section
  'footer.brand_sub': { en: 'Tactical Communications', es: 'Comunicaciones Tácticas' },
  'footer.about': {
    en: 'Nationwide cellular Push-To-Talk systems, tactical PoC hardware, and mission-critical voice telemetry across North America.',
    es: 'Sistemas Push-To-Talk celulares nacionales, hardware PoC táctico y telemetría de voz de misión crítica en toda Norteamérica.'
  },
  'footer.distributor_badge': {
    en: 'Official US Distributor • Active Dispatch',
    es: 'Distribuidor Oficial EE.UU. • Despacho Activo'
  },
  'footer.direct_channels': { en: 'Direct Communications', es: 'Canales Directos' },
  'footer.voice_label': { en: 'Voice & Direct Phone', es: 'Voz y Teléfono Directo' },
  'footer.email_label': { en: 'Official Email / Owner', es: 'Correo Oficial / Gerencia' },
  'footer.whatsapp_label': { en: '24/7 WhatsApp Hotline', es: 'Línea WhatsApp 24/7' },
  'footer.social_title': { en: 'Connect & Social Media', es: 'Conexión y Redes Sociales' },
  'footer.social_desc': {
    en: 'Follow official deployments, tactical field showcases, and equipment releases by Geramel.',
    es: 'Sigue despliegues oficiales, pruebas tácticas en campo y lanzamientos de equipos por Geramel.'
  },
  'footer.instagram_btn': { en: 'Instagram @geramel1', es: 'Instagram @geramel1' },
  'footer.whatsapp_fleet_btn': {
    en: 'Request Fleet Quotation via WhatsApp →',
    es: 'Cotizar Flota por WhatsApp →'
  },
  'footer.nav_title': { en: 'Systems & Navigation', es: 'Sistemas y Navegación' },
  'footer.compliance_title': { en: 'Compliance & Security:', es: 'Cumplimiento y Seguridad:' },
  'footer.compliance_text': {
    en: 'CE, FCC Approved • AES-256 Voice Protocol • Florida FIPA Protected',
    es: 'Aprobado CE y FCC • Protocolo de Voz AES-256 • Protegido Florida FIPA'
  },
  'footer.rights': {
    en: '© 2026 G-TECH.US (🐺 G tech). All rights reserved. Directed by Geramel. Orlando, Florida, USA.',
    es: '© 2026 G-TECH.US (🐺 G tech). Todos los derechos reservados. Dirección: Geramel. Orlando, Florida, EE.UU.'
  },
  'footer.link_privacy': { en: 'Privacy Policy', es: 'Política de Privacidad' },
  'footer.link_terms': { en: 'Terms of Service', es: 'Términos de Servicio' },
  'footer.link_ai': { en: 'AI Transparency', es: 'Transparencia de IA' },
  'footer.link_fcc': { en: 'FCC & 911 Disclaimer', es: 'Aviso FCC y 911' },
  'footer.link_cookies': { en: 'Cookie Preferences', es: 'Preferencias de Cookies' },

  // Cart / Quotation Station Drawer
  'cart.title': { en: 'Quotation Station', es: 'Estación de Cotización' },
  'cart.empty_title': { en: 'Your quotation station is empty', es: 'Tu estación de cotización está vacía' },
  'cart.empty_desc': {
    en: 'Explore the tactical hardware & PoC catalog to add equipment to your request.',
    es: 'Explora el catálogo de hardware táctico y PoC para añadir equipos a tu cotización.'
  },
  'cart.explore_btn': { en: 'Explore Catalog', es: 'Explorar Catálogo' },
  'cart.total_units': { en: 'Total Units', es: 'Unidades Totales' },
  'cart.request_btn': { en: 'Request Quote via WhatsApp', es: 'Solicitar Cotización por WhatsApp' },
  'cart.clear_btn': { en: 'Clear Station', es: 'Vaciar Estación' },
  'cart.oos_title': { en: 'Product Temporarily Out of Stock', es: 'Producto Temporalmente Agotado' },
  'cart.oos_status': { en: 'is currently out of stock.', es: 'se encuentra actualmente agotado.' },
  'cart.oos_fallback_title': { en: 'Recommended Available Equivalent', es: 'Equivalente Disponible Recomendado' },
  'cart.oos_fallback_default': {
    en: 'Tactical alternative with comparable specifications.',
    es: 'Alternativa táctica con especificaciones comparables.'
  },
  'cart.oos_view_comparison': { en: 'View Comparison', es: 'Ver Comparativa' },
  'cart.oos_add_this': { en: 'Add This One', es: 'Agregar Este' },
  'cart.oos_continue': { en: 'Continue Exploring', es: 'Seguir Explorando' },

  // Modals & Technical Dossier
  'modal.back_overview': { en: 'Back to Overview', es: 'Volver a la Vista General' },
  'modal.technical_dossier': { en: 'Technical Dossier', es: 'Ficha Técnica de Misión' },
  'modal.rf_title': { en: 'RF, Cellular & Telemetry Architecture', es: 'Arquitectura de RF, Celular y Telemetría' },
  'modal.audio_title': { en: 'Acoustics & Operational Controls', es: 'Acústica y Controles Operativos' },
  'modal.durability_title': { en: 'Endurance, Ingress & Field Standards', es: 'Resistencia, Protección y Estándares de Campo' },
  'modal.specs_title': { en: 'Field Specifications Breakdown', es: 'Desglose de Especificaciones de Campo' },
  'modal.inquire_product': { en: 'Inquire via WhatsApp', es: 'Consultar por WhatsApp' },
  'modal.sim_modal_title': { en: 'Global Multi-Carrier SIM Data Plan', es: 'Plan de Datos SIM Multi-Operador Global' },
  'modal.sim_modal_desc': {
    en: 'Continuous nationwide 4G LTE coverage across all tier-1 cellular providers with instant zero-fail carrier switching.',
    es: 'Cobertura nacional 4G LTE continua en los principales operadores con conmutación automática sin interrupción.'
  },
  'modal.sim_cta': {
    en: 'Inquire Hardware + SIM via WhatsApp',
    es: 'Consultar Equipo + SIM por WhatsApp'
  },

  // Finder
  'finder.title': { en: 'Tactical Mission Finder', es: 'Buscador Táctico de Misiones' },
  'finder.badge': { en: 'Tactical Mission Assistant', es: 'Asistente de Misión Táctica' },
  'finder.headline': { en: 'FIND YOUR EXACT SYSTEM', es: 'ENCUENTRA TU SISTEMA EXACTO' },
  'finder.subheadline': {
    en: '4 direct questions. Operational profile analysis. Technically justified recommendation.',
    es: '4 preguntas directas. Análisis de perfil operacional. Recomendación técnicamente justificada.'
  },
  'finder.subtitle': {
    en: 'Match your exact operational environment to the optimal PoC radio system in 4 rapid questions.',
    es: 'Encuentra el sistema de radio PoC óptimo para tu entorno operativo en 4 preguntas rápidas.'
  },
  'finder.step_of': { en: 'Step', es: 'Paso' },
  'finder.of': { en: 'of', es: 'de' },
  'finder.prev_step': { en: 'Prev Step', es: 'Paso Anterior' },
  'finder.mission_match': { en: 'Mission Match', es: 'Afinidad con la Misión' },
  'finder.restart': { en: 'Restart', es: 'Reiniciar' },
  'finder.solid_alternative': { en: 'Solid Alternative', es: 'Alternativa Sólida' },
  'finder.add_to_quote': { en: 'Add to Quote', es: 'Añadir a Cotización' },
  'finder.whatsapp_quote': { en: 'WhatsApp Quote', es: 'Cotizar por WhatsApp' },
  'finder.no_matches': { en: 'No exact matches found', es: 'No se encontraron coincidencias exactas' },
  'finder.adjust_answers': { en: 'Adjust your answers or contact an expert for personalized guidance.', es: 'Ajusta tus respuestas o contacta a un experto para asesoría personalizada.' },
  'finder.restart_test': { en: 'Restart Test', es: 'Reiniciar Test' },
  'finder.start_btn': { en: 'Start Mission Assessment', es: 'Iniciar Evaluación de Misión' },
  'finder.restart_btn': { en: 'Restart Mission Assessment', es: 'Reiniciar Evaluación' },
  'finder.matched_label': { en: 'Tactical Match Score', es: 'Afinidad Táctica' },
  'finder.add_recommended': { en: 'Add Recommended System', es: 'Añadir Sistema Recomendado' },
  'finder.compare_alt': { en: 'Compare with Alternative', es: 'Comparar con Alternativa' },

  // Comparison Matrix
  'comparison.title': { en: '10-Point Technical Matrix', es: 'Matriz Técnica de 10 Puntos' },
  'comparison.subtitle': {
    en: 'Direct side-by-side engineering evaluation across all military, RF, acoustic, and tactical specifications.',
    es: 'Evaluación técnica directa frente a frente en especificaciones militares, RF, acústica y durabilidad.'
  },
  'comparison.engine_badge': { en: 'Tactical Comparison Engine', es: 'Motor de Comparación Táctica' },
  'comparison.engine_title': { en: 'NOT SURE WHICH ONE TO CHOOSE?', es: '¿NO ESTÁS SEGURO DE CUÁL ELEGIR?' },
  'comparison.engine_desc': {
    en: 'Compare tactical-grade technical specifications head to head. 10 dimensions analyzed objectively.',
    es: 'Compara especificaciones técnicas de grado táctico frente a frente. 10 dimensiones analizadas objetivamente.'
  },
  'comparison.primary_device': { en: 'Primary Device', es: 'Equipo Principal' },
  'comparison.compare_device': { en: 'Comparison Device', es: 'Equipo Comparativo' },
  'comparison.compare_top_sellers': { en: 'Compare Top Sellers', es: 'Comparar Más Vendidos' },
  'comparison.technical_dimension': { en: 'Technical Dimension', es: 'Dimensión Técnica' },
  'comparison.select_two': { en: 'Select two models to compare', es: 'Selecciona dos modelos para comparar' },
  'comparison.pick_devices': { en: 'Pick devices from the selectors above', es: 'Elige equipos en los selectores de arriba' },
  'comparison.select_prompt': { en: 'Select 2 models to analyze:', es: 'Selecciona 2 modelos para analizar:' },
  'comparison.advantage': { en: 'Advantage', es: 'Ventaja' },
  'comparison.tie': { en: 'Equivalent', es: 'Equivalente' },
  'comparison.toast_top': {
    en: 'Comparing top sellers: G-889 vs Tri-Mode vs Global LTE',
    es: 'Comparando más vendidos: G-889 vs Tri-Mode vs Global LTE'
  },

  // Extra Catalog & Modals
  'catalog.quote_btn': { en: 'Quote', es: 'Cotizar' },
  'catalog.close_dossier': { en: 'Close Dossier', es: 'Cerrar Ficha' },
  'catalog.close': { en: 'Close', es: 'Cerrar' },
  'catalog.alternative': { en: 'Alternative Available', es: 'Alternativa Disponible' },
  'catalog.add_to_quotation': { en: 'Add to Quotation', es: 'Agregar a Cotización' },
  'catalog.whatsapp_inquiry': { en: 'WhatsApp Inquiry', es: 'Consulta por WhatsApp' },
  'catalog.whatsapp_direct': { en: 'WhatsApp Direct', es: 'WhatsApp Directo' },
  'catalog.sim_plans': { en: 'SIM Plans', es: 'Planes SIM' },
  'catalog.full_specs': { en: 'Full Specs', es: 'Ficha Completa' },
  'catalog.back_to_overview': { en: 'Back to Overview', es: 'Volver al Inicio' },
  'catalog.model_id': { en: 'Model ID', es: 'ID de Modelo' },
  'catalog.operating_temp': { en: 'Operating Temperature', es: 'Temperatura de Operación' },
  'catalog.sim_iot_telemetry': { en: 'Encrypted Cellular IoT Telemetry', es: 'Telemetría Celular IoT Cifrada' },
  'catalog.sim_headline': { en: 'Global PoC SIM Cards & Annual Plans', es: 'Tarjetas SIM PoC Globales y Planes Anuales' },
  'catalog.sim_lead': {
    en: 'All G-TECH PoC devices operate via encrypted nationwide and international cellular networks with zero distance limits. You can bundle your hardware order with pre-configured, multi-carrier SIM cards providing uninterrupted Tier-1 roaming under simple, flat-rate annual plans.',
    es: 'Todos los equipos PoC de G-TECH operan a través de redes celulares cifradas nacionales e internacionales sin límites de distancia. Puedes incluir en tu pedido tarjetas SIM multi-operador preconfiguradas con roaming Tier-1 sin interrupciones bajo tarifas planas anuales.'
  },
  'catalog.us_canada_mex': { en: 'United States, Canada & Mexico', es: 'Estados Unidos, Canadá y México' },
  'catalog.us_canada_mex_carriers': { en: 'Tier-1 Multi-Carrier: AT&T, T-Mobile, Verizon, Rogers, Telcel', es: 'Multi-Operador Tier-1: AT&T, T-Mobile, Verizon, Rogers, Telcel' },
  'catalog.latam': { en: 'Latin America (Pan-Regional)', es: 'Latinoamérica (Pan-Regional)' },
  'catalog.latam_carriers': { en: 'Multi-Network: Claro, Movistar, Tigo, Entel, Personal & Digitel', es: 'Multi-Red: Claro, Movistar, Tigo, Entel, Personal y Digitel' },
  'catalog.europe': { en: 'Europe (Pan-European)', es: 'Europa (Pan-Europeo)' },
  'catalog.europe_carriers': { en: 'Full EU & UK Roaming: Vodafone, Orange, Telefónica, O2', es: 'Roaming Completo UE y UK: Vodafone, Orange, Telefónica, O2' },
  'catalog.global_multi': { en: 'Global Multi-Carrier (Worldwide)', es: 'Global Multi-Operador (Mundial)' },
  'catalog.global_multi_carriers': { en: 'Multi-IMSI Autonomous Roaming in 160+ Countries', es: 'Roaming Multi-IMSI Autónomo en más de 160 Países' },
  'catalog.per_year': { en: '/year', es: '/año' },
  'catalog.annual_official': { en: 'Official Annual Rate', es: 'Tarifa Anual Oficial' },
  'catalog.annual_flat': { en: 'Flat Annual Fee • No Contracts', es: 'Tarifa Plana Anual • Sin Contratos' },
  'catalog.sim_select_prompt': { en: 'Select your coverage zone below to bundle with this radio:', es: 'Selecciona tu zona de cobertura para incluir con este radio:' },
  'catalog.feat_activation': { en: 'Zero Activation Fees', es: 'Sin Costos de Activación' },
  'catalog.feat_aes': { en: 'AES-256 Voice Encryption', es: 'Cifrado de Voz AES-256' },
  'catalog.feat_apn': { en: 'Pre-Configured Private APN', es: 'APN Privado Pre-Configurado' },
  'catalog.feat_carrier': { en: 'Automatic Carrier Hopping', es: 'Salto Automático de Portadora' },
  'catalog.feat_airtime': { en: 'Unlimited PTT Airtime', es: 'Tiempo de Voz PTT Ilimitado' },
  'catalog.feat_cancel': { en: 'Zero Monthly Lock-ins', es: 'Sin Permanencia Mensual' },
  'catalog.inquire_sim_whatsapp': { en: 'Inquire Radio + SIM via WhatsApp', es: 'Cotizar Radio + SIM por WhatsApp' },
  'cart.sim_addon_title': { en: 'Annual PoC SIM Coverage Card', es: 'Tarjeta SIM PoC de Cobertura Anual' },
  'cart.sim_addon_prompt': { en: 'Include pre-activated Annual SIM card with your order:', es: 'Incluir tarjeta SIM anual preactivada con tu pedido:' },
  'cart.sim_none': { en: 'None (Hardware Only)', es: 'Ninguna (Solo Equipos)' },

  // SIM Section
  'sim_section.badge': { en: 'Cellular IoT Connectivity & Multi-Carrier SIMs', es: 'Conectividad Celular IoT & SIMs Multi-Operador' },
  'sim_section.title': { en: 'Annual PoC SIM Card Data Plans', es: 'Planes Anuales de Tarjetas SIM PoC' },
  'sim_section.subtitle': {
    en: 'Official flat annual rates with zero monthly lock-ins. Uninterrupted Tier-1 multi-carrier coverage with automatic antenna hopping for all your G-TECH tactical radios.',
    es: 'Tarifas planas anuales oficiales sin contratos mensuales. Cobertura ininterrumpida Tier-1 con conmutación automática de red para todos tus radios tácticos G-TECH.'
  },
  'sim_section.rate_usa': { en: 'United States, Canada & Mexico', es: 'Estados Unidos, Canadá y México' },
  'sim_section.rate_usa_carriers': { en: 'Tier-1 Multi-Carrier: AT&T, T-Mobile, Verizon, Rogers, Telcel', es: 'Multi-Operador Tier-1: AT&T, T-Mobile, Verizon, Rogers, Telcel' },
  'sim_section.rate_latam': { en: 'Latin America (Pan-Regional)', es: 'Latinoamérica (Pan-Regional)' },
  'sim_section.rate_latam_carriers': { en: 'Claro, Movistar, Tigo, Entel, Personal & Digitel', es: 'Claro, Movistar, Tigo, Entel, Personal y Digitel' },
  'sim_section.rate_europe': { en: 'Europe (Pan-European)', es: 'Europa (Pan-Europeo)' },
  'sim_section.rate_europe_carriers': { en: 'Full EU & UK Roaming: Vodafone, Orange, Telefónica, O2', es: 'Roaming Completo UE y UK: Vodafone, Orange, Telefónica, O2' },
  'sim_section.rate_global': { en: 'Global Multi-Carrier (Worldwide)', es: 'Global Multi-Operador (Mundial)' },
  'sim_section.rate_global_carriers': { en: 'Autonomous Multi-IMSI across 160+ Countries', es: 'Multi-IMSI Autónomo en más de 160 Países' },
  'sim_section.per_year': { en: '/year', es: '/año' },
  'sim_section.badge_activation': { en: 'Zero Activation Fees', es: 'Cero Costos de Activación' },
  'sim_section.badge_aes': { en: 'AES-256 Voice Encryption', es: 'Cifrado de Voz AES-256' },
  'sim_section.badge_apn': { en: 'Pre-Configured Private APN', es: 'APN Privado Preconfigurado' },
  'sim_section.badge_unlimited': { en: 'Unlimited PTT Airtime', es: 'Voz PTT Ilimitada' },
  'sim_section.btn_consult': { en: 'Inquire SIM Plans via WhatsApp', es: 'Cotizar Tarjetas SIM por WhatsApp' },

  // Legal & Cookies
  'cookie.title': { en: 'Cookie & Data Privacy Notice', es: 'Aviso de Cookies y Privacidad' },
  'cookie.text': {
    en: 'G-TECH.US uses essential local storage to remember your quotation cart and language preferences. No tracking data is sold. Compliant with Florida FIPA.',
    es: 'G-TECH.US utiliza almacenamiento local esencial para recordar tu carrito de cotización y preferencias de idioma. No se venden datos de rastreo. Conforme a Florida FIPA.'
  },
  'cookie.accept_all': { en: 'Accept All', es: 'Aceptar Todo' },
  'cookie.essential_only': { en: 'Essential Only', es: 'Solo Esenciales' }
};

let currentLanguage: Language = 'en';
const listeners: Array<(lang: Language) => void> = [];

export function initI18n(): Language {
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved === 'en' || saved === 'es') {
    currentLanguage = saved;
  } else {
    // Check browser preference
    const navLang = navigator.language?.toLowerCase() || '';
    if (navLang.startsWith('es')) {
      currentLanguage = 'es';
    } else {
      currentLanguage = 'en';
    }
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  }
  return currentLanguage;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language): void {
  if (currentLanguage === lang) return;
  currentLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  notifyListeners();
}

export function toggleLanguage(): Language {
  const next: Language = currentLanguage === 'en' ? 'es' : 'en';
  setLanguage(next);
  return next;
}

export function t(key: string): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[currentLanguage] || entry.en || key;
}

export function onLanguageChange(fn: (lang: Language) => void): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners(): void {
  listeners.forEach(fn => fn(currentLanguage));
}

export interface ProductLocalizedContent {
  name: string;
  badge: string;
  description: string;
}

const SPEC_LABELS_ES: Record<string, string> = {
  'Antenna': 'Antena',
  'Antenna System': 'Sistema de Antena',
  'Application': 'Aplicación',
  'Audio': 'Audio',
  'Battery': 'Batería',
  'Branding': 'Marca',
  'Buoyancy': 'Flotabilidad',
  'Certifications': 'Certificaciones',
  'Colorway': 'Color',
  'Controls': 'Controles',
  'Coverage': 'Cobertura',
  'Deployment': 'Despliegue',
  'Design': 'Diseño',
  'Dispatch Keys': 'Teclas de Despacho',
  'Display': 'Pantalla',
  'Dual Watch': 'Doble Vigilancia',
  'Emergency': 'Emergencia',
  'Ergonomics': 'Ergonomía',
  'Finishes': 'Acabados',
  'Flashlight': 'Linterna',
  'Form Factor': 'Factor de Forma',
  'Frequency Band': 'Banda de Frecuencia',
  'Housing': 'Carcasa',
  'Interface': 'Interfaz',
  'Keypad': 'Teclado',
  'Microphone': 'Micrófono',
  'Navigation': 'Navegación',
  'Network': 'Red',
  'Night Vision': 'Visión Nocturna',
  'Operating Modes': 'Modos de Operación',
  'Power Input': 'Alimentación',
  'PTT': 'PTT',
  'PTT Interface': 'Interfaz PTT',
  'RF Bands': 'Bandas RF',
  'RF Output Power': 'Potencia de Salida RF',
  'Rotary Control': 'Control Rotativo',
  'Safety Standard': 'Estándar de Seguridad',
  'Screen Telemetry': 'Telemetría de Pantalla',
  'Speaker': 'Altavoz',
  'Storage': 'Almacenamiento',
  'Video Resolution': 'Resolución de Video',
  'Voice PTT': 'PTT de Voz',
  'Waterproof': 'Resistencia al Agua'
};

export function tSpecLabel(label: string): string {
  if (currentLanguage !== 'es') return label;
  return SPEC_LABELS_ES[label] || label;
}

export const PRODUCT_TRANSLATIONS_ES: Record<string, ProductLocalizedContent> = {
  'G-889': {
    name: 'Radio PoC G-889 de Doble Antena',
    badge: 'PoC Doble Antena',
    description: 'Radio híbrida PoC de alto rendimiento con doble antena (látigo UHF/VHF extendido y antena stubby LTE) para máxima sensibilidad y cobertura celular nacional. Cuenta con teclado alfanumérico completo DTMF de 12 teclas, pantalla a color de alto contraste y altavoz de alta potencia acústica.'
  },
  'G-F1': {
    name: 'Terminal Inteligente PoC Modelo G-F1',
    badge: 'Terminal Smart PoC',
    description: 'Radio portátil PoC con formato ultra-ergonómico, pantalla vertical HD a color y navegación simplificada de 3 teclas. Diseñada para despacho rápido, cambio intuitivo de grupos de llamada y audio digital push-to-talk ultra nítido.'
  },
  'G-280-2': {
    name: 'Radio Híbrida Dual-Mode Modelo G-280-2',
    badge: '3W UHF + 4G PoC',
    description: 'Dispositivo táctico híbrido de comunicación dual que integra radiofrecuencia analógica directa UHF de 3W con conectividad celular 4G LTE nacional. Garantiza comunicación continua incluso fuera del rango de cobertura celular.'
  },
  'Model-G-M2': {
    name: 'Radio Portátil de Solapa / Clip Modelo G-M2',
    badge: 'Clip Táctico Ultraliviano',
    description: 'Equipo PoC ultracompacto y liviano con clip de sujeción para solapa o chaleco. Ideal para personal de seguridad encubierta, eventos masivos, hotelería y logística de respuesta rápida con audio manos libres.'
  },
  'G-510': {
    name: 'Radio PoC Táctica de Bolsillo Modelo G-510',
    badge: 'PoC Táctico Compacto',
    description: 'Radio PoC de perfil ultra-delgado con chasis reforzado de grado industrial. Proporciona comunicaciones push-to-talk inmediatas en redes celulares con batería de larga duración para turnos continuos.'
  },
  'G-H28': {
    name: 'Radio Táctica PoC Modelo G-H28 con Teclado',
    badge: 'PoC Táctico con Teclado',
    description: 'Estación móvil PoC con teclado numérico frontal completo y pantalla LCD nítida. Permite marcación directa individual, gestión de canales grupales y despacho rápido para coordinadores de seguridad y operaciones.'
  },
  'G-P0-Black': {
    name: 'Radio Marina Flotante Modelo P0 (Edición Negra)',
    badge: 'Marina Flotante IP68',
    description: 'Radio marina con flotabilidad positiva automática y certificación de estanqueidad IP68. Continúa flotando en el agua con activación de luz estroboscópica de emergencia. Ideal para operaciones portuarias y rescate acuático.'
  },
  'P0-Ex-Blue': {
    name: 'Radio Marina Flotante Modelo P0-Ex (Edición ATEX Azul)',
    badge: 'ATEX / Ex Anti-Explosión',
    description: 'Versión certificada intrínsecamente segura (ATEX / Ex) para zonas con riesgo de gases inflamables, petroquímica, minería y puertos de carga de combustible. Chasis sellado con flotación marina.'
  },
  'WA0058-Vehicle': {
    name: 'Transmisor Móvil Vehicular PoC G-TECH',
    badge: 'Radio Móvil de Flota',
    description: 'Estación de radio móvil para vehículos comerciales, patrullas, ambulancias y camiones de transporte pesado. Se conecta a 12V/24V con micrófono de mano ergonómico y altavoz frontal de alta presión acústica.'
  },
  'WA0060-Armor': {
    name: 'Radio Blindada G-TECH Digital Armor Doble Perilla',
    badge: 'Mil-Spec Doble Perilla',
    description: 'Radio robusta de alta resistencia con doble dial giratorio independiente (volumen y selector de grupo). Chasis blindado Mil-Spec diseñado para operar con guantes tácticos en condiciones extremas de lluvia y polvo.'
  },
  'WA0062-TriMode': {
    name: 'Radio Híbrida Tri-Mode PoC + DMR G-TECH',
    badge: 'Tri-Mode VHF/UHF + PoC',
    description: 'La solución definitiva de interoperabilidad táctica: compatibilidad triple en frecuencias analógicas VHF, frecuencias digitales DMR Tier II y Push-to-Talk celular 4G LTE con cambio automático de portadora.'
  },
  'WA0064-LongRange': {
    name: 'Radio de Comando de Largo Alcance PoC + VHF/UHF G-TECH',
    badge: 'Comando Híbrido Largo Alcance',
    description: 'Terminal de mando para líderes de escuadrón y supervisores de área. Equipada con antena de látigo de alta ganancia, pantalla amplia y protocolos avanzados de llamada prioritaria y emergencia SOS.'
  },
  'WA0055-GlobalLTE': {
    name: 'Radio Táctica PoC G-TECH Global LTE',
    badge: 'PoC Global LTE',
    description: 'Radio digital celular con antena optimizada de aleta protegida y conexión multi-operador para roaming ininterrumpido en todo Estados Unidos y cobertura internacional sin cargos de activación.'
  },
  'WA0057-TacticalField': {
    name: 'Radio Táctica de Campo PoC G-TECH',
    badge: 'PoC Táctico de Campo',
    description: 'Diseño reforzado para operaciones tácticas y patrullaje perimetral. Incorpora cancelación de ruido digital con procesador DSP para transmisión de voz cristalina en entornos de alto ruido ambiental.'
  },
  'WA0066-Alervites': {
    name: 'Radio Comercial Ultra-Slim Alervites G-34181',
    badge: 'Comercial Ultra-Delgada',
    description: 'Radio comercial ligera y estilizada pensada para comercios minoristas, centros comerciales, producción de eventos y seguridad corporativa con interfaz intuitiva y discreta.'
  },
  'WA0069-Bodycam': {
    name: 'Terminal Bodycam 1080p + Radio PoC BQ-K8',
    badge: 'Video 1080p + 4G PoC',
    description: 'Dispositivo integrado de videovigilancia corporal con cámara Full HD 1080p, visión nocturna infrarroja con 8 LEDs IR, telemetría GPS en tiempo real y transmisión Push-To-Talk sobre red 4G celular.'
  }
};

export function getLocalizedProduct<T extends { id: string; name: string; badge: string; description: string }>(p: T): T {
  if (currentLanguage === 'es') {
    const trans = PRODUCT_TRANSLATIONS_ES[p.id];
    if (trans) {
      return {
        ...p,
        name: trans.name,
        badge: trans.badge,
        description: trans.description
      };
    }
  }
  return p;
}

