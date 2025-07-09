'use client';

import { v4 as uuidv4 } from 'uuid';
import type { HistoryItem, StudyPlan } from './types';

const HISTORY_STORAGE_KEY = 'studySphereHistory';

function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
    const items = historyJson ? JSON.parse(historyJson) : [];
    return items.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading history from localStorage', error);
    return [];
  }
}

function getHistoryItem(id: string): HistoryItem | undefined {
  const history = getHistory();
  return history.find(item => item.id === id);
}

function saveHistory(history: HistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    history.sort((a, b) => b.timestamp - a.timestamp);
    const historyJson = JSON.stringify(history);
    localStorage.setItem(HISTORY_STORAGE_KEY, historyJson);
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving history to localStorage', error);
  }
}

export function addHistoryItem(plan: StudyPlan, title: string): HistoryItem {
  const history = getHistory();
  
  const finalTitle = title.trim().length > 50 ? title.trim().substring(0, 47) + '...' : title.trim();

  const newItem: HistoryItem = {
    id: uuidv4(),
    title: finalTitle || 'New Study Plan',
    timestamp: Date.now(),
    plan: plan,
  };

  const updatedHistory = [newItem, ...history];
  saveHistory(updatedHistory);
  return newItem;
}

export function loadHistory(): HistoryItem[] {
  return getHistory();
}

export function getPlan(id: string): StudyPlan | null {
    const item = getHistoryItem(id);
    return item ? item.plan : null;
}
