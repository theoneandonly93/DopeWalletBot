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
DEX_API_URL = os.getenv("DEX_API_URL", "https://api.dexscreener.com/latest/dex/tokens")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --------------------------
# MODEL PLACEHOLDER
# --------------------------
scaler = MinMaxScaler()
model = GradientBoostingRegressor(n_estimators=50, learning_rate=0.1, max_depth=3)

# --------------------------
# DATA FETCHING
# --------------------------
def fetch_dex_data():
    try:
        url = "https://api.dexscreener.com/latest/dex/tokens"
        res = requests.get(url)
        if res.status_code != 200:
            print("DexScreener API error", res.status_code)
            return []
        tokens = res.json().get("pairs", [])
        data = []
        for t in tokens[:200]:
            info = {
                "symbol": t.get("baseToken", {}).get("symbol"),
                "address": t.get("baseToken", {}).get("address"),
                "price": float(t.get("priceUsd", 0)),
                "volume_24h": float(t.get("volume", {}).get("h24", 0)),
                "txns_1h": float(t.get("txns", {}).get("h1", {}).get("buys", 0))
                + float(t.get("txns", {}).get("h1", {}).get("sells", 0)),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            data.append(info)
        return data
    except Exception as e:
        print("fetch_dex_data error:", e)
        return []

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
        data = fetch_dex_data()
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
            }
            try:
                supabase.table("ai_predictions").upsert(token).execute()
            except Exception as e:
                print("Supabase insert error:", e)

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
