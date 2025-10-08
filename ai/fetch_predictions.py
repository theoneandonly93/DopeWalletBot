import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("SUPABASE_URL and SUPABASE_KEY must be set in the environment")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_top(n=10):
    # Fetch without server-side ordering and sort locally to avoid client signature issues
    resp = supabase.table("ai_predictions").select("*").limit(100).execute()
    if getattr(resp, 'data', None) is None:
        print("Error fetching predictions or no data; response:", resp)
        return []
    data = resp.data
    try:
        data = sorted(data, key=lambda r: r.get('score', 0), reverse=True)
    except Exception:
        pass
    return data[:n]

if __name__ == '__main__':
    for row in fetch_top(10):
        print(row)
