# Handball Management - Backend

GraphQL API for handball team management application.

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **API**: Apollo Server (GraphQL)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Video Processing**: ffmpeg (planned)

## Project Structure

```
src/
├── index.ts              # Server entry point
├── schema/               # GraphQL type definitions
│   └── index.ts
├── resolvers/            # GraphQL resolvers (to be implemented)
│   └── index.ts
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL (via Docker):
   ```bash
   cd ..
   docker-compose up -d postgres
   ```

4. Run Prisma migrations:
   ```bash
   pnpm prisma:migrate
   ```

5. Start development server:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

## GraphQL API

The GraphQL API will be available at:
- **Development**: http://localhost:4000/graphql
- **Playground**: Accessible in browser at the same URL

## Database Schema

See `prisma/schema.prisma` for the complete database schema (to be created).

## Future Features

- Video processing with ffmpeg
- Event-based video cropping
- Statistics aggregation
- Report generation
