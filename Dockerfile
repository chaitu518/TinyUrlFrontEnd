# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

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
