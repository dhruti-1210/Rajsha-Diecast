'use client';

import { useState, type FormEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { loginAdmin } from '../api/auth';

type AdminLoginPageProps = {
  onAuthenticated: () => void;
  sessionError?: string;
};

export default function AdminLoginPage({ onAuthenticated, sessionError = '' }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(sessionError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await loginAdmin(email, password);
      if (!response.success) {
        throw new Error(response.message || 'Email or password is incorrect.');
      }
      setEmail('');
      setPassword('');
      onAuthenticated();
    } catch (signInError) {
      const message = axios.isAxiosError<{ message?: string }>(signInError)
        ? signInError.response?.data?.message
        : signInError instanceof Error ? signInError.message : undefined;
      setError(message || 'Could not log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-screen">
      <section className="admin-login-card">
        <Link className="admin-login-logo" href="/" aria-label="Rajsha Diecast home">
          <Image src="/images/logo.png" alt="Rajsha Diecast" width={150} height={106} priority />
        </Link>

        <h1>Log in</h1>
      
        <form className="admin-login-form" onSubmit={signIn} autoComplete="off">
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            autoComplete="off"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            autoComplete="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="admin-login-error" role="alert">{error}</p>}

          <button type="submit" className="admin-login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="admin-login-note">Sign in with your admin account.</p>
      </section>
    </main>
  );
}
