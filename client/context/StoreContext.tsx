'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createCart, deleteCart, getCartList, updateCartQuantity } from '@/api/Cart';
import type { Cart as CartRecord, CartItem } from '@/types/Cart';
import type { Product } from '@/types';
import { userAuthUrl } from '@/lib/user-auth';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';
const CART_STORAGE_KEY = 'rajsha-diecast-guest-cart';

type StoredCartItem = Omit<CartItem, 'quantity'> & { quantity?: number };

function isCartItem(value: unknown): value is StoredCartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    (typeof item.id === 'string' || typeof item.id === 'number')
    && typeof item.name === 'string'
    && typeof item.brand === 'string'
    && typeof item.scale === 'string'
    && typeof item.price === 'number'
    && typeof item.condition === 'string'
    && typeof item.color === 'string'
    && typeof item.left === 'number'
    && typeof item.image === 'string'
    && typeof item.key === 'string'
    && (item.stock === undefined || typeof item.stock === 'number')
    && (item.quantity === undefined || (
      typeof item.quantity === 'number' && Number.isSafeInteger(item.quantity) && item.quantity >= 1
    ))
    && (item.cartId === undefined || typeof item.cartId === 'string')
  );
}

function mapCartRecord(record: CartRecord): CartItem | null {
  const product = record.Product_Id;
  if (!product || typeof product !== 'object') return null;

  return {
    id: product._id,
    name: product.Name,
    brand: product.BrandName?.trim() || product.Company_Id || '',
    scale: product.Size,
    price: product.Price,
    condition: 'Unknown',
    color: '#d4af37',
    left: product.TotalStock > 0 && product.TotalStock <= 2 ? product.TotalStock : 0,
    image: product.Image?.[0] || '',
    stock: product.TotalStock,
    key: record._id,
    cartId: record._id,
    quantity: record.Quantity || 1,
  };
}

function mergeDuplicateItems(items: CartItem[]) {
  const merged: CartItem[] = [];
  for (const item of items) {
    const existing = merged.find((entry) => String(entry.id) === String(item.id));
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.push({ ...item });
    }
  }
  return merged;
}

interface Store {
  cart: CartItem[];
  total: number;
  cartLoading: boolean;
  add: (p: Product, quantity?: number) => void;
  remove: (i: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  cartError: string;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartError, setCartError] = useState('');
  const [drawer, setDrawer] = useState<'cart' | null>(null);
  const [modal, setModal] = useState<Product | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let active = true;
    setCart([]);
    setCartHydrated(false);
    setCartError('');

    if (authStatus === 'checking') {
      return () => { active = false; };
    }

    async function loadCart() {
      try {
        if (authStatus === 'unauthenticated') {
          const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            const parsed: unknown = JSON.parse(savedCart);
            if (!Array.isArray(parsed)) {
              throw new Error('Saved cart data is invalid.');
            }
            if (active) {
              const items = parsed.filter(isCartItem).map((item) => ({
                ...item,
                quantity: item.quantity ?? 1,
                isSaving: false,
                isRemoving: false,
                isUpdating: false,
              }));
              setCart(mergeDuplicateItems(items));
            }
          }
          return;
        }

        const response = await getCartList();
        if (!response.success) {
          throw new Error(response.message || 'Could not load your cart.');
        }
        const items = response.data.map(mapCartRecord).filter(
          (item): item is CartItem => item !== null,
        );
        if (active) {
          setCart(items);
          if (items.length !== response.data.length) {
            setCartError('Some saved cart items are no longer available.');
          }
        }
      } catch (error) {
        if (active) {
          setCartError(error instanceof Error ? error.message : 'Could not load your cart.');
        }
      } finally {
        if (active) setCartHydrated(true);
      }
    }

    void loadCart();
    return () => { active = false; };
  }, [authStatus]);

  useEffect(() => {
    if (!cartHydrated || authStatus !== 'unauthenticated') return;
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart.map((item) => ({
          ...item,
          isSaving: false,
          isRemoving: false,
        }))),
      );
    } catch (error) {
      setCartError(error instanceof Error
        ? error.message
        : 'Could not save your cart in this browser.');
    }
  }, [cart, cartHydrated, authStatus]);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (window.location.pathname.startsWith('/admin-panel')) return;
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

  const add = useCallback((product: Product, quantity = 1) => {
    if (authStatus === 'checking' || !cartHydrated) {
      setDrawer('cart');
      setCartError('Please wait while your cart is loading, then add the model again.');
      return;
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) return;

    const productId = String(product.id);
    const existing = cart.find((item) => String(item.id) === productId);
    if (existing?.isSaving || existing?.isUpdating || existing?.isRemoving) {
      setCartError('This model is already being updated in your cart.');
      return;
    }
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (product.stock !== undefined && nextQuantity > product.stock) {
      setCartError(`Only ${product.stock} of this model are available.`);
      return;
    }

    if (authStatus === 'unauthenticated') {
      setCart((current) => {
        const currentItem = current.find((item) => String(item.id) === productId);
        if (currentItem) {
          return current.map((item) => (
            item.key === currentItem.key
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ));
        }
        const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        return [...current, { ...product, key, quantity }];
      });
      setCartError('');
      setDrawer('cart');
      return;
    }

    if (!/^[a-f\d]{24}$/i.test(productId)) {
      setCartError('This model is not linked to a server product and could not be saved.');
      return;
    }

    const key = existing?.key ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setCart((current) => {
      const currentItem = current.find((item) => String(item.id) === productId);
      if (currentItem) {
        return current.map((item) => (
          item.key === currentItem.key
            ? { ...item, quantity: item.quantity + quantity, isSaving: true }
            : item
        ));
      }
      return [...current, { ...product, key, quantity, isSaving: true }];
    });
    setCartError('');
    setDrawer('cart');
    void createCart({ Product_Id: productId, Quantity: quantity })
      .then((response) => {
        if (!response.success || !response.data?._id) {
          throw new Error(response.message || 'Could not save this item to your cart.');
        }
        setCart((current) => current.map((item) => (
          String(item.id) === productId
            ? {
              ...item,
              cartId: response.data._id,
              quantity: response.data.Quantity,
              isSaving: false,
            }
            : item
        )));
      })
      .catch((error: unknown) => {
        setCart((current) => {
          if (!existing) return current.filter((item) => item.key !== key);
          return current.map((item) => (
            item.key === existing.key
              ? { ...item, quantity: existing.quantity, isSaving: false }
              : item
          ));
        });
        setCartError(error instanceof Error
          ? error.message
          : 'Could not save this item to your cart.');
      });
  }, [authStatus, cart, cartHydrated]);

  const remove = useCallback((index: number) => {
    const item = cart[index];
    if (!item || item.isSaving || item.isRemoving || item.isUpdating) return;

    setCartError('');
    if (!item.cartId) {
      setCart((current) => current.filter((currentItem) => currentItem.key !== item.key));
      return;
    }

    setCart((current) => current.map((currentItem) => (
      currentItem.key === item.key ? { ...currentItem, isRemoving: true } : currentItem
    )));

    void deleteCart(item.cartId)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Could not remove this item from your cart.');
        }
        setCart((current) => current.filter((currentItem) => currentItem.key !== item.key));
      })
      .catch((error: unknown) => {
        setCart((current) => current.map((currentItem) => (
          currentItem.key === item.key
            ? { ...currentItem, isRemoving: false }
            : currentItem
        )));
        setCartError(error instanceof Error
          ? error.message
          : 'Could not remove this item from your cart.');
      });
  }, [cart]);

  const setQuantity = useCallback((key: string, quantity: number) => {
    const item = cart.find((currentItem) => currentItem.key === key);
    if (
      !item
      || item.isSaving
      || item.isRemoving
      || item.isUpdating
      || !Number.isSafeInteger(quantity)
      || quantity < 1
      || quantity === item.quantity
    ) return;
    if (item.stock !== undefined && quantity > item.stock) {
      setCartError(`Only ${item.stock} of this model are available.`);
      return;
    }

    const previousQuantity = item.quantity;
    setCartError('');
    if (!item.cartId) {
      setCart((current) => current.map((currentItem) => (
        currentItem.key === key ? { ...currentItem, quantity } : currentItem
      )));
      return;
    }

    setCart((current) => current.map((currentItem) => (
      currentItem.key === key ? { ...currentItem, quantity, isUpdating: true } : currentItem
    )));
    void updateCartQuantity(item.cartId, quantity)
      .then((response) => {
        if (!response.success || !Number.isSafeInteger(response.data?.Quantity)) {
          throw new Error(response.message || 'Could not update this item quantity.');
        }
        setCart((current) => current.map((currentItem) => (
          currentItem.key === key
            ? { ...currentItem, quantity: response.data.Quantity, isUpdating: false }
            : currentItem
        )));
      })
      .catch((error: unknown) => {
        setCart((current) => current.map((currentItem) => (
          currentItem.key === key
            ? { ...currentItem, quantity: previousQuantity, isUpdating: false }
            : currentItem
        )));
        setCartError(error instanceof Error
          ? error.message
          : 'Could not update this item quantity.');
      });
  }, [cart]);

  const value = useMemo<Store>(() => ({
    cart, cartError, cartLoading: !cartHydrated, drawer, setDrawer, modal, setModal, maxPrice, setMaxPrice, authStatus, setAuthStatus,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    add, remove, setQuantity,
  }), [cart, cartError, cartHydrated, drawer, modal, maxPrice, authStatus, add, remove, setQuantity]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
