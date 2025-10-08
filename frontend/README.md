# Frontend PancakeSwap Integration (Client-side signing)

This project includes a minimal PancakeSwap client-side integration for BSC.

Files added:
- `lib/bscSwap.js` - helper functions to quote, build approve/swap txs and send signed transactions using ethers.js.

How it works (summary):
- Quoting: uses `getAmountsOut` on PancakeSwap Router via a public RPC to get a quote.
- Approve & Swap: build the `swapExactTokensForTokens` calldata and use an injected wallet (MetaMask) to sign and send the transaction.

Security notes:
- Client-side signing keeps private keys on the user's device/wallet. Never send private keys to a server.
- Production should implement slippage protection (`amountOutMin`) and gas estimation before sending txs.
- For new tokens, check allowances and prompt for `approve` before swapping.
- Consider using a server-side simulation endpoint for safety checks if desired.

RPC config:
- Uses `NEXT_PUBLIC_BSC_RPC` environment variable if present, else defaults to `https://bsc-dataseed.binance.org/`.

Dependencies:
- `ethers` ^6.x

Next steps:
- Add allowance check and approve flow in the UI.
- Add slippage controls and better quoting UX.
- Add tests for `lib/bscSwap.js` helper functions.
