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
  'nav.accessories': { en: 'Accessories', es: 'Accesorios' },
  'nav.accessories_full': { en: 'Tactical Accessories', es: 'Accesorios Tácticos' },

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
  'hero.badge_network': { en: '4G, 3G, 2G Active', es: '4G, 3G, 2G Activo' },
  'hero.badge_network_sub': { en: 'Multiband Network', es: 'Red Multibanda' },
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
    en: 'Direct engineering consultation and manufacturer factory defect support.',
    es: 'Consultoría técnica directa y soporte oficial ante defectos de fábrica.'
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
  'footer.facebook_btn': { en: 'Facebook Official', es: 'Facebook Oficial' },
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

  // Privacy Teaser Banner (index.html)
  'accessories_teaser.eyebrow': {
    en: 'Tactical Privacy & Discretion',
    es: 'Discreción y Privacidad Operativa'
  },
  'accessories_teaser.title': {
    en: 'Tired of everyone overhearing your radio communications?',
    es: '¿No te gusta que todos escuchen lo que hablas por tu radio?'
  },
  'accessories_teaser.subtitle': {
    en: 'Require mission-critical discretion? Upgrade your tactical setup with covert acoustic tube earpieces and shoulder PTT microphones engineered to isolate your voice and block ambient noise, so third parties never overhear your operations.',
    es: '¿Necesitas mayor privacidad en tus comunicaciones tácticas? Protege la confidencialidad de tus operaciones con nuestra línea oficial de accesorios: auriculares encubiertos de tubo acústico transparente y micrófonos de solapa PTT diseñados para aislar el sonido y operar sin interrupciones.'
  },
  'accessories_teaser.pill_earphones': {
    en: 'Covert Acoustic Tube Earpieces',
    es: 'Auriculares Encubiertos de Tubo Acústico'
  },
  'accessories_teaser.pill_mics': {
    en: 'IP56 Shoulder PTT Mics',
    es: 'Micrófonos de Hombro PTT IP56'
  },
  'accessories_teaser.pill_connectors': {
    en: 'Type-C & Type-K (2-Pin) Connectors',
    es: 'Conectores Type-C y Type-K (2 Pines)'
  },
  'accessories_teaser.cta_btn': {
    en: 'Explore Accessories Catalog',
    es: 'Explorar Catálogo de Accesorios'
  },
  'accessories_teaser.compatibility_hint': {
    en: '100% Compatible with the entire G-TECH fleet',
    es: 'Compatibles al 100% con toda la flota G-TECH'
  },

  // Accessories Subpage
  'accessories_page.hero_eyebrow': {
    en: 'Tactical Accessory Division',
    es: 'División de Accesorios Tácticos'
  },
  'accessories_page.hero_title': {
    en: 'Ready to elevate your operational communications to the next level?',
    es: '¿Deseas elevar tu experiencia operativa al siguiente nivel?'
  },
  'accessories_page.hero_subtitle': {
    en: 'Equip your operators with heavy-duty shoulder microphones and covert acoustic tube earpieces engineered for uncompromising privacy, noise isolation, and seamless mission readiness.',
    es: 'Equipa a tu equipo con micrófonos de hombro de uso rudo y auriculares encubiertos de tubo acústico diseñados para garantizar máxima privacidad, aislamiento de ruido en entornos hostiles y ergonomía profesional.'
  },
  'accessories_page.filter_all': { en: 'All Accessories', es: 'Todos los Accesorios' },
  'accessories_page.filter_mics': { en: 'Shoulder & Palm Microphones', es: 'Micrófonos de Solapa / Hombro' },
  'accessories_page.filter_earphones': { en: 'Covert Acoustic Earpieces', es: 'Auriculares Encubiertos de Tubo Acústico' },
  'accessories_page.btn_add_quote': { en: 'Add to Quote', es: 'Agregar a Cotización' },
  'accessories_page.btn_specs': { en: 'Technical Specs', es: 'Ver Ficha Técnica' },
  'accessories_page.btn_wa': { en: 'Inquire via WhatsApp', es: 'Consultar WhatsApp' },
  'accessories_page.back_to_fleet': { en: '← Back to PoC Radios', es: '← Volver a Radios PoC' },
  'accessories_page.badge_added': { en: 'Added to Quote', es: 'Agregado a Cotización' },
  'accessories_page.compatibility_title': { en: 'Connector Compatibility Guide', es: 'Guía de Conectores Compatibles' },
  'accessories_page.compatibility_subtitle': {
    en: 'Identify the physical plug your radio uses before ordering. G-TECH terminals ship with three distinct connector standards.',
    es: 'Identifica el conector físico que utiliza tu radio antes de ordenar. Los terminales G-TECH incluyen tres estándares de conexión distintos.'
  },
  'accessories_page.conn_typec_name': { en: 'USB Type-C', es: 'USB Type-C' },
  'accessories_page.conn_typec_desc': {
    en: 'Direct digital plug found on the G-Series (G0/G6/G8/G9, P0 IP6). No adapter required.',
    es: 'Conector digital directo presente en la Serie G (G0/G6/G8/G9, P0 IP6). No requiere adaptador.'
  },
  'accessories_page.conn_kplug_name': { en: 'Type-K (2-Pin Kenwood)', es: 'Type-K (2 pines Kenwood)' },
  'accessories_page.conn_kplug_desc': {
    en: 'Standard 3.5mm + 2.5mm two-pin plug found on the G-5288 Plus, G-889, G-280 and ALERVITES AT1.',
    es: 'Conector estándar de 2 pines (3.5mm + 2.5mm) presente en el G-5288 Plus, G-889, G-280 y ALERVITES AT1.'
  },
  'accessories_page.conn_rj_name': { en: 'Modular RJ Multi-Pin', es: 'Modular RJ Multi-Pin' },
  'accessories_page.conn_rj_desc': {
    en: 'Vehicle-grade multi-pin interface used by mobile transceivers such as the V1 PLUS and G-8900 Pro.',
    es: 'Interfaz multipin de grado vehicular utilizada por transceptores móviles como el V1 PLUS y el G-8900 Pro.'
  },
  'accessories_page.specs_title': { en: 'Technical Specification Sheet', es: 'Ficha Técnica' },
  'accessories_page.specs_compatible': { en: 'Compatible Radios', es: 'Radios Compatibles' },
  'accessories_page.specs_connector': { en: 'Connector', es: 'Conector' },
  'accessories_page.specs_price': { en: 'Estimated Unit Price', es: 'Precio Unitario Estimado' },
  'accessories_page.specs_secondary': { en: 'Official Datasheet / Reference', es: 'Ficha Oficial / Referencia' },
  'accessories_page.close': { en: 'Close', es: 'Cerrar' },
  'accessories_page.results': { en: 'items', es: 'artículos' },

  // AI Avatar Video Briefings
  'briefings.badge': {
    en: 'Official Broadcast // AI Avatar of Geramel',
    es: 'Transmisión Oficial // Avatar IA de Geramel'
  },
  'briefings.title': {
    en: 'Tactical Briefings & Video Demonstrations',
    es: 'Informes Tácticos y Demostraciones en Video'
  },
  'briefings.subtitle': {
    en: 'Exclusive technical capsules presented by the digital avatar of the G-TECH founder.',
    es: 'Cápsulas técnicas exclusivas presentadas por el avatar digital del fundador de G-TECH.'
  },
  'briefings.hd_label': { en: 'Optimized HD Audio & Video', es: 'Audio y Video HD Optimizado' },
  'briefings.expand': { en: 'Expand', es: 'Expandir' },
  'briefings.close': { en: 'Close video', es: 'Cerrar video' },
  'briefings.v1_status': { en: 'PoC Ecosystem', es: 'Ecosistema PoC' },
  'briefings.v1_eyebrow': { en: 'G-TECH Tactical Broadcast', es: 'G-TECH Tactical Broadcast' },
  'briefings.v1_title': {
    en: 'Introduction to the PoC Ecosystem & Cellular Communication',
    es: 'Introducción al Ecosistema PoC y Comunicación Celular'
  },
  'briefings.v1_desc': {
    en: 'Unlimited range demonstration and repeater-free push-to-talk architecture.',
    es: 'Demostración de alcance ilimitado y arquitectura push-to-talk sin repetidoras.'
  },
  'briefings.v2_status': { en: 'Global Coverage', es: 'Cobertura Global' },
  'briefings.v2_eyebrow': { en: 'Multi-Carrier Connectivity', es: 'Conectividad Multired' },
  'briefings.v2_title': {
    en: 'Automatic Switching & International Roaming',
    es: 'Conmutación Automática y Roaming Internacional'
  },
  'briefings.v2_desc': {
    en: 'Continuous field operation in more than 160 countries with tactical SIM cards.',
    es: 'Operatividad continua en campo en más de 160 países con tarjetas SIM tácticas.'
  },
  'briefings.v3_eyebrow': { en: 'End-to-End Encryption', es: 'Cifrado de Extremo a Extremo' },
  'briefings.v3_title': { en: 'AES-256 Security on Voice Channels', es: 'Seguridad AES-256 en Canales de Voz' },
  'briefings.v3_desc': {
    en: 'Protection against interception and unauthorized eavesdropping.',
    es: 'Protección contra intercepciones y escuchas no autorizadas.'
  },
  'briefings.v4_eyebrow': { en: 'Military Standard', es: 'Estándar Militar' },
  'briefings.v4_title': { en: 'Mil-Spec Drop and Immersion Resistance', es: 'Resistencia Mil-Spec a Caídas e Inmersión' },
  'briefings.v4_desc': {
    en: 'Reinforced chassis ready for high-impact operations.',
    es: 'Chasis reforzados listos para operaciones de alto impacto.'
  },
  'briefings.v5_eyebrow': { en: 'Rapid Dispatch', es: 'Despacho Rápido' },
  'briefings.v5_title': { en: 'Dispatch Console & Fleet Management', es: 'Consola de Despacho y Gestión de Flotas' },
  'briefings.v5_desc': {
    en: 'Real-time crew supervision and call recording.',
    es: 'Supervisión en tiempo real de cuadrillas y grabación de llamadas.'
  },

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
    en: 'Comparing top sellers: G-889 vs G-8 PLUS vs G0 PLUS',
    es: 'Comparando más vendidos: G-889 vs G-8 PLUS vs G0 PLUS'
  },

  // Extra Catalog & Modals
  'catalog.select_color': { en: 'Select Color:', es: 'Seleccionar Color:' },
  'catalog.colors_available': { en: 'Available Colors', es: 'Colores Disponibles' },
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
    en: 'Official flat annual rates with zero monthly lock-ins. Uninterrupted coverage with automatic network switching for all your G-TECH tactical radios.',
    es: 'Tarifas planas anuales oficiales sin contratos mensuales. Cobertura ininterrumpida con conmutación automática de red para todos tus radios tácticos G-TECH.'
  },
  'sim_section.rate_usa': { en: 'United States, Canada & Mexico', es: 'Estados Unidos, Canadá y México' },
  'sim_section.rate_usa_carriers': {
    en: 'Tier-1 Multi-Carrier: AT&T, T-Mobile, Verizon, Rogers, Telcel',
    es: 'Multicarrier Tier-1: AT&T, T-Mobile, Verizon, Rogers, Telcel'
  },
  'sim_section.rate_brazil': { en: 'Brazil', es: 'Brasil' },
  'sim_section.badge_brazil': { en: 'Brazil', es: 'Brasil' },
  'sim_section.rate_latam': { en: 'Latin America (Pan-Regional)', es: 'Latinoamérica (Pan-Regional)' },
  'sim_section.rate_latam_carriers': {
    en: 'Claro, Movistar, Tigo, Entel, Personal & Digitel',
    es: 'Claro, Movistar, Tigo, Entel, Personal y Digitel'
  },
  'sim_section.rate_europe': { en: 'Europe (Pan-European)', es: 'Europa (Pan-Europeo)' },
  'sim_section.rate_europe_carriers': {
    en: 'Full EU & UK Roaming: Vodafone, Orange, Telefónica, O2',
    es: 'Roaming completo UE y Reino Unido: Vodafone, Orange, Telefónica, O2'
  },
  'sim_section.rate_global': { en: 'Global Multi-Carrier (Worldwide)', es: 'Global Multi-Operador (Mundial)' },
  'sim_section.rate_global_carriers': {
    en: 'Autonomous Multi-IMSI across 160+ Countries',
    es: 'Multi-IMSI autónomo en más de 160 países'
  },
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
    name: 'G-889 POC-UHF',
    badge: 'HYBRID POC-UHF',
    description: 'Radio híbrida POC de alto rendimiento con doble antena (látigo UHF/VHF extendido y antena stubby LTE) para máxima sensibilidad y cobertura celular nacional. Cuenta con teclado alfanumérico completo DTMF de 12 teclas, pantalla a color de alto contraste y altavoz de alta potencia acústica.'
  },
  'G-F1': {
    name: 'G-F1 SMART POC RADIO',
    badge: 'SMART POC TERMINAL',
    description: 'Radio PoC inteligente de formato esbelto con pantalla vertical a color de alta definición y navegación minimalista de 3 teclas para despacho rápido.'
  },
  'G-P0-Black': {
    name: 'P0 IP6 BLACK FLOATING POC',
    badge: 'IP68 FLOATING MARINE POC',
    description: 'Radio PoC marina especializada con flotabilidad positiva que permanece a flote en el agua. Construcción sellada IP68 sumergible en Negro Táctico.'
  },
  'P0-Ex-Blue': {
    name: 'P0 IP6 BLUE ATEX FLOATING POC',
    badge: 'ATEX / EX FLOATING MARINE POC',
    description: 'Radio PoC marina certificada antiexplosiva (Ex) de seguridad intrínseca en Azul Marino ATEX. Sumergible IP68 y con flotabilidad positiva.'
  },
  'G-280-2': {
    name: 'G-280 POC-UHF',
    badge: 'HYBRID POC-UHF',
    description: 'Dispositivo táctico híbrido de comunicación dual que integra radiofrecuencia analógica directa UHF de 3W con conectividad celular 4G LTE nacional. Garantiza comunicación continua incluso fuera del rango de cobertura celular.'
  },
  'Model-G-M2': {
    name: 'G-M2 WEARABLE CLIP POC',
    badge: 'WEARABLE CLIP POC',
    description: 'Equipo POC ultracompacto y liviano con clip de sujeción para solapa o chaleco. Ideal para personal de seguridad encubierta, eventos masivos, hotelería y logística de respuesta rápida con audio manos libres.'
  },
  'G-510': {
    name: 'G-510 POCKET POC',
    badge: 'TACTICAL POCKET POC',
    description: 'Radio POC de perfil ultra-delgado con chasis reforzado de grado industrial. Proporciona comunicaciones push-to-talk inmediatas en redes celulares con batería de larga duración para turnos continuos.'
  },
  'G-H28': {
    name: 'G-H28 TACTICAL KEYPAD POC',
    badge: 'TACTICAL KEYPAD POC',
    description: 'Estación móvil POC con teclado numérico frontal completo y pantalla LCD nítida. Permite marcación directa individual, gestión de canales grupales y despacho rápido para coordinadores de seguridad y operaciones.'
  },
  'WA0058-Vehicle': {
    name: 'V1 PLUS POC GPS SOS 4G',
    badge: 'VEHICLE MOBILE POC',
    description: 'Estación de radio móvil vehicular para flotas comerciales, patrullas, ambulancias y transporte pesado. Se conecta a 12V/24V con micrófono de mano ergonómico, telemetría GPS en tiempo real y altavoz frontal de alta presión acústica.'
  },
  'WA0060-Armor': {
    name: 'G-6 PLUS POC',
    badge: 'MIL-SPEC DUAL-KNOB POC',
    description: 'Radio robusta de alta resistencia con doble dial giratorio independiente (volumen y selector de grupo). Chasis blindado Mil-Spec disponible en Negro Táctico y Verde Militar, diseñado para operar con guantes tácticos en condiciones extremas.'
  },
  'WA0062-TriMode': {
    name: 'G-8 PLUS TRI-MODE POC-UHF',
    badge: 'HYBRID POC-UHF',
    description: 'La solución definitiva de interoperabilidad táctica: compatibilidad triple en frecuencias analógicas VHF, frecuencias directas UHF y Push-to-Talk celular 4G LTE con cambio automático de portadora.'
  },
  'WA0064-LongRange': {
    name: 'G-5288 PLUS LONG-RANGE POC-UHF-VHF',
    badge: 'HYBRID POC-UHF-VHF',
    description: 'Terminal de mando para líderes de escuadrón y supervisores de área. Equipada con antena de látigo de alta ganancia, pantalla amplia y protocolos avanzados de llamada prioritaria y emergencia SOS.'
  },
  'WA0055-GlobalLTE': {
    name: 'G0 PLUS GLOBAL LITE POC',
    badge: 'GLOBAL LITE POC',
    description: 'Radio digital celular con antena optimizada de aleta protegida y conexión multi-operador para roaming ininterrumpido en todo Estados Unidos y cobertura internacional sin cargos de activación.'
  },
  'WA0057-TacticalField': {
    name: 'G-9 PLUS TACTICAL FIELD POC',
    badge: 'TACTICAL FIELD POC',
    description: 'Diseño reforzado para operaciones tácticas y patrullaje perimetral. Incorpora cancelación de ruido digital con procesador DSP para transmisión de voz cristalina en entornos de alto ruido ambiental.'
  },
  'WA0066-Alervites': {
    name: 'ALERVITES AT1 BY BAOFENG',
    badge: 'ALERVITES AT1 POC',
    description: 'Radio PoC comercial estilizada disponible en Negro Obsidiana, Gris Titanio y Blanco Ártico. Diseñada para seguridad corporativa, hotelería de lujo, gestión de eventos y logística comercial.'
  },
  'WA0069-Bodycam': {
    name: 'G-K8 4K BODYCAM POC',
    badge: '4K VIDEO + 4G POC',
    description: 'Dispositivo integrado de videovigilancia corporal con cámara 4K Ultra HD, visión nocturna infrarroja con 8 LEDs IR, telemetría GPS en tiempo real y transmisión Push-To-Talk sobre red 4G celular.'
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

