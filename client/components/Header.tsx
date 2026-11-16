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
        <Link href="/shop">Shop all</Link><Link href="/#grading">Track</Link>
        {authStatus === 'checking' ? (
          <span className="nav-account-pending" role="status" aria-label="Checking account" />
        ) : <Link href={authStatus === 'authenticated' ? '/user-panel' : '/login'} className={authStatus === 'authenticated' ? 'profile-link' : undefined}>
          {authStatus === 'authenticated' ? <>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>
            <span>My profile</span>
          </> : 'Login'}
        </Link>}
        <a href="#" className="cart" onClick={(e) => { e.preventDefault(); setDrawer('cart'); }}>Cart <b>{cart.length}</b></a>
      </nav>
      <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>&#9776;</button>
    </header>
  );
}
