import { getLanguage, onLanguageChange, t } from './i18n';

const COOKIE_STORAGE_KEY = 'gtech_cookie_consent';

export type LegalDocType = 'ai' | 'fcc' | 'privacy' | 'terms' | 'dmca';

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
            <strong>Legal Notice (FTC Digital Transparency 2025/2026):</strong> This disclosure is published as part of our commitment to transparent digital practices.
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
            As part of our commitment to authenticity, G-TECH.US does not employ AI-generated customer testimonials, fake user personas, or simulated reviews. All customer communications are conducted directly through verified engineering channels with Geramel and the G-Tech technical team.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            Effective Date: September 2026 • G-TECH.US Legal Compliance Directorate • Orlando, Florida.
          </div>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs">
            <strong>Aviso Legal (Transparencia Digital FTC 2025/2026):</strong> Esta declaración se publica en consideración a las directrices de comercio sobre prácticas comerciales justas y transparencia algorítmica.
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
            Como parte de nuestro compromiso con la autenticidad, G-TECH.US no utiliza reseñas inventadas ni perfiles artificiales de clientes. Toda atención técnica y comercial se realiza directamente a través de los canales verificados de Geramel y el equipo técnico oficial de G-Tech.
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
            G-TECH communications devices conform to applicable FCC Part 15 and Part 90 radiation limits and electromagnetic compatibility standards. Operation is subject to the condition that the device does not cause harmful radio interference to licensed services. <strong>Warning: Operation of direct RF VHF/UHF radios (analog or digital) within the United States generally requires a valid FCC license (Part 90 Commercial or Part 95 GMRS). It is the purchaser's sole responsibility to obtain necessary licensing prior to transmitting on these frequencies.</strong>
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

          <h4 class="font-bold text-navy-900 text-base">3. Cumplimiento con Normativa FCC Parte 15/90</h4>
          <p>
            Los dispositivos cumplen con los límites de radiación y compatibilidad electromagnética aplicables de la Comisión Federal de Comunicaciones (FCC Parte 15/90). Su uso está sujeto a no provocar interferencias perjudiciales a frecuencias licenciadas. <strong>Advertencia: La operación de radios VHF/UHF de RF directa (analógicas o digitales) dentro de los EE.UU. generalmente requiere una licencia válida de la FCC (Parte 90 Comercial o Parte 95 GMRS). Es responsabilidad exclusiva del comprador obtener las licencias necesarias antes de transmitir en estas frecuencias.</strong>
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
      en: 'Privacy Policy & Comprehensive Regulatory Compliance (COPPA, CIPA, CAN-SPAM, FIPA & GDPR)',
      es: 'Política de Privacidad y Cumplimiento Regulatorio Integral (COPPA, CIPA, CAN-SPAM, FIPA y GDPR)'
    },
    badge: {
      en: 'Florida FIPA • COPPA 18+ • CIPA Wiretap Protection • CAN-SPAM Certified',
      es: 'Florida FIPA • COPPA 18+ • Protección CIPA • Certificado CAN-SPAM'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            G-TECH Communications ("G-TECH.US", "we", "our"), operated under the management of Geramel based in Orlando, Florida, is committed to safeguarding personal information in strict compliance with the <strong>Florida Information Protection Act (FIPA, Fla. Stat. § 501.171)</strong>, the <strong>Children's Online Privacy Protection Act (COPPA, 15 U.S.C. §§ 6501–6506)</strong>, the <strong>California Invasion of Privacy Act (CIPA § 631)</strong>, the <strong>CAN-SPAM Act</strong>, and international data standards.
          </p>

          <h4 class="font-bold text-navy-900 text-base">1. Information We Collect</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Quotation Requests (B2B):</strong> Selected device models, quantities, and destination city provided during quotation generation.</li>
            <li><strong>Contact Details:</strong> Professional contact details voluntarily submitted via Gmail, email client, or direct WhatsApp (+1 407-427-3356).</li>
            <li><strong>Technical Local Storage:</strong> Essential client-side session tokens (<code>gtech_cart_v2</code>, <code>gtech_lang</code>, and cookie consent preferences).</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">2. Child Privacy & COPPA Compliance (15 U.S.C. §§ 6501–6506)</h4>
          <p>
            <strong>Strict Adult & Professional Audience:</strong> G-TECH.US and our tactical radio solutions are intended exclusively for commercial enterprises, security agencies, government organizations, and individuals aged eighteen (18) and older. We do not knowingly solicit, collect, or store personal information from children under thirteen (13) years of age. All quotation requests require explicit certification of majority. If we become aware that personal information of a child under 13 has been submitted without verifiable parental consent, we will purge such data immediately.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Zero Session Replay & Keystroke Recording Guarantee (California CIPA § 631(a) Immunity)</h4>
          <p>
            <strong>No Wiretapping or Session Tracking:</strong> G-TECH.US maintains a strict zero-surveillance policy. We <strong>DO NOT</strong> use session replay software, screen recording tools (such as Hotjar, FullStory, Microsoft Clarity, LogRocket, or Inspectlet), or third-party keystroke wiretapping scripts. We do not intercept unsubmitted form fields, mouse paths, or real-time user keystrokes. Your browsing session remains private and unrecorded.
          </p>

          <h4 class="font-bold text-navy-900 text-base">4. CAN-SPAM Act Compliance & Physical Postal Address (15 U.S.C. § 7701)</h4>
          <p>
            <strong>Transactional Commercial Communications:</strong> Any email generated through the Quotation Station is a user-initiated transactional Request For Quotation (RFQ). G-TECH does not engage in unsolicited mass commercial emailing or purchase third-party lead lists. In full adherence to the CAN-SPAM Act:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Physical Postal Address:</strong> G-TECH Communications, Geramel Castellano • Orlando, Florida, USA.</li>
            <li><strong>Opt-Out Mechanism:</strong> You may opt out of future quote follow-ups or request permanent contact deletion by emailing <code>gtech.usfl@gmail.com</code> or replying with "REMOVE".</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">5. Zero Remote Fonts & IP Leak Protection (GDPR Compliant)</h4>
          <p>
            In strict compliance with European privacy standards and German precedent (LG München, Az. 3 O 17493/20), G-TECH.US does not load fonts from remote Google Fonts servers. All typography utilizes local native operating system fonts or self-hosted assets, eliminating unauthorized IP address transmission to third-party CDNs.
          </p>

          <h4 class="font-bold text-navy-900 text-base">6. Cloud Quotation Portal & Database Protection</h4>
          <p>
            Quotation requests are recorded in our secure cloud infrastructure (Turso DB / libSQL) protected by TLS 1.3 encryption in transit and AES-256 at rest. This data is strictly utilized by G-TECH technical dispatch to process official quotes, manage fleet reservations, and coordinate logistics. No credit card numbers or financial credentials are ever collected or stored on our web servers.
          </p>

          <h4 class="font-bold text-navy-900 text-base">7. Your Privacy Rights</h4>
          <p>
            You may request verification, correction, or deletion of your contact records at any time by emailing <code>gtech.usfl@gmail.com</code>.
          </p>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            G-TECH Comunicaciones ("G-TECH.US", "nosotros"), bajo la dirección operativa de Geramel en Orlando, Florida, protege los datos personales de sus clientes en estricto cumplimiento con la <strong>Ley de Protección de Información de Florida (FIPA, Fla. Stat. § 501.171)</strong>, la ley de protección infantil <strong>COPPA (15 U.S.C. §§ 6501–6506)</strong>, la ley contra escuchas no consentidas de California <strong>CIPA (§ 631)</strong>, el <strong>CAN-SPAM Act</strong> y directrices de comercio de la FTC.
          </p>

          <h4 class="font-bold text-navy-900 text-base">1. Información que Recopilamos</h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Solicitudes de Cotización (B2B):</strong> Modelos de radios seleccionados, cantidades y destino especificado al generar la cotización.</li>
            <li><strong>Datos de Contacto:</strong> Información provista voluntariamente al comunicarse por Gmail, app de correo o WhatsApp (+1 407-427-3356).</li>
            <li><strong>Almacenamiento Local Técnico:</strong> Claves locales de sesión técnica (<code>gtech_cart_v2</code>, <code>gtech_lang</code> y preferencias de cookies).</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">2. Protección Infantil y Cumplimiento COPPA (15 U.S.C. §§ 6501–6506)</h4>
          <p>
            <strong>Audiencia Exclusiva Adulta y Profesional:</strong> Los productos y servicios de G-TECH.US están dirigidos exclusivamente a empresas, entidades de seguridad, profesionales y personas mayores de dieciocho (18) años. No recopilamos intencionalmente información personal de menores de 13 años. Toda solicitud de cotización exige certificar la mayoría de edad. Si tomamos conocimiento de que un menor de 13 años ha suministrado datos sin autorización parental, dicha información será eliminada de inmediato.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Cero Grabación de Sesiones y Ausencia de Wiretapping (Cumplimiento CIPA § 631(a))</h4>
          <p>
            <strong>Sin Rastreo Invasivo de Pantalla ni Registro de Teclas:</strong> G-TECH mantiene una política de cero vigilancia. <strong>NO utilizamos</strong> programas de grabación de pantalla o session replay (tales como Hotjar, FullStory, Microsoft Clarity, LogRocket ni similares), ni scripts espías de pulsación de teclas (keystroke recording). No interceptamos textos no enviados en formularios ni movimientos de puntero. Su navegación es totalmente privada.
          </p>

          <h4 class="font-bold text-navy-900 text-base">4. Cumplimiento CAN-SPAM Act y Domicilio Postal Físico (15 U.S.C. § 7701)</h4>
          <p>
            <strong>Comunicaciones Transaccionales Legítimas:</strong> Toda cotización generada mediante el portal es una solicitud transaccional iniciada voluntariamente por el usuario (RFQ). G-TECH no realiza envíos masivos de spam ni compra bases de datos. En cumplimiento con la ley CAN-SPAM:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Dirección Postal Comercial:</strong> G-TECH Communications, Geramel Castellano • Orlando, Florida, USA.</li>
            <li><strong>Mecanismo de Exclusión (Opt-Out):</strong> Puede solicitar la baja de seguimiento o eliminación total de sus datos escribiendo a <code>gtech.usfl@gmail.com</code> o respondiendo con la palabra "BAJA".</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">5. Cero Fuentes Remotas y Protección de Fuga de IP (Conforme a GDPR)</h4>
          <p>
            Conforme a los estándares de privacidad europeos y la jurisprudencia del Tribunal de Múnich (LG München, fallo 20.01.2022), este sitio web no carga tipografías desde servidores remotos de Google Fonts. Toda la tipografía se renderiza mediante fuentes nativas del sistema operativo, evitando transmitir la dirección IP del visitante a redes externas no consentidas.
          </p>

          <h4 class="font-bold text-navy-900 text-base">6. Seguridad en la Base de Datos de Cotizaciones</h4>
          <p>
            Las solicitudes de cotización se almacenan de forma segura en nuestra base de datos (Turso DB / libSQL) bajo cifrado TLS 1.3 en tránsito y AES-256 en reposo, empleada exclusivamente para emitir cotizaciones oficiales y coordinar despachos. No se solicitan ni almacenan números de tarjetas de crédito.
          </p>

          <h4 class="font-bold text-navy-900 text-base">7. Derechos del Usuario</h4>
          <p>
            Puede ejercer sus derechos de consulta, rectificación o eliminación escribiendo en cualquier momento a <code>gtech.usfl@gmail.com</code>.
          </p>
        </div>
      `
    }
  },

  terms: {
    title: {
      en: 'Commercial Terms of Service, Warranty & California ARL Compliance',
      es: 'Términos Comerciales de Servicio, Garantía y Cumplimiento California ARL'
    },
    badge: {
      en: 'Commercial Hardware Agreement • California ARL & Florida Jurisdiction',
      es: 'Acuerdo Comercial de Hardware • California ARL y Jurisdicción de Florida'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h4 class="font-bold text-navy-900 text-base">1. Nature of the Quotation Station</h4>
          <p>
            The "Quotation Station" on G-TECH.US facilitates rapid generation of price estimates, inventory inquiries, and fleet specifications. <strong>Submission of a quotation request via WhatsApp or email does NOT constitute a final binding contract of sale.</strong> A binding commercial transaction occurs only upon issuance and client approval of a formal Pro-Forma Invoice and payment confirmation.
          </p>

          <h4 class="font-bold text-navy-900 text-base">2. Limited Factory Warranty Policy (30 Days)</h4>
          <p>
            Products and equipment do not include warranty except strictly and exclusively for verified manufacturer factory defects upon delivery. In such cases, a strict limited warranty of thirty (30) days applies, beginning from the date of receipt, to report and process any factory defect. Outside of the applicable warranty period, or for any issue resulting from misuse, drops, unauthorized moisture exposure, improper electrical input, or physical tampering, no warranty is provided.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Cellular SIM Subscriptions & California Automatic Renewal Law (ARL) Compliance</h4>
          <p>
            In strict compliance with the <strong>California Automatic Renewal Law (Cal. Bus. & Prof. Code §§ 17600–17606)</strong> and FTC rules:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Fixed-Term Prepaid Service:</strong> All SIM card cellular plans (USA, Brazil, Latin America, Europe, Global) are provisioned on a prepaid twelve (12) month fixed-term basis.</li>
            <li><strong>No Automatic Re-billing / Unsolicited Debits:</strong> G-TECH does not automatically charge, recurringly bill, or debit credit cards upon the expiration of the 12-month period without affirmative, written purchase order renewal from the client.</li>
            <li><strong>Renewal Procedure:</strong> Prior to service expiration, client will receive a manual renewal invoice with full cancellation options.</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">4. Intellectual Property & DMCA Safe Harbor Notice (17 U.S.C. § 512)</h4>
          <p>
            All tactical logos, product photography, UI code, and branding materials are proprietary assets of G-TECH.US. If any copyright owner believes their intellectual property is displayed improperly, please submit a formal DMCA Notice to our Designated Agent at <code>gtech.usfl@gmail.com</code> (see DMCA Safe Harbor policy).
          </p>

          <h4 class="font-bold text-navy-900 text-base">5. Governing Law & Arbitration</h4>
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

          <h4 class="font-bold text-navy-900 text-base">2. Política de Garantía Limitada de Fábrica (30 Días)</h4>
          <p>
            Los equipos no cuentan con garantía a menos que se trate estrictamente de un defecto de fábrica comprobado de origen. En dicho caso, el cliente cuenta con un plazo estricto de garantía de treinta (30) días a partir de la recepción del producto para reportar la falla. Fuera del período de garantía aplicable, o ante daños ocasionados por golpes, mal uso, humedad no permitida, sobrecarga eléctrica o manipulación indebida, los equipos no tienen garantía bajo ninguna circunstancia.
          </p>

          <h4 class="font-bold text-navy-900 text-base">3. Suscripciones SIM y Cumplimiento California Automatic Renewal Law (ARL)</h4>
          <p>
            En estricto cumplimiento con la <strong>Ley de Renovaciones Automáticas de California (Cal. Bus. & Prof. Code §§ 17600–17606)</strong> y normativas de la FTC:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Servicio Prepagado a Término Fijo:</strong> Todos los planes de tarjetas SIM PoC (USA, Brasil, Latinoamérica, Europa, Global) corresponden a paquetes prepagados por doce (12) meses fijos.</li>
            <li><strong>Sin Cargos Automáticos ni Renovaciones Sorpresa:</strong> G-TECH NO realiza cargos automáticos ni cobros recurrentes a tarjetas de crédito al finalizar los 12 meses sin la aprobación previa y por escrito de una nueva orden de compra.</li>
            <li><strong>Proceso de Renovación:</strong> Al término de la cobertura, el cliente recibe aviso para renovar manualmente si así lo desea.</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">4. Propiedad Intelectual y Aviso DMCA Safe Harbor (17 U.S.C. § 512)</h4>
          <p>
            Todos los logotipos tácticos, fotografías de producto, código de interfaz y elementos de marca son activos protegidos de G-TECH.US. Cualquier titular de derechos puede presentar una notificación formal de retiro ante nuestro Agente Designado al correo <code>gtech.usfl@gmail.com</code> (ver documento DMCA Safe Harbor).
          </p>

          <h4 class="font-bold text-navy-900 text-base">5. Ley Aplicable y Jurisdicción</h4>
          <p>
            Estos términos se rigen bajo las leyes del Estado de Florida, EE.UU. Cualquier controversia comercial se resolverá bajo arbitraje vinculante en el Condado de Orange, Florida.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            🐺 G tech (G-TECH.US) • Entidad Comercial • Orlando, Florida, EE.UU.
          </div>
        </div>
      `
    }
  },

  dmca: {
    title: {
      en: 'DMCA Safe Harbor Policy & Designated Copyright Agent Notice',
      es: 'Política de Safe Harbor DMCA y Agente Designado de Derechos de Autor'
    },
    badge: {
      en: '17 U.S.C. § 512 Compliance • Intellectual Property Shield',
      es: 'Cumplimiento 17 U.S.C. § 512 • Protección de Propiedad Intelectual'
    },
    contentHtml: {
      en: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
            <strong>DMCA Safe Harbor Notice (17 U.S.C. § 512):</strong> G-TECH respects intellectual property rights and adheres to the notice and takedown procedures established under the Digital Millennium Copyright Act.
          </div>

          <h4 class="font-bold text-navy-900 text-base">1. Designated Copyright Agent</h4>
          <p>
            Pursuant to Title II of the Digital Millennium Copyright Act (17 U.S.C. § 512(c)(2)), our Designated Agent for receipt of notifications of claimed infringement is:
          </p>
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs font-mono text-navy-950">
            <div><strong>Designated Agent:</strong> Geramel Castellano</div>
            <div><strong>Company:</strong> G-TECH Communications (🐺 G tech)</div>
            <div><strong>Physical Address:</strong> Orlando, Florida, USA</div>
            <div><strong>Official Email:</strong> gtech.usfl@gmail.com</div>
            <div><strong>Direct Telephone:</strong> +1 (407) 427-3356</div>
          </div>

          <h4 class="font-bold text-navy-900 text-base">2. Takedown Notice Requirements (§ 512(c)(3))</h4>
          <p>
            To be legally effective, any copyright infringement notification must be provided in writing to the Designated Agent and include substantially the following:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li>Physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material claimed to be infringing and reasonably sufficient information to permit us to locate the material (URL or description).</li>
            <li>Information reasonably sufficient to permit us to contact the complaining party (address, telephone number, email).</li>
            <li>A statement that the complaining party has a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement made under penalty of perjury that the information in the notification is accurate and that the complaining party is authorized to act on behalf of the owner.</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">3. Counter-Notification & Repeat Infringer Policy</h4>
          <p>
            If material has been removed pursuant to a DMCA notice, the affected party may submit a counter-notification conforming to 17 U.S.C. § 512(g)(3). In accordance with § 512(i), G-TECH maintains a policy that provides for termination of access in appropriate circumstances for repeat infringers.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            Effective Date: September 2026 • G-TECH.US DMCA Legal Directorate • Orlando, Florida, USA.
          </div>
        </div>
      `,
      es: `
        <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
            <strong>Aviso de Safe Harbor DMCA (17 U.S.C. § 512):</strong> G-TECH respeta los derechos de propiedad intelectual y cumple con los procedimientos formales de notificación y retiro (Notice and Takedown) establecidos bajo la ley estadounidense Digital Millennium Copyright Act.
          </div>

          <h4 class="font-bold text-navy-900 text-base">1. Agente Designado de Derechos de Autor</h4>
          <p>
            De conformidad con el Título II del DMCA (17 U.S.C. § 512(c)(2)), los datos de nuestro Agente Oficial Designado para la recepción de reclamaciones son:
          </p>
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs font-mono text-navy-950">
            <div><strong>Agente Designado:</strong> Geramel Castellano</div>
            <div><strong>Entidad:</strong> G-TECH Comunicaciones (🐺 G tech)</div>
            <div><strong>Dirección Física:</strong> Orlando, Florida, EE.UU.</div>
            <div><strong>Correo Oficial:</strong> gtech.usfl@gmail.com</div>
            <div><strong>Teléfono Directo:</strong> +1 (407) 427-3356</div>
          </div>

          <h4 class="font-bold text-navy-900 text-base">2. Requisitos de la Notificación de Retiro (§ 512(c)(3))</h4>
          <p>
            Para tener validez legal, toda reclamación por infracción de derechos de autor debe enviarse por escrito a nuestro Agente Designado e incluir:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li>Firma física o electrónica de la persona autorizada para actuar en nombre del titular del copyright.</li>
            <li>Identificación de la obra protegida presuntamente infringida.</li>
            <li>Identificación del material presuntamente infractor e información suficiente para su localización (URL o captura).</li>
            <li>Datos de contacto del remitente (nombre, domicilio postal, teléfono y correo electrónico).</li>
            <li>Declaración de fe de que el uso impugnado no está autorizado por el titular, su agente o la ley.</li>
            <li>Declaración bajo pena de perjurio de que la información provista es exacta y que el declarante cuenta con autorización legal.</li>
          </ul>

          <h4 class="font-bold text-navy-900 text-base">3. Contranotificación y Política de Infractores Reincidentes</h4>
          <p>
            Si un material ha sido retirado en virtud de una notificación DMCA, la parte afectada puede presentar una contranotificación bajo 17 U.S.C. § 512(g)(3). Conforme al § 512(i), G-TECH cancelará el acceso o suspenderá a cualquier usuario o colaborador que incurra en infracciones reiteradas.
          </p>

          <div class="pt-2 text-xs text-gray-500 border-t border-gray-100">
            Fecha de Entrada en Vigor: Septiembre 2026 • Dirección Legal DMCA G-TECH.US • Orlando, Florida, EE.UU.
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
  let modalOverlay = document.getElementById('product-modal');
  let modalContent = document.getElementById('modal-content');

  // Dynamic fallback for pages that don't have product-modal in HTML (e.g. accessories, alliances)
  if (!modalOverlay || !modalContent) {
    let dynamicModal = document.getElementById('legal-dynamic-modal');
    if (!dynamicModal) {
      dynamicModal = document.createElement('div');
      dynamicModal.id = 'legal-dynamic-modal';
      dynamicModal.className = 'fixed inset-0 z-[250] bg-navy-900/80 backdrop-blur-sm hidden items-center justify-center p-4';
      dynamicModal.setAttribute('role', 'dialog');
      dynamicModal.setAttribute('aria-modal', 'true');
      dynamicModal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl p-6 relative border border-gray-100 flex flex-col">
          <div id="legal-dynamic-modal-content" class="overflow-y-auto pr-1 flex-1"></div>
        </div>
      `;
      document.body.appendChild(dynamicModal);
      dynamicModal.addEventListener('click', (e) => {
        if (e.target === dynamicModal || (e.target as HTMLElement).closest('[data-action="close-modal"]')) {
          dynamicModal!.classList.add('hidden');
          dynamicModal!.classList.remove('flex');
          document.body.style.overflow = '';
        }
      });
    }
    modalOverlay = dynamicModal;
    modalContent = document.getElementById('legal-dynamic-modal-content');
  }

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
        <button data-action="close-modal" class="text-gray-400 hover:text-navy-900 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0" aria-label="Close modal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Scrollable Legal Body -->
      <div class="overflow-y-auto pr-1 flex-1 space-y-4">
        ${content}
      </div>

      <!-- Footer Action -->
      <div class="pt-4 mt-4 border-t border-gray-100 flex justify-end flex-shrink-0">
        <button data-action="close-modal" class="px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-navy-800 bg-gray-100 hover:bg-gray-200 transition-colors text-xs">
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
        <button data-action="dismiss-cookie" data-type="essential" class="text-gray-400 hover:text-white p-1" aria-label="Dismiss">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <p class="text-[11px] text-gray-300 leading-relaxed">
        ${t('cookie.text')}
      </p>

      <div class="flex items-center gap-2 pt-1 text-xs">
        <button data-action="dismiss-cookie" data-type="all" class="flex-1 bg-crimson-800 hover:bg-crimson-900 text-white font-bold py-2 px-3 rounded-xl transition-all shadow-md text-center text-xs">
          ${t('cookie.accept_all')}
        </button>
        <button data-action="dismiss-cookie" data-type="essential" class="flex-1 bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white font-semibold py-2 px-3 rounded-xl transition-all border border-navy-700 text-center text-xs">
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
