import '../styles/globals.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Onboarding from '../components/Onboarding';
import Splash from '../components/Splash';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const signedIn = localStorage.getItem('dopewallet_signedin');
      return !signedIn;
    } catch (e) {
      return false;
    }
  });
  const router = useRouter();
  const [navKey, setNavKey] = useState(router.pathname);

  useEffect(() => {
    // Check if user is signed in (replace with your logic)
    const signedIn = localStorage.getItem('dopewallet_signedin');
    setShowOnboarding(!signedIn);
  }, []);

  // Listen for sign-in events (from other components) so we can hide onboarding immediately
  useEffect(() => {
    const onSignin = () => setShowOnboarding(false);
    const onSignout = () => setShowOnboarding(true);
    const onStorage = (e) => {
      if (e.key === 'dopewallet_signedin') {
        // if set to true -> hide onboarding, otherwise show it
        if (e.newValue === 'true') setShowOnboarding(false);
        else setShowOnboarding(true);
      }
    };
    window.addEventListener('dopewallet:signin', onSignin);
    window.addEventListener('dopewallet:signout', onSignout);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('dopewallet:signin', onSignin);
      window.removeEventListener('dopewallet:signout', onSignout);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    const handleRoute = (url) => setNavKey(url);
    router.events.on('routeChangeStart', handleRoute);
    return () => router.events.off('routeChangeStart', handleRoute);
  }, [router.events]);

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
        <Splash trigger={navKey} />
        {showOnboarding && router.pathname === '/' ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Component {...pageProps} />
        )}
      </main>
    </>
  );
}
