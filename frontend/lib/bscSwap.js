import { ethers } from 'ethers';

// Minimal PancakeSwap v2 router helper for BSC (client-side signing)
// This file contains helper functions to build and send simple swaps.

// PancakeSwap Router V2 (mainnet BSC) address
export const PANCAKE_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
// WBNB token on BSC
export const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

// ABI fragments we'll need
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function decimals() view returns (uint8)'
];

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

export function getProvider(rpcUrl) {
  if (!rpcUrl) throw new Error('rpcUrl required');
  return new ethers.JsonRpcProvider(rpcUrl);
}

export async function getQuote({ amountIn, path, rpcUrl }) {
  const provider = getProvider(rpcUrl);
  const router = new ethers.Contract(PANCAKE_ROUTER, ROUTER_ABI, provider);
  const amounts = await router.getAmountsOut(amountIn, path);
  return amounts; // BigInt[]
}

export async function needsApproval({ tokenAddress, owner, spender, rpcUrl }) {
  const provider = getProvider(rpcUrl);
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const allowance = await token.allowance(owner, spender);
  return allowance === 0n;
}

export async function needsApprovalAmount({ tokenAddress, owner, spender, amount, rpcUrl }) {
  const provider = getProvider(rpcUrl);
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const allowance = await token.allowance(owner, spender);
  const req = BigInt(amount.toString());
  return allowance < req;
}

export function buildApproveTx({ tokenAddress, spender, amount = ethers.MaxUint256 }) {
  const iface = new ethers.Interface(ERC20_ABI);
  const data = iface.encodeFunctionData('approve', [spender, amount]);
  return { to: tokenAddress, data };
}

export function buildSwapExactTokensForTokens({ amountIn, amountOutMin, path, to, deadline }) {
  const iface = new ethers.Interface(ROUTER_ABI);
  const data = iface.encodeFunctionData('swapExactTokensForTokens', [amountIn, amountOutMin, path, to, deadline]);
  return { to: PANCAKE_ROUTER, data };
}

export function buildSwapExactETHForTokens({ amountOutMin, path, to, deadline, value }) {
  const iface = new ethers.Interface(ROUTER_ABI);
  const data = iface.encodeFunctionData('swapExactETHForTokens', [amountOutMin, path, to, deadline]);
  return { to: PANCAKE_ROUTER, data, value };
}

export function buildSwapExactTokensForETH({ amountIn, amountOutMin, path, to, deadline }) {
  const iface = new ethers.Interface(ROUTER_ABI);
  const data = iface.encodeFunctionData('swapExactTokensForETH', [amountIn, amountOutMin, path, to, deadline]);
  return { to: PANCAKE_ROUTER, data };
}

export function isNativeAddress(addr){
  // we treat WBNB as wrapped token; use 'ETH' flag by passing null or 'BNB' in UI.
  if (!addr) return true;
  const low = String(addr).toLowerCase();
  return (low === 'bnb' || low === 'eth' || low === 'native');
}

export async function sendSignedTx({ signer, tx }) {
  // signer is an ethers.Signer already connected (user's wallet)
  if (!signer) throw new Error('Signer required');
  const populated = await signer.populateTransaction(tx);
  const response = await signer.sendTransaction(populated);
  return response; // TransactionResponse
}

// Small helper to normalize decimals
export async function getDecimals(tokenAddress, rpcUrl) {
  const provider = getProvider(rpcUrl);
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  try {
    const d = await token.decimals();
    return Number(d);
  } catch (err) {
    return 18;
  }
}
