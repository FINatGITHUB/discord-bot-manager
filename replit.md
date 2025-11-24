# Discord Bot Management Dashboard

## Overview

A full-stack web application for managing Discord bots with real-time monitoring, server management, command configuration, and activity tracking. Built with React frontend and Express backend, integrating with Discord.js for bot operations.

## Deployment Status

✅ **Application Complete & Ready for Deployment**

- Deploy to Railway, Fly.io, or Heroku using instructions in `DEPLOYMENT.md`
- Requires: `DISCORD_BOT_TOKEN` environment variable
- Fully responsive, production-ready UI with dark/light mode
- All features functional: dashboard, servers, commands, activity log, settings

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript using Vite as the build tool
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management with infinite stale time and disabled refetching

**UI Component System**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design inspired by Discord, Linear, and Material Design principles
- Custom theme system supporting light/dark modes via CSS variables
- Responsive layout with fixed sidebar (16rem width) and collapsible mobile view

**State Management**
- React Query for API data caching and synchronization
- React Hook Form with Zod validation for form handling
- Local storage for theme preferences

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- Development mode uses Vite middleware for HMR and SSR
- Production mode serves pre-built static assets

**Discord Integration**
- Discord.js client for bot operations (guilds, channels, members)
- Replit Connector authentication system for Discord OAuth
- Dynamic token refresh mechanism for continuous bot connectivity
- Bot intents: Guilds, GuildMessages, GuildMembers

**Data Storage**
- In-memory storage implementation (MemStorage class)
- Designed with interface (IStorage) for future database migration
- Drizzle ORM configured for PostgreSQL (not yet implemented)
- Schema definitions using Zod for runtime validation

**API Design**
- RESTful endpoints under `/api` prefix
- Bot status monitoring (`/api/bot/status`)
- Server management (`/api/servers`, `/api/servers/:id/channels`)
- Command configuration (`/api/commands`, `/api/commands/:id`)
- Activity logging (`/api/activity`)
- Settings management (`/api/settings`)

### Data Models

**Core Entities**
- BotStatus: Discord bot metadata, uptime, statistics
- Server: Discord guild information with member counts
- Channel: Server channels with permission metadata
- Command: Bot commands with usage tracking and enable/disable toggle
- ActivityEvent: Event log (commands, joins, leaves, errors, messages)
- BotSettings: Bot configuration (prefix, status message, activity type)

### External Dependencies

**Discord Services**
- Discord API via discord.js library (v14.25.1)
- Replit Connector API for OAuth token management
- Discord CDN for guild/user avatars

**Development Tools**
- Replit-specific plugins for dev environment (cartographer, dev-banner, runtime-error-modal)
- TypeScript for type safety across full stack
- ESBuild for production bundling

**UI Libraries**
- Radix UI primitives for accessible components
- Lucide React for icons
- date-fns for date formatting
- class-variance-authority and clsx for conditional styling

**Database (Configured but Not Active)**
- Neon Database serverless PostgreSQL driver
- Drizzle ORM with drizzle-kit for migrations
- connect-pg-simple for session storage (imported but unused)

### Architecture Patterns

**Separation of Concerns**
- `/client` - Frontend React application
- `/server` - Backend Express application  
- `/shared` - Shared type definitions and schemas

**Type Safety**
- Zod schemas define runtime validation and TypeScript types
- Shared schema exports ensure type consistency between client and server

**Build Strategy**
- Development: Vite dev server with Express backend
- Production: Pre-built frontend served as static files from Express

**Storage Abstraction**
- IStorage interface allows swapping storage implementations
- Current MemStorage holds data in memory
- Future implementation can use Drizzle ORM with PostgreSQL