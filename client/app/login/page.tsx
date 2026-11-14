'use client';

import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import CarImage from '@/components/CarImage';
import { products } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [notice, setNotice] = useState('');
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOtp(Array(6).fill(''));
    setNotice('Email delivery is not configured yet, so no code was sent.');
    setStep('otp');
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

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Static demo only: OTP verification is not connected yet.');
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
                  <button className="btn login-submit" type="submit">Continue with email</button>
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
                        required
                      />
                    ))}
                  </div>
                  <button className="btn login-submit" type="submit" disabled={otp.some((digit) => !digit)}>Verify OTP</button>
                  {notice && <p className="login-notice" role="status">{notice}</p>}
                </form>
                <button className="change-email" type="button" onClick={() => { setStep('email'); setNotice(''); }}>← Change email</button>
              </>}
              <p className="login-signup">New to the garage? <a href="mailto:hello@rajshadiecast.com">Get in touch</a></p>
            </div>
          </section>
          <aside className="col-12 col-lg-6 login-art-panel">
            <div className="login-art-copy"><p className="eyebrow">BUILT FOR THE LOVE OF THE DRIVE</p><h2>Big passion.<br /><em>Small scale.</em></h2><p>Your next favourite model is waiting in the collection.</p></div>
            {/* <div className="login-car-art"><CarImage p={products[0]} /></div> */}
            <span className="login-art-caption">THE COLLECTOR'S GARAGE · EST. 2024</span>
          </aside>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
