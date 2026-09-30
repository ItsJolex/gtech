import { 
  addToCart, 
  updateCartQuantity, 
  removeFromCart, 
  setCartSimPlan, 
  generateWhatsAppMessage, 
  openEmailOrderModal, 
  clearCart, 
  closeEmailOrderModal, 
  submitOrderViaEmail, 
  closeCartDrawer, 
  openCartDrawer 
} from './cart';
import { resetFinder, generateWhatsAppForProduct } from './finder';
import { openLegalModal, renderCookieBanner, dismissCookieBanner } from './legal';
import { compareProducts } from './comparison';

// Poster lightbox (antes script inline en index.html; requerido por CSP estricto)
function closePosterLightbox() {
  const lightbox = document.getElementById('poster-lightbox');
  if (lightbox && !lightbox.classList.contains('hidden')) {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
    const img = document.getElementById('poster-lightbox-img') as HTMLImageElement | null;
    if (img) img.src = '';
  }
}

(window as any).openPosterLightbox = function (src: string, title: string) {
  const lightbox = document.getElementById('poster-lightbox');
  const img = document.getElementById('poster-lightbox-img') as HTMLImageElement | null;
  const caption = document.getElementById('poster-lightbox-caption');
  if (lightbox && img && caption) {
    img.src = src;
    img.alt = title;
    caption.textContent = title;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

document.getElementById('poster-lightbox')?.addEventListener('click', function (this: HTMLElement, e) {
  if (e.target === this || (e.target as HTMLElement).closest('button')) {
    closePosterLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePosterLightbox();
});

// Add global click listener for declarative data-action elements
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const actionEl = target.closest('[data-action]') as HTMLElement;
  if (!actionEl) return;
  
  const action = actionEl.getAttribute('data-action');
  
  if (action === 'open-sim-pricing') {
    const region = actionEl.getAttribute('data-region') || undefined;
    const id = actionEl.getAttribute('data-id') || undefined;
    (window as any).openSimPricingModal?.(id, region);
  } else if (action === 'open-poster') {
    const src = actionEl.getAttribute('data-src') || '';
    const title = actionEl.getAttribute('data-title') || '';
    (window as any).openPosterLightbox?.(src, title);
  } else if (action === 'open-legal') {
    openLegalModal(actionEl.getAttribute('data-doc') as any);
  } else if (action === 'open-cookie-banner') {
    renderCookieBanner(true);
  } else if (action === 'dismiss-cookie') {
    dismissCookieBanner(actionEl.getAttribute('data-type') as any);
  } else if (action === 'open-modal') {
    (window as any).openModal?.(actionEl.getAttribute('data-id')!);
  } else if (action === 'close-modal') {
    (window as any).closeModal?.();
  } else if (action === 'set-card-color') {
    (window as any).setCardColor?.(actionEl.getAttribute('data-product-id')!, actionEl.getAttribute('data-color-id')!);
  } else if (action === 'open-deep-dive') {
    (window as any).openDeepDiveModal?.(actionEl.getAttribute('data-id')!, actionEl.getAttribute('data-source') as any);
  } else if (action === 'add-to-cart-stop') {
    addToCart(actionEl.getAttribute('data-id')!);
  } else if (action === 'stop-propagation') {
    e.stopPropagation();
  } else if (action === 'select-modal-color') {
    (window as any).selectModalColor?.(actionEl.getAttribute('data-product-id')!, actionEl.getAttribute('data-color-id')!);
  } else if (action === 'select-sim-plan') {
    (window as any).selectSimPlan?.(actionEl.getAttribute('data-plan-id')!);
  } else if (action === 'buy-main') {
    const id = actionEl.getAttribute('data-id')!;
    if (actionEl.getAttribute('data-instock') === '1') {
      addToCart(id); 
      (window as any).closeModal?.(); 
      openCartDrawer();
    } else {
      (window as any).showOutOfStockFallback?.(id);
    }
  } else if (action === 'buy-modal') {
    const id = actionEl.getAttribute('data-id')!;
    if (actionEl.getAttribute('data-instock') === '1') {
      addToCart(id, actionEl.getAttribute('data-color') || undefined, actionEl.getAttribute('data-img') || undefined); 
      (window as any).closeModal?.(); 
      openCartDrawer();
    } else {
      (window as any).showOutOfStockFallback?.(id);
    }
  } else if (action === 'open-home-acc-modal') {
    (window as any).openHomeAccessoryModal?.(actionEl.getAttribute('data-id')!);
  } else if (action === 'add-home-acc') {
    (window as any).addHomeAccessoryToQuote?.(actionEl.getAttribute('data-id')!);
  } else if (action === 'add-home-acc-close') {
    (window as any).addHomeAccessoryToQuote?.(actionEl.getAttribute('data-id')!); 
    (window as any).closeHomeAccessoryModal?.();
  } else if (action === 'close-home-acc-modal') {
    (window as any).closeHomeAccessoryModal?.();
  } else if (action === 'reload') {
    window.location.reload();
  } else if (action === 'update-quote-status') {
    // handled by change listener
  } else if (action === 'save-quote-notes') {
    const id = actionEl.getAttribute('data-id')!;
    const val = (document.getElementById(`admin-notes-${id}`) as HTMLTextAreaElement)?.value || '';
    (window as any).saveAdminQuoteNotes?.(id, val);
  } else if (action === 'delete-quote') {
    (window as any).deleteAdminQuote?.(actionEl.getAttribute('data-id')!);
  } else if (action === 'compare-products') {
    compareProducts(actionEl.getAttribute('data-id1')!, actionEl.getAttribute('data-id2')!);
  } else if (action === 'add-to-cart-close') {
    addToCart(actionEl.getAttribute('data-id')!); 
    (window as any).closeModal?.();
  } else if (action === 'close-cart-drawer') {
    closeCartDrawer();
  } else if (action === 'update-cart-qty') {
    updateCartQuantity(actionEl.getAttribute('data-id')!, parseInt(actionEl.getAttribute('data-delta')!, 10), actionEl.getAttribute('data-color') || undefined);
  } else if (action === 'remove-from-cart') {
    removeFromCart(actionEl.getAttribute('data-id')!, actionEl.getAttribute('data-color') || undefined);
  } else if (action === 'gen-whatsapp') {
    generateWhatsAppMessage();
  } else if (action === 'open-email-modal') {
    openEmailOrderModal();
  } else if (action === 'clear-cart') {
    clearCart();
  } else if (action === 'close-email-modal') {
    closeEmailOrderModal();
  } else if (action === 'submit-email') {
    submitOrderViaEmail(actionEl.getAttribute('data-type') as any);
  } else if (action === 'close-email-cart') {
    closeEmailOrderModal(); 
    closeCartDrawer();
  } else if (action === 'reset-finder') {
    resetFinder();
  } else if (action === 'add-to-cart-drawer') {
    addToCart(actionEl.getAttribute('data-id')!); 
    openCartDrawer();
  } else if (action === 'whatsapp-product') {
    generateWhatsAppForProduct(actionEl.getAttribute('data-id')!);
  }
});

document.addEventListener('change', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-action="set-cart-sim"]')) {
    setCartSimPlan((target as HTMLSelectElement).value);
  } else if (target.matches('[data-action="update-quote-status"]')) {
    (window as any).updateAdminQuoteStatus?.(target.getAttribute('data-id')!, (target as HTMLSelectElement).value);
  }
});

document.addEventListener('submit', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-action="prevent-submit"]')) {
    e.preventDefault();
  }
});

// Image fallback globally
document.addEventListener('error', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'IMG') {
    (target as HTMLImageElement).src = '/images/logo-patch.webp';
  }
}, true);
