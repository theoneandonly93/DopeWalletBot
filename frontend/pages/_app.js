import '../styles/globals.css';
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
    <main data-theme="phantomdark">
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Component {...pageProps} />
      )}
    </main>
  );
}
