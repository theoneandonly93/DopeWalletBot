import os
import time
import json
import requests
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from supabase import create_client, Client
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings("ignore")

# --------------------------
# ENVIRONMENT CONFIG
# --------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wjyqpjssxoxwmlyldgpf.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
DEX_API_URL = os.getenv("DEX_API_URL", "https://api.dexscreener.com/token-boosts/top/v1")
OPEN_AI_KEY = os.getenv("OPEN_AI_API_KEY") or os.getenv("OPENAI_API_KEY")
MONITOR_CALL_OPENAI = os.getenv("MONITOR_CALL_OPENAI", "false").lower() in ("1", "true", "yes")

supabase: Client | None = None
if SUPABASE_KEY and len(SUPABASE_KEY) > 20:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print('[AI] Failed to create Supabase client:', e)
        supabase = None
else:
    print('[AI] SUPABASE_KEY missing or too short — skipping Supabase client (local dev)')

if OPEN_AI_KEY:
    print('[AI] OPEN_AI_API_KEY detected in environment')
else:
    print('[AI] OPEN_AI_API_KEY not set; OpenAI features disabled')

# --------------------------
# MODEL PLACEHOLDER
# --------------------------
scaler = MinMaxScaler()
model = GradientBoostingRegressor(n_estimators=50, learning_rate=0.1, max_depth=3)

# --------------------------
# DATA FETCHING
# --------------------------
def fetch_dex_data():
    # First try configured DexScreener-like endpoint (if set)
    dex_url = DEX_API_URL
    try:
        res = requests.get(dex_url, timeout=20)
        if res.status_code == 200:
            j = res.json()

            # Normalize possible response shapes: list, dict with 'pairs', dict with 'tokens', or dict with 'data'
            if isinstance(j, dict) and ("pairs" in j or "tokens" in j or "data" in j):
                tokens = j.get("pairs") or j.get("tokens") or j.get("data") or []
            elif isinstance(j, list):
                tokens = j
            else:
                # unknown shape, try to find a list value inside
                tokens = []
                for v in j.values() if isinstance(j, dict) else []:
                    if isinstance(v, list):
                        tokens = v
                        break

            def nested_get(obj, *paths):
                for p in paths:
                    cur = obj
                    for part in p.split('.'):
                        if not isinstance(cur, dict):
                            cur = None
                            break
                        cur = cur.get(part)
                    if cur is not None:
                        return cur
                return None

            data = []
            for t in (tokens or [])[:400]:
                try:
                    symbol = (nested_get(t, 'baseToken.symbol', 'token.symbol', 'symbol') or "")
                    address = (nested_get(t, 'baseToken.address', 'token.address', 'address', 'tokenAddress') or "")
                    price = nested_get(t, 'priceUsd', 'price', 'price_usd') or 0
                    volume = nested_get(t, 'volume.h24', 'volume24h', 'volume', 'volume_24h') or 0
                    txns_buys = nested_get(t, 'txns.h1.buys', 'txns.h1.buys') or 0
                    txns_sells = nested_get(t, 'txns.h1.sells', 'txns.h1.sells') or 0
                    txns_1h = float(txns_buys or 0) + float(txns_sells or 0)

                    info = {
                        "symbol": (symbol or "").upper(),
                        "address": address,
                        "price": float(price or 0),
                        "volume_24h": float(volume or 0),
                        "txns_1h": float(txns_1h or 0),
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    }
                    data.append(info)
                except Exception:
                    continue

            if data:
                # Log a tiny sample for debugging
                try:
                    print("[AI] DexScreener parsed sample:", json.dumps(data[:5], default=str))
                except Exception:
                    pass
                return data, "dexscreener"
        else:
            print("DexScreener API error", res.status_code)
    except Exception as dex_err:
        print("DexScreener request error:", dex_err)

    # Fallback: use CoinGecko public markets endpoint to get price + volume data
    # Note: CoinGecko returns coins (not on-chain mints). We'll use symbol as address when mint unknown.
    try:
        cg_url = "https://api.coingecko.com/api/v3/coins/markets"
        params = {"vs_currency": "usd", "order": "market_cap_desc", "per_page": 250, "page": 1, "sparkline": "false"}
        res = requests.get(cg_url, params=params)
        if res.status_code != 200:
            print("CoinGecko API error", res.status_code)
            return [], "none"
        coins = res.json()
        data = []
        for c in coins:
            try:
                info = {
                    "symbol": (c.get("symbol") or "").upper(),
                    "address": c.get("id"),
                    "price": float(c.get("current_price") or 0),
                    "volume_24h": float(c.get("total_volume") or 0),
                    "txns_1h": 0.0,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
                data.append(info)
            except Exception:
                continue
        try:
            print("[AI] CoinGecko parsed sample:", json.dumps(data[:5], default=str))
        except Exception:
            pass
        return data, "coingecko"
    except Exception as cg_err:
        print("CoinGecko request error:", cg_err)
        return [], "none"

# --------------------------
# TRAINING AND PREDICTION
# --------------------------
def train_and_predict(df):
    try:
        if df.empty:
            print("No data for training")
            return []
        features = ["price", "volume_24h", "txns_1h"]
        df = df.dropna(subset=features)
        X = df[features].values
        y = np.log1p(df["volume_24h"] * df["txns_1h"])
        X_scaled = scaler.fit_transform(X)
        model.fit(X_scaled, y)
        preds = model.predict(X_scaled)
        df["score"] = (preds - preds.min()) / (preds.max() - preds.min() + 1e-9)
        ranked = df.sort_values("score", ascending=False).head(10)
        return ranked
    except Exception as e:
        print("train_and_predict error:", e)
        return []

# --------------------------
# MAIN LOOP
# --------------------------
def main(run_once=False):
    while True:
        print(f"[AI] Fetching token data at {datetime.now(timezone.utc)}")
        data, source = fetch_dex_data()
        df = pd.DataFrame(data)
        if len(df) == 0:
            time.sleep(600)
            continue
        ranked = train_and_predict(df)
        if len(ranked) == 0:
            time.sleep(600)
            continue

        for _, row in ranked.iterrows():
            token = {
                "mint": row["address"],
                "symbol": row["symbol"],
                "score": float(row["score"]),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "source": source,
            }
            if supabase:
                try:
                    supabase.table("ai_predictions").upsert(token).execute()
                except Exception as e:
                    print("Supabase insert error:", e)
            else:
                # Running without a Supabase key — skip persistence in local dev
                print('[AI] Supabase not configured — skipping DB upsert for', token.get('symbol'))
        # Optionally call OpenAI to summarize the ranked tokens
        if OPEN_AI_KEY and MONITOR_CALL_OPENAI:
            try:
                top_list = ranked[['symbol','address','score']].to_dict(orient='records')
                prompt = f"Summarize these top tokens and why they might be interesting: {top_list[:10]}"
                headers = { 'Content-Type': 'application/json', 'Authorization': f'Bearer {OPEN_AI_KEY}' }
                payload = { 'model': 'gpt-3.5-turbo', 'messages': [ {'role':'user','content': prompt } ], 'max_tokens': 200 }
                r = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload, timeout=30)
                if r.status_code == 200:
                    j = r.json()
                    summary = j.get('choices', [{}])[0].get('message', {}).get('content', '')
                    # crude token estimate: use characters/4 ~ tokens
                    estimated_tokens = int(len(prompt)/4) + 200
                    cost_estimate = estimated_tokens / 1000 * 0.002  # approx price for gpt-3.5-turbo
                    print(f"[AI] OpenAI summary (est cost ${cost_estimate:.6f}):\n", summary)
                else:
                    print('[AI] OpenAI API error', r.status_code, r.text[:200])
            except Exception as e:
                print('[AI] OpenAI call error', e)
        print(f"[AI] Updated {len(ranked)} token predictions.")
        if run_once:
            break
        time.sleep(600)  # every 10 minutes

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-once", action="store_true")
    args = parser.parse_args()
    main(run_once=args.run_once)
