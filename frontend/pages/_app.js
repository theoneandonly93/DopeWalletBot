import '../styles/globals.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Onboarding from '../components/Onboarding';

export default function App({ Component, pageProps }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    // Check if user is signed in (replace with your logic)
    const signedIn = localStorage.getItem('dopewallet_signedin');
    setShowOnboarding(!signedIn);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('dopewallet_signedin', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/logo-512.png" />
        <link rel="apple-touch-icon" href="/logo-512.png" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <main data-theme="phantomdark">
        {showOnboarding ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Component {...pageProps} />
        )}
      </main>
    </>
  );
}
