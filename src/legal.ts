import { getLanguage, onLanguageChange, t } from './i18n';

const COOKIE_STORAGE_KEY = 'gtech_cookie_consent';

export type LegalDocType = 'ai' | 'fcc' | 'privacy' | 'terms';

interface LegalDoc {
  title: { en: string; es: string };
  badge: { en: string; es: string };
  contentHtml: { en: string; es: string };
}

const LEGAL_DOCS: Record<LegalDocType, LegalDoc> = {
  ai: {
    title: {
      en: 'Artificial Intelligence Transparency & FTC Compliance Disclosure',
      es: 'Divulgación de Transparencia de Inteligencia Artificial y Cumplimiento FTC'
    },
    badge: {
      en: 'FTC Section 5 Compliance • Digital Asset Disclosure',
      es: 'Cumplimiento FTC Sección 5 • Declaración de Activos Digitales'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs">
            <strong>Legal Notice (FTC Digital Transparency 2025/2026):</strong> This disclosure is published in full accordance with Section 5 of the Federal Trade Commission Act regarding fair digital advertising practices and algorithmic transparency.
          </div>

          <h4 class="font-bold text-navy-900 text-base">1. Scope of Artificial Intelligence Usage</h4>
          <p>
            G-TECH.US utilizes cutting-edge Artificial Intelligence (AI) and generative software tools exclusively for the following operational workflows:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Frontend Web Architecture & UI Design:</strong> Layout generation, assistive coding, CSS utility composition, and responsive user experience design.</li>
            <li><strong>Digital Conceptual Media & Creative Artwork:</strong> Background atmospheric styling, stylized cutouts, and graphical conceptual renders (e.g., tactical badges, interactive catalog mockups).</li>
            <li><strong>Editorial Synthesis & Language Localization:</strong> Translation assistance, structural text formatting, and initial bilingual drafting.</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">2. Physical Hardware Authenticity Guarantee</h4>
          <p>
            <strong>All tactical radio hardware, specifications, certifications (CE, FCC), frequencies, and performance metrics displayed on G-TECH.US represent real, physical, and field-tested telecommunications equipment.</strong> No artificial intelligence tool has fabricated, exaggerated, or synthesized physical hardware capabilities, battery runtimes, IP ingress ratings, or ballistic drop tests.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Customer Reviews and Telemetry Integrity</h4>
          <p>
            In strict compliance with FTC guidelines prohibiting synthetic personas and fake endorsements, G-TECH.US does not employ AI-generated customer testimonials, fake user personas, or simulated reviews. All customer communications are conducted directly through verified engineering channels with Geramel and the G-Tech technical team.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            Effective Date: September 2026 • G-TECH.US Legal Compliance Directorate • Orlando, Florida.
          </div>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs">
            <strong>Aviso Legal (Transparencia Digital FTC 2025/2026):</strong> Esta declaración se publica en estricto apego a la Sección 5 de la Ley de la Comisión Federal de Comercio (FTC) sobre prácticas comerciales justas y transparencia algorítmica.
          </div>

          <h4 class="font-bold text-navy-900 text-base">1. Alcance del Uso de Inteligencia Artificial</h4>
          <p>
            G-TECH.US utiliza herramientas avanzadas de Inteligencia Artificial (IA) y software generativo exclusivamente para los siguientes procesos operativos:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Arquitectura Web y Diseño de Interfaz:</strong> Generación de maquetación, asistencia de código, optimización de hojas de estilo y diseño responsivo.</li>
            <li><strong>Material Gráfico Conceptual y Creativo:</strong> Fondos atmosféricos, recortes estilizados e ilustraciones conceptuales del catálogo interactivo.</li>
            <li><strong>Síntesis Editorial y Localización Bilingüe:</strong> Asistencia en traducción, estructuración de contenido y redacción bilingüe inicial.</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">2. Garantía de Autenticidad del Hardware Físico</h4>
          <p>
            <strong>Todos los equipos de radio tácticos, especificaciones técnicas, certificaciones (CE, FCC), bandas de frecuencia y métricas de rendimiento reflejan equipos físicos, reales y probados en campo.</strong> Ninguna herramienta de IA ha falsificado ni exagerado especificaciones mecánicas, duraciones de batería, certificaciones de estanqueidad IP o pruebas de caída.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Integridad de Reseñas y Canales de Atención</h4>
          <p>
            En cumplimiento estricto con las directrices de la FTC que prohíben testimonios sintéticos, G-TECH.US no utiliza reseñas inventadas ni perfiles artificiales de clientes. Toda atención técnica y comercial se realiza directamente a través de los canales verificados de Geramel y el equipo técnico oficial de G-Tech.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            Fecha de Entrada en Vigor: Septiembre 2026 • Dirección de Cumplimiento Legal G-TECH.US • Orlando, Florida.
          </div>
        </div>
      `
    }
  },

  fcc: {
    title: {
      en: 'FCC Regulatory Telecommunications & Emergency 911 Disclaimer',
      es: 'Aviso Regulatorio de Telecomunicaciones FCC y Servicios de Emergencia 911'
    },
    badge: {
      en: 'Federal Communications Commission Notice • Public Safety Warning',
      es: 'Aviso de la Comisión Federal de Comunicaciones • Alerta de Seguridad Pública'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            CRITICAL SAFETY NOTICE: Push-to-Talk over Cellular (PoC) hardware does NOT replace standard 911 emergency services.
          </div>

          <h4 class="font-bold text-navy-900 text-base">1. Commercial Cellular Network Dependency</h4>
          <p>
            G-TECH PoC devices operate utilizing commercial wireless data carriers (4G LTE, Wi-Fi, and VoIP IP protocols). Consequently, PoC transmissions are subject to the real-time operational availability, coverage contours, and network congestion of third-party public cellular carriers. G-TECH Communications does not control cellular cell-tower infrastructure or power grids.
          </p>

          <h4 class="font-bold text-navy-900 text-base">2. Non-Substitution of Municipal 911 (E911)</h4>
          <p>
            PoC radios and dispatch applications are engineered for private team collaboration, logistics, private security, and fleet dispatch. <strong>They are NOT certified replacements for municipal Public Safety Answering Points (PSAP), Enhanced 911 (E911) emergency services, or hardened Land Mobile Radio (LMR) / APCO Project 25 (P25) emergency networks.</strong> In critical, life-threatening emergencies, personnel must utilize dedicated standard cellular phones dialing 911 or certified public safety dispatch channels.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. FCC Part 15 and Regulatory Approvals</h4>
          <p>
            G-TECH communications devices conform to applicable FCC Part 15 and Part 90 radiation limits and electromagnetic compatibility standards. Operation is subject to the condition that the device does not cause harmful radio interference to licensed services.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            G-TECH.US Telecommunications Regulatory Division • Orlando, Florida, USA.
          </div>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            AVISO CRÍTICO DE SEGURIDAD: Los equipos Push-to-Talk over Cellular (PoC) NO reemplazan los servicios de emergencia 911.
          </div>

          <h4 class="font-bold text-navy-900 text-base">1. Dependencia de Redes Celulares Comerciales</h4>
          <p>
            Las radios PoC de G-TECH operan mediante redes de datos celulares comerciales (4G LTE, Wi-Fi y protocolos IP VoIP). Por consiguiente, la transmisión está sujeta a la cobertura, congestión y disponibilidad de los operadores de telefonía móvil de terceros. G-TECH Comunicaciones no administra torres celulares ni tendidos de telecomunicaciones públicos.
          </p>

          <h4 class="font-bold text-navy-900 text-base">2. No Sustitución de Líneas de Emergencia 911 (E911)</h4>
          <p>
            Las radios PoC están diseñadas para coordinación de flotas, seguridad privada, logística comercial e industria. <strong>NO constituyen un sustituto certificado para los Centros de Atención de Emergencias 911 (PSAP), servicios E911 ni sistemas de radio Land Mobile Radio (LMR) / P25 de seguridad pública del estado.</strong> Ante situaciones de riesgo de vida, el personal debe emplear teléfonos con marcación directa a emergencias 911.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Cumplimiento con Normativa FCC Parte 15</h4>
          <p>
            Los dispositivos cumplen con los límites de radiación y compatibilidad electromagnética aplicables de la Comisión Federal de Comunicaciones (FCC Parte 15/90). Su uso está sujeto a no provocar interferencias perjudiciales a frecuencias licenciadas.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            División Regulatoria de Telecomunicaciones G-TECH.US • Orlando, Florida, EE.UU.
          </div>
        </div>
      `
    }
  },

  privacy: {
    title: {
      en: 'Privacy Policy & Data Protection (Florida FIPA)',
      es: 'Política de Privacidad y Protección de Datos (Florida FIPA)'
    },
    badge: {
      en: 'Florida Information Protection Act (FIPA) Compliant',
      es: 'Conforme a la Ley de Protección de Información de Florida (FIPA)'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            G-TECH Communications ("G-TECH.US", "we", "our"), operated under the management of Geramel based in Orlando, Florida, is committed to safeguarding personal information in strict compliance with the <strong>Florida Information Protection Act (FIPA, Fla. Stat. § 501.171)</strong> and FTC privacy regulations.
          </p>

          <h4 class="font-bold text-navy-900 text-base">1. Information We Collect</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Quotation Requests:</strong> Selected device models, quantities, and optional destination city when generating quotation requests.</li>
            <li><strong>Direct Communications:</strong> Contact information provided when contacting us via WhatsApp (+1 407-427-3356) or email (gtech.usfl@gmail.com).</li>
            <li><strong>Technical Local Storage:</strong> Essential client-side session keys (<code>gtech_cart_v2</code>, <code>gtech_lang</code>, and cookie consent preferences).</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">2. Third-Party Messaging Services (WhatsApp / Meta)</h4>
          <p>
            When utilizing the "Request Quote via WhatsApp" feature, quotation details are securely transferred to WhatsApp (Meta Platforms, Inc.). Such communications are subject to end-to-end encryption protocols in accordance with WhatsApp's privacy standards. We do not sell or monetize quotation data.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Future Customer Portal & Database Safeguards</h4>
          <p>
            Any customer accounts, lead logs, or quotation records maintained in our forthcoming cloud administrative portal will adhere to AES-256 data-at-rest encryption and TLS 1.3 data-in-transit security standards.
          </p>

          <h4 class="font-bold text-navy-900 text-base">4. Your Privacy Rights</h4>
          <p>
            Florida and US residents may request access to, correction, or deletion of their contact records at any time by emailing <code>gtech.usfl@gmail.com</code>.
          </p>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            G-TECH Comunicaciones ("G-TECH.US"), operado bajo la dirección de Geramel en Orlando, Florida, protege los datos personales de sus clientes en estricto cumplimiento con la <strong>Ley de Protección de Información de Florida (FIPA, Fla. Stat. § 501.171)</strong> y directrices de la FTC.
          </p>

          <h4 class="font-bold text-navy-900 text-base">1. Información que Recopilamos</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Solicitudes de Cotización:</strong> Equipos seleccionados, cantidades y destino especificado por el usuario al generar la cotización.</li>
            <li><strong>Canales de Contacto Directo:</strong> Número de teléfono y correo electrónico cuando se comunica vía WhatsApp (+1 407-427-3356) o Gmail (gtech.usfl@gmail.com).</li>
            <li><strong>Almacenamiento Local Técnico:</strong> Claves locales esenciales (<code>gtech_cart_v2</code>, <code>gtech_lang</code> y preferencias de cookies).</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">2. Servicios de Mensajería de Terceros (WhatsApp / Meta)</h4>
          <p>
            Al pulsar "Solicitar Cotización por WhatsApp", los datos del carrito se transfieren a la aplicación WhatsApp (Meta Platforms, Inc.), operando bajo cifrado de extremo a extremo. G-TECH no comercializa ni vende datos de contacto a terceros.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Seguridad en la Futura Base de Datos y Panel de Gestión</h4>
          <p>
            Los registros de leads y pedidos que se gestionen en el próximo portal administrativo en la nube se almacenarán con cifrado AES-256 en reposo y transmisión segura TLS 1.3.
          </p>

          <h4 class="font-bold text-navy-900 text-base">4. Derechos del Usuario</h4>
          <p>
            Los usuarios pueden solicitar en cualquier momento la consulta o eliminación de sus datos de contacto escribiendo a <code>gtech.usfl@gmail.com</code>.
          </p>
        </div>
      `
    }
  },

  terms: {
    title: {
      en: 'Commercial Terms of Service & Quotation Conditions',
      es: 'Términos Comerciales de Servicio y Condiciones de Cotización'
    },
    badge: {
      en: 'Commercial Hardware Agreement • Florida Jurisdiction',
      es: 'Acuerdo Comercial de Hardware • Jurisdicción de Florida'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h4 class="font-bold text-navy-900 text-base">1. Nature of the Quotation Station</h4>
          <p>
            The "Quotation Station" on G-TECH.US facilitates rapid generation of price estimates, inventory inquiries, and fleet specifications. <strong>Submission of a quotation request via WhatsApp or email does NOT constitute a final binding contract of sale.</strong> A binding commercial transaction occurs only upon issuance and client approval of a formal Pro-Forma Invoice and payment confirmation.
          </p>

          <h4 class="font-bold text-navy-900 text-base">2. Limited Factory Warranty Policy (1 Week)</h4>
          <p>
            Products and equipment do not include warranty except strictly and exclusively for verified manufacturer factory defects upon delivery. In such cases, a strict limited warranty of one (1) week (7 calendar days) applies, beginning from the date of receipt, to report and process any factory defect. Outside of this 1-week window, or for any issue resulting from misuse, drops, unauthorized moisture exposure, improper electrical input, or physical tampering, no warranty is provided.
          </p>
 
          <h4 class="font-bold text-navy-900 text-base">3. Cellular SIM Subscriptions & Carrier Service</h4>
          <p>
            SIM data packages and cellular connectivity services provided through G-TECH are provisioned via partner multi-carrier IoT networks. Active service requires continuous account standing. Airtime plans carry no activation fees and can be managed per mission requirements.
          </p>
 
          <h4 class="font-bold text-navy-900 text-base">4. Governing Law & Arbitration</h4>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of the State of Florida, USA. Any unresolved commercial dispute shall be submitted to binding arbitration in Orange County, Florida.
          </p>
 
          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            🐺 G tech (G-TECH.US) • Registered Commercial Entity • Orlando, Florida, USA.
          </div>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h4 class="font-bold text-navy-900 text-base">1. Naturaleza de la Estación de Cotización</h4>
          <p>
            La "Estación de Cotización" de G-TECH.US permite generar estimaciones de costos, consultas de inventario y pedidos de flotas. <strong>El envío de una cotización por WhatsApp o correo NO constituye una compraventa vinculante inmediata.</strong> El contrato comercial se formaliza una vez aprobada la Factura Pro-Forma oficial y confirmado el pago correspondiente.
          </p>
 
          <h4 class="font-bold text-navy-900 text-base">2. Política de Garantía Limitada de Fábrica (1 Semana)</h4>
          <p>
            Los equipos no cuentan con garantía a menos que se trate estrictamente de un defecto de fábrica comprobado de origen. En dicho caso, el cliente cuenta con un plazo estricto de garantía de una (1) semana (7 días continuos) a partir de la recepción del producto para reportar la falla. Fuera de ese período de una semana, o ante daños ocasionados por golpes, mal uso, humedad no permitida, sobrecarga eléctrica o manipulación indebida, los equipos no tienen garantía bajo ninguna circunstancia.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Planes de Datos SIM y Conectividad</h4>
          <p>
            Los planes de datos celulares globales se suministran a través de redes IoT multi-operador aliadas. El servicio no tiene costos ocultos de activación y puede renovarse o gestionarse según las necesidades de la flota.
          </p>

          <h4 class="font-bold text-navy-900 text-base">4. Ley Aplicable y Jurisdicción</h4>
          <p>
            Estos términos se rigen bajo las leyes del Estado de Florida, EE.UU. Cualquier controversia comercial se resolverá bajo arbitraje vinculante en el Condado de Orange, Florida.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            🐺 G tech (G-TECH.US) • Entidad Comercial • Orlando, Florida, EE.UU.
          </div>
        </div>
      `
    }
  }
};

export function initLegalModule(): void {
  renderCookieBanner();
  onLanguageChange(() => {
    if (document.getElementById('cookie-banner')) {
      renderCookieBanner();
    }
  });
}

export function openLegalModal(type: LegalDocType): void {
  const modalOverlay = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-content');
  if (!modalOverlay || !modalContent) return;

  const doc = LEGAL_DOCS[type];
  if (!doc) return;

  const lang = getLanguage();
  const title = doc.title[lang];
  const badge = doc.badge[lang];
  const content = doc.contentHtml[lang];

  modalContent.innerHTML = `
    <div class="relative animate-fade-in max-h-[82vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 flex-shrink-0">
        <div class="pr-6">
          <span class="inline-block text-[10px] font-extrabold uppercase tracking-wider text-crimson-700 bg-crimson-50 px-2.5 py-1 rounded-md border border-crimson-100 mb-1">
            ${badge}
          </span>
          <h3 class="text-lg sm:text-xl font-black text-navy-900 leading-snug">${title}</h3>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-navy-900 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0" aria-label="Close modal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Scrollable Legal Body -->
      <div class="overflow-y-auto pr-1 flex-1 space-y-4">
        ${content}
      </div>

      <!-- Footer Action -->
      <div class="pt-4 mt-4 border-t border-gray-100 flex justify-end flex-shrink-0">
        <button onclick="closeModal()" class="px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-navy-800 bg-gray-100 hover:bg-gray-200 transition-colors text-xs">
          ${lang === 'es' ? 'Cerrar Documento' : 'Close Document'}
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.remove('hidden');
  modalOverlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

export function renderCookieBanner(force: boolean = false): void {
  const existingConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
  if (existingConsent && !force) return;

  let container = document.getElementById('cookie-banner-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'cookie-banner-container';
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div id="cookie-banner" class="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-navy-950/95 backdrop-blur-md border border-navy-700/90 text-gray-200 p-5 rounded-2xl shadow-2xl z-[90] animate-fade-in flex flex-col gap-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span class="text-xs font-black uppercase tracking-wider text-white">
            ${t('cookie.title')}
          </span>
        </div>
        <button onclick="window.dismissCookieBanner('essential')" class="text-gray-400 hover:text-white p-1" aria-label="Dismiss">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <p class="text-[11px] text-gray-300 leading-relaxed">
        ${t('cookie.text')}
      </p>

      <div class="flex items-center gap-2 pt-1 text-xs">
        <button onclick="window.dismissCookieBanner('all')" class="flex-1 bg-crimson-800 hover:bg-crimson-900 text-white font-bold py-2 px-3 rounded-xl transition-all shadow-md text-center text-xs">
          ${t('cookie.accept_all')}
        </button>
        <button onclick="window.dismissCookieBanner('essential')" class="flex-1 bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white font-semibold py-2 px-3 rounded-xl transition-all border border-navy-700 text-center text-xs">
          ${t('cookie.essential_only')}
        </button>
      </div>
    </div>
  `;
}

export function dismissCookieBanner(type: 'all' | 'essential'): void {
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ type, timestamp: Date.now() }));
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(12px)';
    setTimeout(() => banner.remove(), 210);
  }
}

// Expose globally for HTML onclick handlers
(window as any).openLegalModal = openLegalModal;
(window as any).dismissCookieBanner = dismissCookieBanner;
(window as any).renderCookieBanner = () => renderCookieBanner(true);
