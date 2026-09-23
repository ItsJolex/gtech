import type { Product } from './types';
import productsData from '../products.json';

export const products: Product[] = productsData as Product[];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getAvailableProducts(): Product[] {
  return products.filter(p => p.inStock);
}

export function getProductsByTag(tag: string): Product[] {
  return products.filter(p => p.tags.includes(tag));
}