/**
 * Formatting and calculation utility functions.
 */
import { CURRENCIES } from '@/constants/theme';
import type { Entry, Expense } from '@/types';

/**
 * Generate a unique ID using timestamp + random string.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Format a number with commas as thousands separator.
 */
export function formatNumber(num: number): string {
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return num < 0 ? `-${formatted}` : formatted;
}

/**
 * Format amount with currency symbol.
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  const symbol = currency?.symbol ?? currencyCode;
  return `${symbol} ${formatNumber(amount)}`;
}

/**
 * Calculate total expenses for an entry.
 */
export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, exp) => sum + exp.cost, 0);
}

/**
 * Calculate remaining budget for an entry.
 */
export function getRemainingBudget(entry: Entry): number {
  return entry.budget - getTotalExpenses(entry.expenses);
}

/**
 * Calculate budget usage percentage (can exceed 100%).
 */
export function getBudgetPercentage(entry: Entry): number {
  if (entry.budget === 0) return 0;
  const spent = getTotalExpenses(entry.expenses);
  return (spent / entry.budget) * 100;
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date string with time.
 */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
