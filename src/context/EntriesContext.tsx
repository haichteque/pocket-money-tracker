/**
 * React Context for managing entries state across screens.
 * Syncs to AsyncStorage on every mutation.
 */
import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import type { Entry, Expense } from '@/types';
import { loadEntries, saveEntries } from '@/utils/storage';
import { generateId } from '@/utils/helpers';

// ------ State ------
interface EntriesState {
  entries: Entry[];
  isLoading: boolean;
}

const initialState: EntriesState = {
  entries: [],
  isLoading: true,
};

// ------ Actions ------
type Action =
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'UPDATE_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: { entryId: string; expense: Expense } }
  | { type: 'DELETE_EXPENSE'; payload: { entryId: string; expenseId: string } }
  | { type: 'SET_LOADING'; payload: boolean };

function entriesReducer(state: EntriesState, action: Action): EntriesState {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, isLoading: false };
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? { ...action.payload, updatedAt: new Date().toISOString() }
            : e
        ),
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };
    case 'ADD_EXPENSE': {
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.entryId
            ? {
                ...e,
                expenses: [...e.expenses, action.payload.expense],
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      };
    }
    case 'DELETE_EXPENSE': {
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.entryId
            ? {
                ...e,
                expenses: e.expenses.filter(
                  (exp) => exp.id !== action.payload.expenseId
                ),
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ------ Context ------
interface EntriesContextValue {
  state: EntriesState;
  addEntry: (title: string, budget: number, currency: string) => Entry;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  addExpense: (entryId: string, task: string, cost: number) => void;
  deleteExpense: (entryId: string, expenseId: string) => void;
  getEntry: (id: string) => Entry | undefined;
}

const EntriesContext = createContext<EntriesContextValue | null>(null);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(entriesReducer, initialState);

  // Load entries from storage on mount
  useEffect(() => {
    (async () => {
      const entries = await loadEntries();
      dispatch({ type: 'SET_ENTRIES', payload: entries });
    })();
  }, []);

  // Persist to storage on every state change (after initial load)
  useEffect(() => {
    if (!state.isLoading) {
      saveEntries(state.entries);
    }
  }, [state.entries, state.isLoading]);

  const addEntry = useCallback(
    (title: string, budget: number, currency: string): Entry => {
      const now = new Date().toISOString();
      const newEntry: Entry = {
        id: generateId(),
        title,
        budget,
        currency,
        createdAt: now,
        updatedAt: now,
        expenses: [],
      };
      dispatch({ type: 'ADD_ENTRY', payload: newEntry });
      return newEntry;
    },
    []
  );

  const updateEntry = useCallback((entry: Entry) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: entry });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  }, []);

  const addExpense = useCallback(
    (entryId: string, task: string, cost: number) => {
      const expense: Expense = {
        id: generateId(),
        task,
        cost,
      };
      dispatch({ type: 'ADD_EXPENSE', payload: { entryId, expense } });
    },
    []
  );

  const deleteExpense = useCallback(
    (entryId: string, expenseId: string) => {
      dispatch({ type: 'DELETE_EXPENSE', payload: { entryId, expenseId } });
    },
    []
  );

  const getEntry = useCallback(
    (id: string): Entry | undefined => {
      return state.entries.find((e) => e.id === id);
    },
    [state.entries]
  );

  return (
    <EntriesContext.Provider
      value={{
        state,
        addEntry,
        updateEntry,
        deleteEntry,
        addExpense,
        deleteExpense,
        getEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries(): EntriesContextValue {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}
