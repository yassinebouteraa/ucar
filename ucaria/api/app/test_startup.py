import traceback
import asyncio
from app.main import lifespan
from fastapi import FastAPI
import sys

async def test():
    try:
        async with lifespan(FastAPI()):
            print("Lifespan started successfully!")
    except Exception as e:
        print("ERROR IN LIFESPAN:")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test())
