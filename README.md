# Handball Team Management App

A comprehensive application for managing handball teams, including player management, training sessions, game analysis, and statistics.

## Project Structure

```
.
├── backend/          # Node.js + TypeScript + GraphQL API
├── frontend/         # Vue 3 + TypeScript application
└── docker-compose.yml
```

## Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **API**: Apollo Server (GraphQL)
- **Database**: PostgreSQL
- **ORM**: Prisma

### Frontend
- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **GraphQL Client**: Apollo Client

## Features

- Player management (positions, comments)
- Training sessions and games tracking
- Player attendance tracking
- Export capabilities for reports
- Drill/training activity templates
- Game video analysis with event marking
- Statistics (games, seasons, filtered views)
- Video event cropping and merging (planned)

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Start development environment:
   ```bash
   # From root directory
   docker-compose up -d
   ```

4. Run backend:
   ```bash
   cd backend
   npm run dev
   ```

5. Run frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Development

- Backend runs on: http://localhost:4000
- Frontend runs on: http://localhost:5173
- GraphQL Playground: http://localhost:4000/graphql

## License

MIT
