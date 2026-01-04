# Friday Kickers Svelte Frontend

Modern Svelte frontend for the Friday Kickers beer tracking and match management system.

## Features

- 🍺 Beer consumption tracking with undo functionality
- 💰 Payment management and balance calculation
- ⚽ Match results and tournament management
- 📊 Statistics and leaderboards
- 👥 User management (CRUD operations)
- ⚙️ Settings configuration
- 🔐 JWT-based authentication with Bearer tokens

## Tech Stack

- **Framework**: SvelteKit 2.0
- **Language**: TypeScript 5.0
- **Styling**: CSS (planned: Tailwind CSS or Bootstrap)
- **HTTP Client**: Axios
- **State Management**: Svelte Stores
- **Build Tool**: Vite 5.0

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation including:
- Layer descriptions (Presentation, State, Application, Infrastructure)
- Data flow patterns
- Component structure
- Security considerations
- Performance optimizations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to Friday Kickers backend API

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://fridaykickers-zhg62jfgha-ey.a.run.app
```

## Project Structure

```
src/
├── routes/              # SvelteKit pages (file-based routing)
├── lib/
│   ├── components/      # Reusable Svelte components
│   ├── stores/          # Svelte stores for state management
│   ├── services/        # Business logic and API orchestration
│   ├── api/             # API client and endpoints
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript type definitions
│   └── storage/         # Browser storage abstraction
├── hooks.server.ts      # SvelteKit server hooks (auth guards)
└── app.html            # HTML template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run type checking
- `npm run check:watch` - Run type checking in watch mode

## Backend API

This frontend communicates with the Friday Kickers Go backend:
- **Base URL**: `https://fridaykickers-zhg62jfgha-ey.a.run.app`
- **Authentication**: Bearer token (JWT)
- **API Documentation**: See backend repository

## Contributing

1. Follow the layered architecture defined in ARCHITECTURE.md
2. Use TypeScript for all new code
3. Keep components small and focused
4. Use Svelte stores for shared state
5. Handle errors gracefully with user-friendly messages

## License

Private project for Friday Kickers team.
