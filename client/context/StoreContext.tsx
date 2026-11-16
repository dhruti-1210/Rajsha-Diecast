'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/types';
import { userAuthUrl } from '@/lib/user-auth';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';
interface Store {
  cart: Product[]; total: number; add: (p: Product) => void; remove: (i: number) => void;
  drawer: 'cart' | null; setDrawer: (v: 'cart' | null) => void;
  modal: Product | null; setModal: (p: Product | null) => void;
  maxPrice: number; setMaxPrice: (n: number) => void;
  authStatus: AuthStatus; setAuthStatus: (status: AuthStatus) => void;
}
const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore must be used inside <StoreProvider>');
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [drawer, setDrawer] = useState<'cart' | null>(null);
  const [modal, setModal] = useState<Product | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(userAuthUrl('session'), {
          credentials: 'include',
          cache: 'no-store',
        });
        if (response.status === 401) {
          if (active) setAuthStatus('unauthenticated');
          return;
        }
        if (!response.ok) throw new Error('Could not check your login session.');
        if (active) setAuthStatus('authenticated');
      } catch (error) {
        if (active) console.error('Could not check the user session:', error);
      }
    }

    void checkSession();
    return () => { active = false; };
  }, []);

  const value = useMemo<Store>(() => ({
    cart, drawer, setDrawer, modal, setModal, maxPrice, setMaxPrice, authStatus, setAuthStatus,
    total: cart.reduce((s, c) => s + c.price, 0),
    add: (p) => { setCart((c) => [...c, p]); setDrawer('cart'); },
    remove: (i) => setCart((c) => c.filter((_, k) => k !== i)),
  }), [cart, drawer, modal, maxPrice, authStatus]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
