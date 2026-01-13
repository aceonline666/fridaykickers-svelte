# Friday Kickers Svelte Frontend

> Modern SvelteKit frontend for the Friday Kickers beer tracking and match management system.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Implementation Status](#implementation-status)
- [Development Guide](#development-guide)
- [API Integration](#api-integration)
- [Design System](#design-system)
- [Deployment](#deployment)

## ✨ Features

- 🍺 **Beer Tracking**: Track beer consumption with undo functionality and balance calculation
- ⚽ **Match Management**: Record match results, view standings with year filtering
- 🏆 **Tournament**: Round-robin tournament tracking (Old, Middle, Young teams - 6 matches)
- 📊 **Statistics**: Player rankings, leaderboards with year and active/all filters
- 💰 **Payment Management**: Record payments and balance tracking
- ⚙️ **Settings**: Admin-protected beer price configuration
- 🔐 **Authentication**: JWT-based auth with Bearer tokens
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- 🎨 **Clean UI**: Minimalistic green theme with excellent UX
- 📲 **Progressive Web App**: Install as native app on mobile and desktop

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | SvelteKit | 2.0 |
| Language | TypeScript | 5.0 |
| Build Tool | Vite | 5.0 |
| HTTP Client | Axios | 1.7.0 |
| State Management | Svelte Stores | Native |
| Styling | Custom CSS | - |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Access to Friday Kickers backend API

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=https://fridaykickers-zhg62jfgha-ey.a.run.app
```

## 📁 Project Structure

```
src/
├── routes/                       # SvelteKit pages (file-based routing)
│   ├── +layout.svelte           # Root layout with navigation
│   ├── +page.svelte             # Beer overview (home page)
│   ├── login/+page.svelte       # Login page
│   ├── matches/+page.svelte     # Match results and standings
│   ├── tournament/+page.svelte  # Tournament management
│   ├── statistics/+page.svelte  # Player statistics
│   ├── settings/+page.svelte    # Settings configuration
│   └── logout/+page.svelte      # Logout handler
│
├── lib/
│   ├── api/                     # HTTP infrastructure
│   │   ├── apiClient.ts         # Axios instance with interceptors
│   │   └── endpoints.ts         # API endpoint definitions
│   │
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   └── Navigation.svelte
│   │   ├── features/            # Feature-specific components
│   │   │   ├── beer/
│   │   │   │   └── PlayerCard.svelte
│   │   │   ├── match/
│   │   │   │   ├── MatchForm.svelte
│   │   │   │   └── StandingsTable.svelte
│   │   │   └── tournament/
│   │   │       └── TournamentForm.svelte
│   │   └── shared/              # Reusable UI components
│   │       └── Toast.svelte
│   │
│   ├── services/                # Business logic layer
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── matchService.ts
│   │   ├── statsService.ts
│   │   └── settingsService.ts
│   │
│   ├── stores/                  # State management (Svelte stores)
│   │   ├── authStore.ts
│   │   ├── beersStore.ts
│   │   ├── matchesStore.ts
│   │   ├── tournamentStore.ts
│   │   ├── statsStore.ts
│   │   ├── settingsStore.ts
│   │   └── toastStore.ts
│   │
│   ├── types/                   # TypeScript definitions
│   │   └── api.types.ts
│   │
│   ├── utils/                   # Helper functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   └── storage/                 # Browser storage abstraction
│       └── localStorage.ts
│
├── app.html                     # HTML template
└── app.css                      # Global styles with design system
```

## 🏗 Architecture

### 4-Layer Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer (UI)           │
│   - Pages (SvelteKit Routes)        │
│   - Components (Reusable UI)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   State Management Layer            │
│   - Svelte Stores                   │
│   - Reactive State                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Application Layer                 │
│   - Services (Business Logic)       │
│   - Utilities (Helpers)             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Infrastructure Layer              │
│   - API Client (HTTP)               │
│   - Storage (LocalStorage)          │
└─────────────────────────────────────┘
```

### Key Architectural Decisions

1. **SvelteKit over Vanilla Svelte**: Built-in routing, SSR support, better DX
2. **Layered Architecture**: Clear separation of concerns, maintainability
3. **Svelte Stores**: Native state management, no external libraries needed
4. **Service Layer**: Business logic separated from UI components
5. **Centralized API Client**: DRY principle, consistent error handling
6. **TypeScript Throughout**: Type safety, better IDE support
7. **Optimistic UI Updates**: Instant feedback for better UX

## ✅ Implementation Status

### Completed Features

#### Infrastructure ✅
- API client with automatic Bearer token injection
- Request/response interceptors
- Error handling and normalization
- LocalStorage abstraction for SSR safety

#### Authentication ✅
- Login/logout functionality
- Token persistence
- Route guards
- Auto-logout on 401

#### Beer Tracking ✅
- Player list with search and filtering
- Beer consumption tracking
- Undo functionality
- Payment management
- Balance calculation
- Optimistic UI updates

#### Match Management ✅
- Match entry form (Old vs Young)
- Standings table with year filtering
- Recent matches display
- Auto-reload on data changes

#### Tournament ✅
- Round-robin tournament form (6 matches)
- Fixed teams: Old, Middle, Young
- Tournament standings table
- Last 6 tournament matches display

#### Statistics ✅
- Player rankings with search
- Active/All filter toggle
- Year filtering (2013 to current + "Gesamt")
- Expandable cards with detailed stats
- Color-coded badges for metrics

#### Settings ✅
- Beer price configuration
- Admin password protection
- Confirmation dialog

#### UI/UX ✅
- Mobile-first responsive design
- Toast notifications
- Loading states
- Empty states
- Error handling
- Consistent spacing and typography

## 💻 Development Guide

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR
npm run check        # Run TypeScript type checking
npm run check:watch  # Type checking in watch mode

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `src/`
   - Hot module replacement (HMR) updates automatically
   - Check console for TypeScript errors

3. **Type Check**
   ```bash
   npm run check
   ```

4. **Build and Test**
   ```bash
   npm run build
   npm run preview
   ```

### Code Style Guidelines

1. **TypeScript**: Use strict typing, avoid `any`
2. **Components**: Keep small and focused (single responsibility)
3. **Services**: Pure business logic, no UI concerns
4. **Stores**: Single source of truth for state
5. **Naming**: Descriptive, clear names (camelCase for variables, PascalCase for components)

### Best Practices

**Svelte:**
- Use reactive declarations (`$:`) for computed values
- Subscribe to stores with `$storeName` syntax
- Keep components declarative
- Use `onMount` for initialization
- Leverage two-way binding (`bind:value`)

**Error Handling:**
- Use try-catch in all async operations
- Show user-friendly error messages via toasts
- Log errors to console for debugging
- Handle 401 errors with auto-logout

**State Management:**
- Keep global state in stores
- Use local component state for UI-only state
- Derive computed values instead of duplicating
- Update state immutably

## 🔌 API Integration

### Backend API

- **Base URL**: `https://fridaykickers-zhg62jfgha-ey.a.run.app`
- **Authentication**: Bearer token (JWT)
- **Content Type**: application/json

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /login | User authentication |
| GET | /logout | User logout |
| GET | /v1/user | Get users (filters: active, search) |
| PUT | /v1/user/{id}/drink | Add beer |
| PUT | /v1/user/{id}/drink/undo | Undo beer |
| PUT | /v1/user/{id}/pay | Add payment |
| POST | /v1/match | Create match (oldGoals, youngGoals) |
| POST | /v1/match/tournament | Create tournament (array of matches) |
| GET | /v1/match/tableaux | Get standings (filters: year, tournament) |
| GET | /v1/stats | Get statistics (filters: active, search, year) |
| GET/POST | /v1/settings | Get/update settings |

## 🎨 Design System

### Color Palette

```css
--color-primary: #10b981        /* Green - beer theme */
--color-primary-dark: #059669   /* Dark green */
--color-secondary: #f59e0b      /* Amber - beer color */
--color-danger: #ef4444         /* Red */
--color-success: #10b981        /* Green */
--color-text: #111827           /* Dark gray */
--color-text-light: #6b7280     /* Light gray */
--color-border: #e5e7eb         /* Border gray */
--color-bg: #f9fafb             /* Background */
--color-surface: #ffffff        /* White */
```

### Typography

```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem
```

### Spacing

```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
```

### Responsive Breakpoints

- **Mobile**: < 768px (default)
- **Desktop**: ≥ 768px

### Design Principles

- **Minimalism**: Clean white surfaces, subtle shadows, ample whitespace
- **Mobile-First**: Layout optimized for small screens first
- **Performance**: System fonts, minimal CSS, CSS custom properties
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## 📲 Progressive Web App (PWA)

The Friday Kickers app is configured as a Progressive Web App and can be installed on mobile and desktop devices.

### Features

- **Offline Support**: App files are cached and work without internet
- **Install to Home Screen**: Appears like a native app
- **Standalone Mode**: Runs without browser UI
- **Fast Loading**: Cached resources load instantly
- **Auto Updates**: Service worker updates automatically on new deployments

### Installation

#### Desktop (Chrome/Edge)

1. Visit the deployed app URL
2. Look for the install icon in the address bar (⊕)
3. Click to install the app
4. App opens in standalone window

#### Mobile (Android/iOS)

**Android (Chrome):**
1. Visit the deployed app URL
2. Tap the three-dot menu
3. Select "Install app" or "Add to Home Screen"

**iOS (Safari):**
1. Visit the deployed app URL
2. Tap the Share button
3. Select "Add to Home Screen"

### Testing PWA Locally

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

Then visit the preview URL in Chrome/Edge and click the install icon.

**Note**: PWAs require HTTPS in production. GitHub Pages provides HTTPS automatically.

### PWA Requirements Met

✅ HTTPS (via GitHub Pages)
✅ Web App Manifest
✅ Service Worker
✅ App Icons (192x192, 512x512)
✅ Responsive Design
✅ Offline Functionality

### Verification

Use Chrome DevTools Lighthouse to verify PWA setup:

1. Open the deployed app
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Run "Progressive Web App" audit
5. Should score 100% or near 100%

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output includes:
- `build/` - Static files ready for deployment
- `build/manifest.json` - PWA manifest
- `build/service-worker.js` - Service worker for offline support
- `build/icon-192.png` & `build/icon-512.png` - App icons

### Deployment Options

**1. GitHub Pages (Current)**
- Free hosting
- Automatic HTTPS
- Configured with base path `/fridaykickers-svelte`
- PWA-ready
- GitHub Actions workflow for automatic deployment

**2. Vercel**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Git integration

**3. Netlify**
- Drag-and-drop deployment
- Form handling
- Continuous deployment

### Environment Variables

Production:
```env
VITE_API_BASE_URL=https://fridaykickers-zhg62jfgha-ey.a.run.app
```

### GitHub Pages Setup

The app is configured for GitHub Pages deployment with:
- Static adapter in `svelte.config.js`
- Base path: `/fridaykickers-svelte`
- Service worker for offline functionality
- PWA manifest with correct paths

## 📚 Feature Documentation

### Beer Tracking

**Features:**
- Player cards with beer count and balance
- Click to expand actions
- 🍺 Add beer with optimistic update
- ↩️ Undo last beer
- 💰 Payment form with custom amounts
- Search by player name (debounced 500ms)
- Active/All filter toggle

**Data Flow:**
```
User clicks "Bier" → beersStore.drinkBeer()
  ↓
Optimistic UI update (instant feedback)
  ↓
API Call: PUT /v1/user/{id}/drink
  ↓
Success → Keep update + Toast
Error → Rollback + Error Toast
```

### Match Management

**Features:**
- Match entry form (Old vs Young teams fixed)
- Goals input with validation
- Standings table with:
  - Rank, Team, Goals, Goal Difference, Points
  - First place highlighted
  - Color-coded differences
- Year filter (2013 to current + "Alle Jahre")
- Last 5 matches display

**Data Flow:**
```
Enter match data → Validate → matchesStore.saveMatch()
  ↓
API Call: POST /v1/match { oldGoals, youngGoals }
  ↓
Success → Reload matches + standings → Toast
```

### Tournament

**Features:**
- 6 fixed matches for round-robin tournament:
  1. Old vs Young
  2. Middle vs Young
  3. Middle vs Old
  4. Young vs Old
  5. Young vs Middle
  6. Old vs Middle
- All 6 matches must be filled
- Tournament standings table
- Last 6 tournament matches

**Data Flow:**
```
Fill 6 matches → Validate all → tournamentStore.saveTournament()
  ↓
API Call: POST /v1/match/tournament [array of 6 matches]
  ↓
Success → Reload matches + standings → Toast
```

### Statistics

**Features:**
- Player ranking cards
- Search by name (debounced 500ms)
- Active/All filter
- Year filter (2013 to current + "Gesamt")
- Expandable cards showing:
  - Rank and name
  - Badges: 🍺 Beers, 🚴 Max/Training, ⚽ Trainings
  - Details: € Payments, Avg beers/training
- Inactive badge for inactive players

### Settings

**Features:**
- Beer price configuration (number input with € suffix)
- Admin password protection (password: 8848)
- Confirmation dialog before saving
- Success toast on save

## 🔒 Security

1. **Token Storage**: localStorage (acceptable for this use case)
2. **Route Guards**: Implemented in root layout
3. **API Security**: Bearer token on all requests
4. **XSS Protection**: Svelte auto-escapes content
5. **Input Validation**: Client-side + trust backend validation

## 📝 Development Notes

### Backend Alignment

- **Match API**: Expects `{ oldGoals, youngGoals }` only (teams are implicit)
- **User API**: Search uses `filter` query param (server-side)
- **Stats API**: Year filter uses `year` query param (0 or omitted = all years)
- **Tournament API**: Expects array of match objects with `homeTeam`, `awayTeam`, `homeGoals`, `awayGoals`

### Debouncing

- Search inputs debounced at 500ms to reduce API calls
- Prevents excessive backend load during typing

### Optimistic Updates

- Beer tracking uses optimistic updates for instant feedback
- Automatic rollback on API errors
- Improves perceived performance

### Server-Side Filtering

- All filtering (search, active/inactive) happens on backend
- Frontend passes query parameters only
- No client-side filtering logic

## 🤝 Contributing

1. Follow the layered architecture
2. Use TypeScript for all new code
3. Keep components small and focused
4. Use Svelte stores for shared state
5. Handle errors gracefully
6. Test on both mobile and desktop
7. Update documentation when needed

## 📄 License

Private project for Friday Kickers team.

---

## 🎯 Summary

The Friday Kickers Svelte frontend is a complete, modern web application featuring:

✅ Full beer tracking with undo and payments
✅ Match and tournament management
✅ Statistics and rankings
✅ Admin settings
✅ Progressive Web App (installable on mobile & desktop)
✅ Offline functionality with service worker
✅ Mobile-first responsive design
✅ Clean, layered architecture
✅ Type-safe TypeScript
✅ Excellent UX with optimistic updates
✅ Comprehensive documentation

**Ready for production use!** 🚀
