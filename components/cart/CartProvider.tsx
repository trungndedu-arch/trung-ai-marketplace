"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CART_MAX_ITEMS, isCartProductId } from "@/lib/cart";

const CART_STORAGE_KEY = "trung-ai-marketplace:cart:v1";

type CartMutationResult = "added" | "duplicate" | "full" | "invalid";

type CartContextValue = {
  productIds: string[];
  count: number;
  isReady: boolean;
  addProduct: (productId: string) => CartMutationResult;
  removeProduct: (productId: string) => void;
  removeProducts: (productIds: string[]) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function normalizeProductIds(value: unknown) {
  if (!value || typeof value !== "object") return [];

  const payload = value as { version?: unknown; productIds?: unknown };
  if (payload.version !== 1 || !Array.isArray(payload.productIds)) return [];

  return Array.from(new Set(payload.productIds.filter(isCartProductId))).slice(0, CART_MAX_ITEMS);
}

function readStoredCart() {
  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    return rawValue ? normalizeProductIds(JSON.parse(rawValue)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setProductIds(readStoredCart());
    setIsReady(true);

    function syncCart(event: StorageEvent) {
      if (event.key === CART_STORAGE_KEY) setProductIds(readStoredCart());
    }

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, productIds }));
    } catch {
      // The in-memory cart remains usable when storage is unavailable.
    }
  }, [isReady, productIds]);

  const addProduct = useCallback((productId: string): CartMutationResult => {
    if (!isCartProductId(productId)) return "invalid";
    if (productIds.includes(productId)) return "duplicate";
    if (productIds.length >= CART_MAX_ITEMS) return "full";

    setProductIds((current) => current.includes(productId) ? current : [...current, productId].slice(0, CART_MAX_ITEMS));
    return "added";
  }, [productIds]);

  const removeProduct = useCallback((productId: string) => {
    setProductIds((current) => current.filter((item) => item !== productId));
  }, []);

  const removeProducts = useCallback((ids: string[]) => {
    const removedIds = new Set(ids);
    setProductIds((current) => current.filter((item) => !removedIds.has(item)));
  }, []);

  const clearCart = useCallback(() => setProductIds([]), []);
  const value = useMemo<CartContextValue>(() => ({
    productIds,
    count: productIds.length,
    isReady,
    addProduct,
    removeProduct,
    removeProducts,
    clearCart,
  }), [addProduct, clearCart, isReady, productIds, removeProduct, removeProducts]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
