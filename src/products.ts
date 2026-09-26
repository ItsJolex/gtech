import type { Product } from './types';
import productsData from '../products.json';

// Initial state from static fallback
export let products: Product[] = [...(productsData as Product[])];

type ProductsListener = (updated: Product[]) => void;
const listeners: ProductsListener[] = [];

export function onProductsUpdated(fn: ProductsListener): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        products = data;
        listeners.forEach(fn => {
          try {
            fn(products);
          } catch (e) {
            console.error('Error in products listener:', e);
          }
        });
        return products;
      }
    }
  } catch (err) {
    console.warn('Could not fetch live products from Turso, keeping static catalog fallback:', err);
  }
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getAvailableProducts(): Product[] {
  return products.filter(p => p.inStock);
}

export function getProductsByTag(tag: string): Product[] {
  return products.filter(p => p.tags && p.tags.includes(tag));
}