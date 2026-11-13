'use client';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/types';

interface Store {
  cart: Product[]; total: number; add: (p: Product) => void; remove: (i: number) => void;
  drawer: boolean; setDrawer: (v: boolean) => void;
  modal: Product | null; setModal: (p: Product | null) => void;
  maxPrice: number; setMaxPrice: (n: number) => void;
}
const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore must be used inside <StoreProvider>');
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState<Product | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const value = useMemo<Store>(() => ({
    cart, drawer, setDrawer, modal, setModal, maxPrice, setMaxPrice,
    total: cart.reduce((s, c) => s + c.price, 0),
    add: (p) => { setCart((c) => [...c, p]); setDrawer(true); },
    remove: (i) => setCart((c) => c.filter((_, k) => k !== i)),
  }), [cart, drawer, modal, maxPrice]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
