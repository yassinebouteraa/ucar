# syntax=docker/dockerfile:1.7

FROM python:3.11-slim AS base

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    SENTENCE_TRANSFORMERS_HOME=/data/models/sentence_transformers

# System dependencies: tesseract for OCR, ffmpeg for audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first so source code changes do not bust this layer.
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --timeout=300 --retries=5 -r requirements.txt

# Pre-create model cache directory
RUN mkdir -p /data/models/whisper /data/models/openclip /data/models/sentence_transformers /data/models/blip


FROM base AS dev

# Keep app code in image for non-volume runs; in docker-compose this is overridden by bind-mount.
COPY app/ app/

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
