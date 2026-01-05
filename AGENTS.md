# AGENTS.md - Claude Code Session Insights

> This file contains important context and insights for Claude Code agents working on the Friday Kickers Svelte frontend in future sessions.

## Project Overview

This is a **SvelteKit 2.0** frontend for the Friday Kickers beer tracking and match management system. The backend is a **Go (Gin framework)** API deployed on Google Cloud Run.

**Key Point**: This project follows a strict layered architecture with clear separation of concerns. Always maintain this structure.

## Critical Backend API Patterns

### 1. Match vs Tournament Endpoints

**IMPORTANT**: These two endpoints have DIFFERENT data structures:

**Regular Match** (`POST /v1/match`):
```typescript
// Teams are IMPLICIT (always Old vs Young)
{
  oldGoals: number,
  youngGoals: number
}
```

**Tournament** (`POST /v1/match/tournament`):
```typescript
// Teams are EXPLICIT (3 teams: Old, Middle, Young)
[
  {
    homeTeam: "Old",
    awayTeam: "Young",
    homeGoals: number,
    awayGoals: number
  },
  // ... 5 more matches (total 6 for round-robin)
]
```

**Never mix these up!** The match form uses oldGoals/youngGoals only. The tournament form uses homeTeam/awayTeam arrays.

### 2. Server-Side Filtering

**All filtering happens on the backend** - never implement client-side filtering logic.

The frontend only:
- Passes query parameters to the API
- Displays the filtered results

Examples:
- Beer overview: `?active=true&filter=searchTerm`
- Statistics: `?active=true&filter=searchTerm&year=2024`
- Standings: `?year=2024&tournament=true`

### 3. Authentication Pattern

- JWT tokens stored in **localStorage** (acceptable for this use case)
- Tokens automatically injected via axios interceptors in `apiClient.ts`
- 401 responses trigger auto-logout
- All requests use `Bearer ${token}` authentication

## Architecture Patterns

### Layered Architecture (STRICT)

```
Routes (Presentation)
    ↓ uses stores
Stores (State Management)
    ↓ calls services
Services (Business Logic)
    ↓ uses
API Client (Infrastructure)
```

**Rules**:
1. Routes NEVER call services directly - always go through stores
2. Stores contain state + async operations (loading, error handling)
3. Services are pure business logic - no UI concerns, no state
4. API Client handles all HTTP concerns (tokens, interceptors, error normalization)

### File Organization

```
src/
├── routes/                    # SvelteKit pages (file-based routing)
├── lib/
│   ├── api/                   # HTTP infrastructure
│   │   ├── apiClient.ts       # Axios instance (DO NOT DUPLICATE)
│   │   └── endpoints.ts       # Endpoint constants
│   ├── components/
│   │   ├── layout/            # Navigation, etc.
│   │   ├── features/          # Feature-specific components
│   │   │   ├── beer/
│   │   │   ├── match/
│   │   │   └── tournament/
│   │   └── shared/            # Reusable UI (Toast, etc.)
│   ├── services/              # Business logic layer
│   ├── stores/                # Svelte stores (state management)
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Helper functions
│   └── storage/               # Browser storage abstraction
```

**Never create files outside this structure!**

## Common Patterns

### 1. Debouncing Search Inputs

**Standard debounce: 500ms** for all search inputs.

```typescript
let searchTimeout: ReturnType<typeof setTimeout>;

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const searchQuery = target.value;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    await someStore.setSearchFilter(searchQuery);
  }, 500);
}
```

### 2. Optimistic UI Updates

Used for **beer tracking only** (drink beer, undo beer, payment).

Pattern:
1. Update UI immediately (optimistic)
2. Make API call
3. On success: keep update + show success toast
4. On error: rollback + show error toast

```typescript
async drinkBeer(userId: number) {
  update(state => {
    const users = state.users.map(u =>
      u.id === userId ? { ...u, beers: u.beers + 1 } : u
    );
    return { ...state, users };
  });

  try {
    await userService.drinkBeer(userId);
    toastStore.success('Bier hinzugefügt!');
    await this.loadUsers(); // Sync with server
  } catch (error) {
    toastStore.error('Fehler beim Hinzufügen');
    await this.loadUsers(); // Rollback by reloading
  }
}
```

### 3. Store Pattern

Every store follows this structure:

```typescript
interface SomeState {
  data: SomeType[];
  isLoading: boolean;
  error: string | null;
}

function createSomeStore() {
  const initialState: SomeState = {
    data: [],
    isLoading: false,
    error: null,
  };

  const { subscribe, update } = writable<SomeState>(initialState);

  return {
    subscribe,

    async loadData() {
      update(state => ({ ...state, isLoading: true }));
      try {
        const data = await someService.getData();
        update(state => ({ ...state, data, isLoading: false }));
      } catch (error: any) {
        console.error('Failed to load:', error);
        toastStore.error(error.message || 'Error message');
        update(state => ({ ...state, isLoading: false, error: error.message }));
      }
    },
  };
}

export const someStore = createSomeStore();
```

### 4. Component Pattern (Routes)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { someStore } from '$lib/stores/someStore';

  onMount(async () => {
    await someStore.loadData();
  });

  $: data = $someStore.data;
  $: isLoading = $someStore.isLoading;
</script>

<div class="page-content">
  <div class="container">
    {#if isLoading}
      <!-- Loading spinner -->
    {:else if data.length === 0}
      <!-- Empty state -->
    {:else}
      <!-- Data display -->
    {/if}
  </div>
</div>
```

## Design System

### Colors

```css
--color-primary: #10b981        /* Green - beer theme */
--color-primary-dark: #059669   /* Dark green */
--color-secondary: #f59e0b      /* Amber - beer color */
--color-danger: #ef4444         /* Red */
--color-success: #10b981        /* Green */
```

### Spacing

Use CSS custom properties consistently:
- `--spacing-xs`: 0.25rem
- `--spacing-sm`: 0.5rem
- `--spacing-md`: 1rem (default)
- `--spacing-lg`: 1.5rem
- `--spacing-xl`: 2rem

### Mobile-First

- Default styles for mobile (< 768px)
- Desktop breakpoint: `@media (min-width: 768px)`

## Common Gotchas

### 1. ❌ DON'T: Call Services Directly from Routes

```svelte
<!-- WRONG -->
<script>
  import { userService } from '$lib/services/userService';

  onMount(async () => {
    const users = await userService.getUsers(); // ❌
  });
</script>
```

```svelte
<!-- CORRECT -->
<script>
  import { beersStore } from '$lib/stores/beersStore';

  onMount(async () => {
    await beersStore.loadUsers(); // ✅
  });
</script>
```

### 2. ❌ DON'T: Create Multiple API Clients

There is **ONE** axios instance in `apiClient.ts`. Never create another axios instance or import axios directly.

```typescript
// ❌ WRONG
import axios from 'axios';
const response = await axios.get('/api/something');

// ✅ CORRECT
import { apiClient } from '$lib/api/apiClient';
const data = await apiClient.get<SomeType>('/v1/something');
```

### 3. ❌ DON'T: Implement Client-Side Filtering

The backend handles all filtering. Just pass query params.

```typescript
// ❌ WRONG
const filteredUsers = allUsers.filter(u => u.name.includes(searchTerm));

// ✅ CORRECT
await userService.getUsers({ filter: searchTerm }); // Backend filters
```

### 4. ❌ DON'T: Mix Match and Tournament Data Structures

Match form: `{ oldGoals, youngGoals }` ONLY
Tournament form: Array of `{ homeTeam, awayTeam, homeGoals, awayGoals }`

### 5. ❌ DON'T: Forget TypeScript Types

Always use proper types from `api.types.ts`. Never use `any` unless absolutely necessary.

```typescript
// ❌ WRONG
const users: any = await userService.getUsers();

// ✅ CORRECT
const users: User[] = await userService.getUsers();
```

## Environment Setup

### Required Environment Variable

Create `.env` file:
```env
VITE_API_BASE_URL=https://fridaykickers-zhg62jfgha-ey.a.run.app
```

### Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run check        # TypeScript type checking
npm run build        # Production build
npm run preview      # Preview production build
```

## Feature-Specific Notes

### Beer Tracking
- Uses **optimistic updates** for instant feedback
- Search debounced at 500ms
- Active/All toggle controlled by `active` query param
- Balance calculation: `(beers * beerPrice) - payments`

### Match Management
- Teams are FIXED: Old vs Young (no selectors)
- Year filter: 2013 to current + "Alle Jahre" (all years)
- Standings use `tournament=false` query param

### Tournament
- Fixed 6 matches for round-robin (3 teams)
- Match order MUST be: Old-Young, Middle-Young, Middle-Old, Young-Old, Young-Middle, Old-Middle
- All 6 matches required before submission
- Standings use `tournament=true` query param

### Statistics
- Year filter: 2013 to current + "Gesamt" (all time)
- Default: `active=false` (show all players), `year=all`
- Search debounced at 500ms
- Expandable cards with detailed stats

### Settings
- Admin password: **8848** (hardcoded, matches old frontend)
- Confirmation modal required before saving
- Only updates beer price (no other settings)

## Backend API Reference

**Base URL**: `https://fridaykickers-zhg62jfgha-ey.a.run.app`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/login` | User authentication | `{ username, password }` |
| GET | `/logout` | User logout | - |
| GET | `/v1/user` | Get users | Query: `?active=true&filter=name` |
| PUT | `/v1/user/{id}/drink` | Add beer | - |
| PUT | `/v1/user/{id}/drink/undo` | Undo beer | - |
| PUT | `/v1/user/{id}/pay` | Add payment | `{ amount }` |
| POST | `/v1/match` | Create match | `{ oldGoals, youngGoals }` |
| POST | `/v1/match/tournament` | Create tournament | `[{ homeTeam, awayTeam, homeGoals, awayGoals }]` |
| GET | `/v1/match/tableaux` | Get standings | Query: `?year=2024&tournament=true` |
| GET | `/v1/stats` | Get statistics | Query: `?active=true&filter=name&year=2024` |
| GET | `/v1/settings` | Get settings | - |
| POST | `/v1/settings` | Update settings | `{ beerPrice }` |

## Testing Checklist

When making changes, always test:

1. **Mobile view** (primary use case - most users on mobile)
2. **Desktop view** (≥ 768px)
3. **Loading states** (spinner displays correctly)
4. **Empty states** (no data scenarios)
5. **Error handling** (toast messages appear)
6. **Search/filters** (debouncing works, results correct)
7. **Form validation** (invalid input handled)
8. **Authentication** (logout on 401, token persists)

## Quick Troubleshooting

### "Network Error" / API Calls Failing
- Check if backend is running: `https://fridaykickers-zhg62jfgha-ey.a.run.app`
- Check if token is valid: Look in localStorage for `auth_token`
- Check axios interceptors in `apiClient.ts`

### TypeScript Errors
- Run `npm run check` to see all type errors
- Ensure all types are defined in `api.types.ts`
- Check store subscriptions use `$storeName` syntax

### Components Not Updating
- Check if you're subscribing to store with `$` prefix: `$someStore`
- Ensure store `update()` creates new objects (immutability)
- Check if `onMount()` is calling store load methods

### Styling Issues
- All global styles in `app.css`
- Component styles in `<style>` blocks (scoped by default)
- Use CSS custom properties from design system
- Mobile-first: default styles for mobile, `@media (min-width: 768px)` for desktop

## Implementation Checklist for New Features

When adding a new feature:

1. [ ] Define TypeScript types in `types/api.types.ts`
2. [ ] Add endpoint constant to `api/endpoints.ts`
3. [ ] Create service in `services/` (business logic)
4. [ ] Create store in `stores/` (state management)
5. [ ] Create components in `components/features/` (if needed)
6. [ ] Create route page in `routes/` (SvelteKit routing)
7. [ ] Add navigation link to `Navigation.svelte` (if needed)
8. [ ] Test on mobile and desktop
9. [ ] Update README.md documentation

## Performance Best Practices

1. **Debounce search inputs**: Always 500ms
2. **Server-side filtering**: Never filter large datasets on client
3. **Lazy loading**: Use `onMount()` to load data when page opens
4. **Optimistic updates**: Only for instant user feedback (beer tracking)
5. **Minimal re-renders**: Use reactive declarations (`$:`) wisely
6. **Toast cleanup**: Toasts auto-dismiss after 3 seconds

## Git Workflow (If Needed)

The project structure is clean and organized. If making changes:

1. Follow the existing file organization strictly
2. Keep components small and focused
3. Don't create unnecessary files or abstractions
4. Maintain TypeScript strict typing
5. Test both mobile and desktop views

## Summary

**Key Takeaways for Future Sessions**:

✅ **DO**:
- Follow layered architecture (Routes → Stores → Services → API Client)
- Use server-side filtering (pass query params)
- Debounce search at 500ms
- Use TypeScript types from `api.types.ts`
- Use single axios instance from `apiClient.ts`
- Maintain mobile-first responsive design
- Use CSS custom properties from design system

❌ **DON'T**:
- Call services directly from routes
- Create multiple API clients
- Implement client-side filtering
- Mix match and tournament data structures
- Skip type definitions
- Forget to test on mobile

The codebase is **feature-complete and production-ready**. Any future changes should maintain the same quality, patterns, and architectural decisions established here.
