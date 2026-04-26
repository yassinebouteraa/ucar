import os
import sys

try:
    import psycopg
except ImportError:
    print("psycopg is not installed")
    sys.exit(1)

url = os.environ.get("DATABASE_URL")
if not url:
    print("DATABASE_URL is missing")
    sys.exit(1)

print("Connecting to Supabase to wipe public schema...")
try:
    conn = psycopg.connect(url, autocommit=True)
    with conn.cursor() as cur:
        # Drop and recreate the public schema to wipe all tables
        cur.execute("DROP SCHEMA public CASCADE;")
        cur.execute("CREATE SCHEMA public;")
        cur.execute("GRANT ALL ON SCHEMA public TO postgres;")
        cur.execute("GRANT ALL ON SCHEMA public TO public;")
    print("Schema wiped successfully. Clean slate ready!")
    conn.close()
except Exception as e:
    print(f"Error wiping database: {e}")
    sys.exit(1)
