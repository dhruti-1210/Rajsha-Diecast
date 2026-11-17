'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export function Logo() {
  const [failed, setFailed] = useState(false);
  return (
    <Link href="/" className="logo logo-mark" aria-label="Rajsha Diecast home">
      {failed ? <>RAJSHA<span>DIECAST</span></> :
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/logo.png" alt="Rajsha Diecast" onError={() => setFailed(true)} />}
    </Link>
  );
}

export default function Header() {
  const { cart, setDrawer, authStatus } = useStore();
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
        <Link href="/" className="nav-home">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-6h6v6" /></svg>
          <span>Home</span>
        </Link>
        <Link href="/shop">Shop all</Link><Link href="/#grading">Track</Link>
        {authStatus === 'checking' ? (
          <span className="nav-account-pending" role="status" aria-label="Checking account" />
        ) : <Link href={authStatus === 'authenticated' ? '/user-panel' : '/login'} className={authStatus === 'authenticated' ? 'profile-link' : undefined}>
          {authStatus === 'authenticated' ? <>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>
            <span>My profile</span>
          </> : 'Login'}
        </Link>}
        <a href="#" className="cart" aria-label={`Cart, ${cart.length} items`} onClick={(e) => { e.preventDefault(); setDrawer('cart'); }}>
          <span>Cart</span>
          <span className="cart-icon-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
            <b>{cart.length}</b>
          </span>
        </a>
      </nav>
      <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>&#9776;</button>
    </header>
  );
}
