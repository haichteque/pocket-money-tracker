/**
 * AsyncStorage utilities for persisting entries locally.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Entry } from '@/types';

const STORAGE_KEY = '@pocket_money_tracker_entries';

export async function loadEntries(): Promise<Entry[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as Entry[];
    }
    return [];
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
}

export async function saveEntries(entries: Entry[]): Promise<void> {
  try {
    const json = JSON.stringify(entries);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save entries:', error);
  }
}

export async function addEntry(entry: Entry): Promise<Entry[]> {
  const entries = await loadEntries();
  entries.unshift(entry);
  await saveEntries(entries);
  return entries;
}

export async function updateEntry(updated: Entry): Promise<Entry[]> {
  const entries = await loadEntries();
  const index = entries.findIndex((e) => e.id === updated.id);
  if (index !== -1) {
    entries[index] = { ...updated, updatedAt: new Date().toISOString() };
  }
  await saveEntries(entries);
  return entries;
}

export async function deleteEntry(id: string): Promise<Entry[]> {
  let entries = await loadEntries();
  entries = entries.filter((e) => e.id !== id);
  await saveEntries(entries);
  return entries;
}
