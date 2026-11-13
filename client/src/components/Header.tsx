'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';

export function Logo() {
  const [failed, setFailed] = useState(false);
  return (
    <a href="#home" className="logo logo-mark" aria-label="Rajsha Diecast home">
      {failed ? <>RAJSHA<span>DIECAST</span></> :
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/logo.png" alt="Rajsha Diecast" onError={() => setFailed(true)} />}
    </a>
  );
}

export default function Header() {
  const { cart, setDrawer } = useStore();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setSolid(window.scrollY > 60); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  return (
    <header className={`nav${solid ? ' solid' : ''}`}>
      <Logo />
      <form className="search" onSubmit={(e) => e.preventDefault()}><input type="search" placeholder="Search models, brands, scale..." /></form>
      <nav className={open ? 'open' : undefined} onClick={() => setOpen(false)}>
        <a href="#featured">Shop all</a><a href="#grading">Track</a><a href="#contact">Login</a>
        <a href="#" className="cart" onClick={(e) => { e.preventDefault(); setDrawer(true); }}>Cart <b>{cart.length}</b></a>
      </nav>
      <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>&#9776;</button>
    </header>
  );
}
