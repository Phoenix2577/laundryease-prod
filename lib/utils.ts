import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateTicketNumber(lastNumber: number): string {
  return String(lastNumber + 1).padStart(4, '0');
}

export function calculateCost(items: Record<string, number>): number {
  const costs: Record<string, number> = {
    shirts: 15, pants: 20, shorts: 12, underwear: 8,
    socks: 5, towels: 18, bedsheets: 25, pillowcases: 10, jackets: 30,
  };
  return Object.entries(items).reduce((total, [id, count]) => {
    return total + (costs[id] || 0) * count;
  }, 0);
}