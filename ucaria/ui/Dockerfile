# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app

# Install deps first so source code changes do not bust dependency cache.
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi


FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development

# Reuse installed deps from deps stage.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
