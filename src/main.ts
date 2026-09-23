import productsData from '../products.json';

// Mobile menu toggle logic
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Render Products
const catalogContainer = document.getElementById('catalog-grid');
const modalOverlay = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');

if (catalogContainer && modalOverlay && modalContent) {
  // Render cards
  catalogContainer.innerHTML = productsData.map(product => `
    <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col relative group cursor-pointer hover:-translate-y-1" onclick="openModal('${product.id}')">
      <div class="aspect-[3/4] bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-gray-100/80">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
      </div>
      <div class="flex justify-between items-start mb-2 gap-2">
        <h3 class="text-base md:text-lg font-bold text-navy-800 line-clamp-1" title="${product.name}">${product.name}</h3>
      </div>
      <div class="mb-3">
        <span class="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-navy-50 text-navy-700 border border-navy-100">${product.badge}</span>
      </div>
      <p class="text-gray-600 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">${product.description}</p>
      <div class="text-crimson-800 font-bold text-sm uppercase tracking-wider flex items-center group-hover:text-crimson-900 mt-auto pt-2 border-t border-gray-100">
        View Specifications
        <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </div>
    </div>
  `).join('');

  // Setup modal logic globally
  (window as any).openModal = (id: string) => {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    
    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/2 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
        </div>
        <div class="w-full md:w-1/2 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h2 class="text-2xl md:text-3xl font-extrabold text-navy-800 leading-tight">${p.name}</h2>
            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-800 transition-colors p-1" aria-label="Close modal">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="mb-4">
            <span class="inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-crimson-50 text-crimson-800 border border-crimson-100">${p.badge}</span>
          </div>
          <p class="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">${p.description}</p>
          
          <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Technical Specifications</h4>
            <div class="grid grid-cols-2 gap-3">
              ${p.specs.map(s => `
                <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <span class="block text-xs text-gray-500 mb-0.5">${s.label}</span>
                  <span class="block text-sm font-bold text-navy-800">${s.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="mt-auto pt-4 border-t border-gray-100 flex gap-4">
            <button onclick="closeModal()" class="flex-1 py-3.5 rounded-full font-bold uppercase tracking-wider text-navy-800 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
              Close
            </button>
            <a href="https://wa.me/584149428999?text=I'm%20interested%20in%20the%20${encodeURIComponent(p.name)}" target="_blank" class="flex-1 py-3.5 rounded-full font-bold uppercase tracking-wider text-white bg-crimson-800 hover:bg-crimson-900 transition-colors text-center flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Inquire via WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  (window as any).closeModal = () => {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
    document.body.style.overflow = '';
  };
  
  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      (window as any).closeModal();
    }
  });
}
