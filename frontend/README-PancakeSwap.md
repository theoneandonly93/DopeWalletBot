PancakeSwap integration (client-side signing)

This project includes a minimal PancakeSwap helper and a scaffolded UI for BSC swaps.

What was added
- `utils/pancake.js`: helper to encode PancakeSwap router calls (getAmountsOut, swapExactTokensForTokens).
- `pages/swap.jsx`: when `chain === 'bsc'`, the page will attempt to build a Pancake getAmountsOut call via JSON-RPC eth_call and prepare swap tx data.

How to enable client-side signing
1. Install ethers v6 in the frontend:

```bash
cd frontend
npm install ethers@^6.9.0
```

2. Set `NEXT_PUBLIC_BSC_RPC` in your environment (e.g., .env.local) to a BSC RPC endpoint:

NEXT_PUBLIC_BSC_RPC=https://bsc-dataseed.binance.org/

3. The current scaffold expects the wallet vault to be unlocked to return a private key string via `loadVault(password)`. For security, prefer prompting the user and using an in-browser signer (MetaMask/WalletConnect) instead of raw private keys.

Notes & next improvements
- Proper token decimals handling is required for precise quoting and minOut calculations.
- Approve flow is required for ERC20 tokens (call `approve` on token contract to allow the Pancake router to spend input token). We provide `encodeApprove` in `utils/pancake.js`.
- For client-side signing, integrate `ethers` Signer (e.g., Wallet.fromPrivateKey(pk).connect(provider)) and use `signer.sendTransaction(tx)`.
- Consider using 1inch API if you want aggregated routes across BSC DEXes.

Security
- Never send plain private keys to untrusted backends. Client-side signing is recommended.
- If you must perform server-side signing, use a secure KMS and never store keys in source control.
