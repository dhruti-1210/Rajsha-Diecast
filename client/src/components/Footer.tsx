'use client';
import { useState, type FormEvent } from 'react';
import { Logo } from './Header';

export default function Footer() {
  const [msg, setMsg] = useState('');
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setMsg('You will be notified!'); e.currentTarget.reset(); };
  return (
    <footer id="contact">
      <div className="fgrid">
        <div><Logo /><p>Diecast cars and collectibles, shipped across India. Every listing states its packaging condition before you buy.</p></div>
        <div><h4>Shop</h4><a href="#featured">All models</a><a href="#brands">Hot Wheels</a><a href="#brands">Mini GT</a><a href="#arrivals">New arrivals</a></div>
        <div><h4>Help</h4><a href="#">Contact</a><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Terms &amp; Privacy</a></div>
        <form onSubmit={submit}><h4>Stock alerts</h4><input type="email" placeholder="Your email" required /><button className="btn sm">Notify me</button><small>{msg}</small></form>
      </div>
      <p className="copy">© 2026 Rajsha Diecast. All rights reserved.</p>
    </footer>
  );
}
