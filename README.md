# omnicore-auth

Authentication microservice for Omnicore. Provides signup/login, JWT
validation, refresh tokens, and logout, backed by PostgreSQL + Prisma.

## Requirements

- Node.js 18+ (ESM)
- PostgreSQL

## Setup

1. Install dependencies

   - `npm install`

2. Configure environment

   Copy `env_exemple` to `.env` and fill in values:

   - `PORT`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `REFRESH_EXPIRES_IN`

3. Apply database migrations

   - `npx prisma migrate dev`

4. Start the service

   - `npm run dev`

## Scripts

- `npm run dev` - run with nodemon
- `npm start` - run in production mode
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - create/apply migrations
- `npm run prisma:studio` - open Prisma Studio

## API

Base URL: `/auth`

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/validate`

Health check: `GET /health`

## Database

Prisma schema: `prisma/schema.prisma`

Postman collection: `postman_collection.json`
