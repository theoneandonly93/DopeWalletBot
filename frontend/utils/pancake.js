// Minimal PancakeSwap helper utilities for BSC (client-side signing)
// NOTE: This file provides helpers to build transaction data for approve and swapExactTokensForTokens.
// It does NOT send transactions. The wallet (client) should sign and send using ethers provider/signer.

import { Interface } from 'ethers';

// PancakeSwap v2 router on BSC mainnet
export const PANCAKE_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) returns (uint[] memory amounts)'
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

export function encodeApprove(spender, amount){
  const erc = new Interface(ERC20_ABI);
  return erc.encodeFunctionData('approve', [spender, amount]);
}

export function encodeGetAmountsOut(amountIn, path){
  const router = new Interface(ROUTER_ABI);
  return router.encodeFunctionData('getAmountsOut', [amountIn, path]);
}

export function encodeSwapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline){
  const router = new Interface(ROUTER_ABI);
  return router.encodeFunctionData('swapExactTokensForTokens', [amountIn, amountOutMin, path, to, deadline]);
}

export default {
  PANCAKE_ROUTER,
  encodeApprove,
  encodeGetAmountsOut,
  encodeSwapExactTokensForTokens,
};
