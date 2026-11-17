'use client';

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useToastify } from '@/components/Toastify';
import { useStore } from '@/context/StoreContext';
import { userAuthUrl } from '@/lib/user-auth';

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useToastify();
  const { setAuthStatus } = useStore();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [notice, setNotice] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let active = true;

    async function redirectIfAuthenticated() {
      try {
        const response = await fetch(userAuthUrl('session'), { credentials: 'include' });
        if (response.status === 401) {
          setAuthStatus('unauthenticated');
          return;
        }
        if (!response.ok) throw new Error('Could not check your login session.');
        if (active) {
          setAuthStatus('authenticated');
          router.replace('/user-panel');
        }
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not check your login session.');
        }
      }
    }

    void redirectIfAuthenticated();
    return () => { active = false; };
  }, [router, setAuthStatus]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = window.setTimeout(
      () => setResendCountdown((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  async function requestOtp() {
    setIsSubmitting(true);
    setNotice('');
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch(userAuthUrl('request-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (typeof result.resendAfterSeconds === 'number') {
          setResendCountdown(result.resendAfterSeconds);
        }
        throw new Error(result.message || 'Could not send a verification code.');
      }

      setEmail(normalizedEmail);
      setOtp(Array(6).fill(''));
      setResendCountdown(result.resendAfterSeconds ?? 120);
      setNotice('A verification code has been sent to your email.');
      setStep('otp');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await requestOtp();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not send a verification code.');
    }
  }

  async function handleResend() {
    try {
      await requestOtp();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not send a verification code.');
    }
  }

  function fillOtp(start: number, value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 6 - start);
    if (!digits) return;
    setOtp((current) => current.map((digit, index) =>
      index >= start && index < start + digits.length ? digits[index - start] : digit,
    ));
    otpInputs.current[Math.min(start + digits.length, 5)]?.focus();
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    event.preventDefault();
    fillOtp(index, event.clipboardData.getData('text'));
  }

  function handleOtpKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) otpInputs.current[index - 1]?.focus();
    if (event.key === 'ArrowLeft' && index > 0) otpInputs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 5) otpInputs.current[index + 1]?.focus();
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      notify('error', 'Please enter all 6 digits of the verification code.');
      return;
    }
    setIsSubmitting(true);
    setNotice('');
    try {
      const response = await fetch(userAuthUrl('verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Could not verify the code.');
      }
      sessionStorage.removeItem('rajsha.userEmail');
      setAuthStatus('authenticated');
      notify('success', 'Email verified. Welcome to your garage!');
      router.replace('/user-panel');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not verify the code.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="login-page container-fluid">
        <div className="row g-0 login-shell">
          <section className="col-12 col-lg-6 login-form-panel">
            <div className="login-form-content">
              {step === 'email' ? <>
                <p className="eyebrow">WELCOME BACK</p>
                <h1>Enter your <em>garage.</em></h1>
                <p className="login-intro">Continue with your email to receive a one-time code.</p>
                <form onSubmit={handleEmailSubmit}>
                  <label htmlFor="login-email">Email address</label>
                  <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  <button className="btn login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending code…' : 'Continue with email'}
                  </button>
                  {notice && <p className="login-notice" role="status">{notice}</p>}
                </form>
              </> : <>
                <p className="eyebrow">EMAIL VERIFICATION</p>
                <h1>Verify your <em>email.</em></h1>
                <p className="login-intro">Enter the 6-digit code for <strong className="otp-email">{email}</strong>.</p>
                <form onSubmit={handleVerify}>
                  <label htmlFor="otp-0">One-time password</label>
                  <div className="otp-inputs" role="group" aria-label="Six-digit verification code">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => { otpInputs.current[index] = element; }}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        pattern="[0-9]*"
                        maxLength={1}
                        aria-label={`Digit ${index + 1}`}
                        value={digit}
                        onChange={(event) => {
                          if (!event.target.value) {
                            setOtp((current) => current.map((value, slot) => slot === index ? '' : value));
                          } else {
                            fillOtp(index, event.target.value);
                          }
                        }}
                        onPaste={(event) => handleOtpPaste(event, index)}
                        onKeyDown={(event) => handleOtpKeyDown(event, index)}
                      />
                    ))}
                  </div>
                  <button className="btn login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Verifying…' : 'Verify OTP'}
                  </button>
                  {notice && <p className="login-notice" role="status">{notice}</p>}
                </form>
                <p className="login-notice" aria-live="polite">
                  {resendCountdown > 0
                    ? `Resend code in ${Math.floor(resendCountdown / 60)}:${String(resendCountdown % 60).padStart(2, '0')}`
                    : ''}
                </p>
                {resendCountdown === 0 && (
                  <button className="change-email" type="button" onClick={() => void handleResend()} disabled={isSubmitting}>
                    Resend code
                  </button>
                )}
                <button className="change-email" type="button" onClick={() => { setStep('email'); setNotice(''); }}>← Change email</button>
              </>}
              <p className="login-signup">New to the garage? <a href="mailto:hello@rajshadiecast.com">Get in touch</a></p>
            </div>
          </section>
          <aside className="col-12 col-lg-6 login-art-panel">
            <div className="login-art-copy px-5"><p className="eyebrow">BUILT FOR THE LOVE OF THE DRIVE</p><h2>Big passion.<br /><em>Small scale.</em></h2><p>Your next favourite model is waiting in the collection.</p></div>
            <span className="login-art-caption">THE COLLECTOR'S GARAGE · EST. 2024</span>
          </aside>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
