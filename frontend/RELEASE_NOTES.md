Release: Security cleanup & wallet fallback UX (2025-10-08)

Summary
-------
This release removes accidentally committed environment files from repository history and hardens wallet creation to avoid build-time failures when `bip39` is unavailable. It also improves user-facing behavior when a mnemonic cannot be generated.

Key changes
-----------
- Removed `.env.local` from repository and purged it from git history (force-pushed cleaned history).
- Added `.env.local.example` and updated `.gitignore` to prevent re-committing secrets.
- `utils/solana.js`: `createWallet()` now attempts to use `bip39` but falls back to a secure random seed if `bip39` cannot be loaded. The fallback returns `mnemonic: null`.
- `frontend/pages/api/onboarding.js`: dynamic import of `createWallet` in server handler to avoid bundling `bip39` into client code.
- UI updates:
  - `frontend/pages/telegram-webapp.jsx`: stores privateKey locally for session and shows a prominent warning when no mnemonic is available.
  - `frontend/pages/profile.jsx`: reveals private key with a warning if mnemonic is missing.

Security actions required
-------------------------
- Rotate any exposed credentials discovered earlier (Telegram bot token, Supabase keys, Helius API key, etc.).
- Inform collaborators to re-clone the repository because the history was rewritten.

Notes
-----
- The fallback wallet is functional but lacks a human-readable recovery phrase. Encourage users to back up private keys immediately in that case.
- For production deployments, ensure `bip39` is installed in the server environment so mnemonics are generated normally.
