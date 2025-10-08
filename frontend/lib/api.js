import axios from "axios";
const B = process.env.NEXT_PUBLIC_BACKEND_URL || "https://dopewalletbot-production.up.railway.app";

export async function apiHealth(){ return axios.get(`${B}/api/health`); }
export async function getPortfolio(pubkey){
	try {
		return (await axios.get(`${B}/api/wallet/portfolio`, { params: { pubkey } })).data;
	} catch (err) {
		console.warn('getPortfolio failed', err?.response?.status, err?.message);
		// Return a safe default so the UI can render without backend support.
		return { tokens: [], lp: [], balance: 0 };
	}
}

// Request a quote from the backend (which proxies Jupiter)
export async function jupQuote(inMint, outMint, amount, slippageBps=100){
	return (await axios.post(`${B}/swap/quote`, { inputMint: inMint, outputMint: outMint, amount, slippageBps })).data;
}

// Execute swap via backend. Backend expects { userPrivateKey, route }
export async function jupSwapTx(userPrivateKey, route){
	return (await axios.post(`${B}/swap/execute`, { userPrivateKey, route })).data;
}

export async function tokenMarket(mint){ return (await axios.get(`${B}/api/token/market`, { params: { mint } })).data; }
