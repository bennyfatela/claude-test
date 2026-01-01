# Handball Management - Frontend

Vue 3 frontend application for handball team management.

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia
- **GraphQL Client**: Apollo Client
- **Styling**: Plain CSS (scoped)

## Project Structure

```
src/
├── main.ts              # Application entry point
├── App.vue              # Root component
├── router.ts            # Vue Router configuration
├── style.css            # Global styles
├── components/          # Reusable components (to be added)
├── views/               # Page components
│   ├── Dashboard.vue
│   ├── Players.vue
│   ├── TrainingSessions.vue
│   ├── Games.vue
│   ├── GameDetails.vue
│   └── Statistics.vue
├── composables/         # Vue composables (to be added)
├── types/               # TypeScript type definitions
│   └── index.ts
└── graphql/             # GraphQL queries/mutations (to be added)
```

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

4. Preview production build:
   ```bash
   pnpm preview
   ```

## Available Scripts

- `pnpm dev` - Start development server (http://localhost:5173)
- `pnpm build` - Type-check and build for production
- `pnpm preview` - Preview production build locally
- `pnpm type-check` - Run TypeScript type checking

## Features (Planned)

- Player management interface
- Training session scheduling and drill templates
- Game management with video analysis
- Event marking (goals, fouls, etc.) synced with video
- Attendance tracking
- Statistics dashboard with filters
- Export capabilities for reports
- Video event cropping and compilation

## Development Notes

- Backend GraphQL API should be running on http://localhost:4000
- Vite proxy is configured to forward `/graphql` requests to backend
- All views are currently placeholders - functionality to be implemented
