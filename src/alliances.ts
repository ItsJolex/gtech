import './events.ts';
import { initCart, openCartDrawer } from './cart';
import { initI18n, getLanguage, t, onLanguageChange, toggleLanguage } from './i18n';

function updateStaticTranslations(): void {
  const lang = getLanguage();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    }
  });

  document.querySelectorAll('.lang-toggle-container').forEach((el) => {
    el.setAttribute('data-lang', lang);
  });

  const switchLabel = lang === 'en' ? 'Cambiar a Español' : 'Switch to English';
  document.querySelectorAll('.lang-toggle-label').forEach((el) => {
    el.textContent = switchLabel;
  });
}

function initMobileMenu(): void {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconBars = document.getElementById('menu-icon-bars');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (!menuBtn || !mobileMenu) return;

  function setMobileMenu(open: boolean) {
    if (open) {
      mobileMenu?.classList.remove('hidden');
      menuIconBars?.classList.add('hidden');
      menuIconClose?.classList.remove('hidden');
    } else {
      mobileMenu?.classList.add('hidden');
      menuIconBars?.classList.remove('hidden');
      menuIconClose?.classList.add('hidden');
    }
  }

  menuBtn.addEventListener('click', () => {
    const isClosed = mobileMenu.classList.contains('hidden');
    setMobileMenu(isClosed);
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setMobileMenu(false);
    });
  });
}

function initLanguageToggle(): void {
  const handleToggle = (e: Event) => {
    e.preventDefault();
    toggleLanguage();
  };

  document.getElementById('lang-toggle-desktop')?.addEventListener('click', handleToggle);
  document.getElementById('lang-toggle-mobile')?.addEventListener('click', handleToggle);
}

function initCartButton(): void {
  document.getElementById('cart-btn')?.addEventListener('click', () => {
    openCartDrawer();
  });
}

function initSmoothNav(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Lifecycle boot
initI18n();
updateStaticTranslations();
initCart();
initMobileMenu();
initLanguageToggle();
initCartButton();
initSmoothNav();

onLanguageChange(() => {
  updateStaticTranslations();
});

(window as any).openCartDrawer = openCartDrawer;
