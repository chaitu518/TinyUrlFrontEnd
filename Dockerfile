# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time variables (Next.js reads these at build time)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

RUN echo "BUILD API BASE = $NEXT_PUBLIC_API_BASE_URL"

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Run Stage ----------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
