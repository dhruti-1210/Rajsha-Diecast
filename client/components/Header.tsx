'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';

export function Logo() {
  const [failed, setFailed] = useState(false);
  return (
    <a href="/" className="logo logo-mark" aria-label="Rajsha Diecast home">
      {failed ? <>RAJSHA<span>DIECAST</span></> :
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/logo.png" alt="Rajsha Diecast" onError={() => setFailed(true)} />}
    </a>
  );
}

export default function Header() {
  const { cart, wishlist, setDrawer } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 60);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState);
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);
  return (
    <header className={`nav${scrolled ? ' solid' : ''}`} style={{ padding: scrolled ? '10px 5%' : '16px 5%' }}>
      <Logo />
      <form className="search" onSubmit={(e) => e.preventDefault()}><input type="search" placeholder="Search models, brands, scale..." /></form>
      <nav className={open ? 'open' : undefined} onClick={() => setOpen(false)}>
        <a href="/shop">Shop all</a><a href="/#grading">Track</a><a href="/login">Login</a>
        <div className="nav-actions">
          <a href="#" className="cart" onClick={(e) => { e.preventDefault(); setDrawer('cart'); }}>Cart <b>{cart.length}</b></a>
          <button
            type="button"
            className="wishlist-trigger"
            aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} items` : ''}`}
            title="Wishlist"
            onClick={() => setDrawer('wishlist')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
            {wishlist.length > 0 && <b>{wishlist.length}</b>}
          </button>
        </div>
      </nav>
      <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>&#9776;</button>
    </header>
  );
}
