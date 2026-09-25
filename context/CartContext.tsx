"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type CartMap = Record<number, number>;

type CartContextValue = {
  items: CartMap;
  count: number;
  add: (productId: number, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "rizqy-cart";

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: CartMap = {};

let cache: CartMap | null = null;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): CartMap {
  if (cache) return cache;
  try {
    const raw = readRaw();
    cache = raw ? (JSON.parse(raw) as CartMap) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function getServerSnapshot(): CartMap {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(updater: (prev: CartMap) => CartMap) {
  const next = updater(getSnapshot());
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* abaikan bila storage penuh/terblokir */
  }
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((productId: number, qty = 1) => {
    commit((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + qty }));
  }, []);

  const setQty = useCallback((productId: number, qty: number) => {
    commit((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: qty };
    });
  }, []);

  const remove = useCallback((productId: number) => {
    commit((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clear = useCallback(() => commit(() => ({})), []);

  const count = Object.values(items).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{ items, count, add, setQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}