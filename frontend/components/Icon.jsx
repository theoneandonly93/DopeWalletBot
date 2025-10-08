import React from 'react';

// Consolidated white-outline SVG icon set. Icons use stroke="currentColor"
// so parent text color controls active/inactive state. Keep shapes simple.
export default function Icon({ name, size = 18, className = '' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', className };
  switch (name) {
    // Existing app icons
    case 'Search':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Dots':
      return (
        <svg {...common} aria-hidden>
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="18" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'Transfer':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Plus':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Upload':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 8l-5-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Cash':
      return (
        <svg {...common} aria-hidden>
          <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'Percent':
      return (
        <svg {...common} aria-hidden>
          <circle cx="6" cy="6" r="1.6" fill="currentColor" />
          <circle cx="18" cy="18" r="1.6" fill="currentColor" />
          <path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Ghost':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 12a9 9 0 0 1 18 0v6a1 1 0 0 1-1 1h-3.5a.5.5 0 0 0-.5.5V21a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 0-.5-.5H4a1 1 0 0 1-1-1v-6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M9 10h.01M15 10h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'ChevronRight':
      return (
        <svg {...common} aria-hidden>
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'Close':
      return (
        <svg {...common} aria-hidden>
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'Settings':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 18.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.07c.63 0 1.18-.39 1.51-1a1.65 1.65 0 0 0-.33-1.82L3.4 6.7A2 2 0 1 1 6.24 3.86l.06.06c.44.44 1 .66 1.64.66h.06c.6 0 1.17-.22 1.61-.66l.06-.06A2 2 0 1 1 14.76 6.24l-.06.06c-.44.44-.66 1-.66 1.64v.06c0 .6.22 1.17.66 1.61l.06.06A2 2 0 1 1 17.7 14.6l-.06.06c-.44.44-.66 1-.66 1.64v.06c0 .6.22 1.17.66 1.61z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case 'Reload':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 12a9 9 0 1 0-3.9 7.1L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'Bot':
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'Document':
      return (
        <svg {...common} aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case 'Star':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 17.3l-5.6 3.1 1.1-6.3L2.8 9.7l6.3-.9L12 3.5l2.9 5.3 6.3.9-4.7 4.4 1.1 6.3L12 17.3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'Lock':
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case 'Unlock':
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M7 11V8a5 5 0 0 1 9.9-1" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case 'Trash':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    // Nav icons (also used elsewhere) - keep label names used in BottomNav
    case 'Wallet':
      return (
        <svg {...common} aria-hidden>
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M16 10h2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Swap':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 7h11l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 17H9l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Profile':
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'Browser':
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M9 15l6-3-3 6-3-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}
