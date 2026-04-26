import os
import sys

print("Testing database connection...")
try:
    import psycopg
except ImportError:
    print("psycopg is not installed")
    sys.exit(1)

url = os.environ.get("DATABASE_URL")
print(f"URL from env: {url}")

try:
    conn = psycopg.connect(url)
    print("Connection successful!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {str(e)}")
    print(f"Exception type: {type(e).__name__}")
