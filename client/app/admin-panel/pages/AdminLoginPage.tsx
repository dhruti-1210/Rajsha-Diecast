'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  signInAdmin,
} from '../middleware/authmiddleware';

type AdminLoginPageProps = {
  onAuthenticated: () => void;
  sessionError?: string;
};

export default function AdminLoginPage({ onAuthenticated, sessionError = '' }: AdminLoginPageProps) {
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [error, setError] = useState(sessionError);

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (!signInAdmin(email, password)) {
        setError('Email or password is incorrect.');
        return;
      }
      onAuthenticated();
    } catch {
      setError('Could not start a demo session. Check your browser storage settings.');
    }
  }

  return (
    <main className="admin-login-screen">
      <section className="admin-login-card">
        <Link className="admin-login-logo" href="/" aria-label="Rajsha Diecast home">
          <Image src="/images/logo.png" alt="Rajsha Diecast" width={150} height={106} priority />
        </Link>

        <h1>Log in</h1>
      
        {/* <p className="admin-login-description">Sign in to manage your diecast inventory.</p> */}

        <form className="admin-login-form" onSubmit={signIn}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            autoComplete="username"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="admin-login-error" role="alert">{error}</p>}

          <button type="submit" className="admin-login-submit">Log in</button>
        </form>

        {/* <div className="admin-demo-credentials">
          <strong>Demo credentials</strong>
          <span>Email: {DEMO_ADMIN_EMAIL}</span>
          <span>Password: {DEMO_ADMIN_PASSWORD}</span>
        </div> */}
        <p className="admin-login-note">Demo-only client-side authentication. Do not use these credentials for production access.</p>
      </section>
    </main>
  );
}
