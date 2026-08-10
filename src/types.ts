/**
 * TypeScript type definitions for Pocket Money Tracker.
 */

export interface Expense {
  id: string;
  task: string;
  cost: number;
}

export interface Entry {
  id: string;
  title: string;
  budget: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  expenses: Expense[];
}

export type EntryFormData = {
  title: string;
  budget: string;
  currency: string;
};

export type ExpenseFormData = {
  task: string;
  cost: string;
};
