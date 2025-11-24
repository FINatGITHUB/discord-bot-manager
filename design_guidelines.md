# Discord Bot Management Dashboard - Design Guidelines

## Design Approach
**System**: Hybrid approach drawing from Discord's interface patterns, Linear's clean dashboard aesthetics, and Material Design's data-dense application principles. Focus on information density, quick scanning, and operational efficiency.

## Typography System
- **Primary Font**: Inter or similar geometric sans-serif via Google Fonts CDN
- **Headings**: 
  - Page titles: text-2xl, font-semibold
  - Section headers: text-lg, font-medium
  - Card titles: text-sm, font-medium, uppercase tracking
- **Body**: text-sm for primary content, text-xs for metadata/labels
- **Monospace**: For bot IDs, channel IDs, logs (use 'Fira Code' or 'JetBrains Mono')

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently (p-2, p-4, p-6, p-8, gap-4, space-y-6, etc.)

**Dashboard Structure**:
- Persistent sidebar (w-64, fixed left navigation)
- Main content area with top header bar (h-16)
- Content padding: p-6 to p-8
- Card/panel spacing: gap-6 between major sections

**Grid Systems**:
- Stats cards: 3-4 columns on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Server list: 2-3 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Activity logs: Full-width single column with max-w-5xl

## Component Library

### Navigation
- **Sidebar**: Fixed width (w-64), contains bot avatar/name at top, navigation links with icons (Heroicons), settings at bottom
- **Top Bar**: Breadcrumbs, search input, user profile dropdown, notification bell

### Dashboard Widgets
- **Status Card**: Compact card showing bot online/offline state, uptime counter, last restart time
- **Stats Grid**: 4 cards showing: Total Servers, Total Users, Commands/Day, Active Channels
  - Each card: p-6, rounded-lg border, includes large number (text-3xl font-bold) with label below
  
### Server Management
- **Server Cards**: Grid layout, each card shows:
  - Server icon (w-12 h-12 rounded-full)
  - Server name (truncate with ellipsis)
  - Member count badge
  - Quick actions (configure, leave) as icon buttons
  - Hover state reveals more details

### Command Panel
- **Table Layout**: Sortable table with columns: Command Name, Category, Usage Count, Status Toggle
- Use custom toggle switches (not default checkboxes)
- Search/filter bar above table

### Activity Log
- **Feed Design**: Timeline-style with timestamps on left
- Each entry: Rounded container (p-4) with icon, event type, description, timestamp
- Auto-refresh indicator in corner
- Max height with overflow scroll

### Forms & Inputs
- **Text Inputs**: h-10, px-4, rounded-md border, focus ring states
- **Select Dropdowns**: Match input height, custom chevron icon
- **Toggle Switches**: w-11 h-6 rounded-full with sliding indicator
- **Buttons**: 
  - Primary: px-4 py-2, rounded-md, font-medium
  - Secondary: px-4 py-2, rounded-md border
  - Icon-only: p-2, rounded-md

### Modals & Overlays
- **Modal Container**: max-w-md to max-w-2xl depending on content, rounded-lg, p-6
- **Backdrop**: Fixed overlay with blur effect
- **Close Button**: Absolute top-right corner

## Interaction Patterns
- **Loading States**: Skeleton loaders for cards and lists (not spinners)
- **Empty States**: Centered icon + message + action button
- **Animations**: Minimal - only for state transitions (toggles, dropdowns opening). Duration: 150-200ms
- **Hover States**: Subtle opacity changes or border emphasis, no dramatic transformations

## Accessibility
- All interactive elements have min-height of h-10 (40px)
- Form labels always visible (not placeholder-only)
- Focus indicators on all focusable elements
- ARIA labels for icon-only buttons
- Consistent tab order following visual hierarchy

## Icons
**Library**: Heroicons (via CDN)
- Navigation: outline style
- Actions: solid style for active states, outline for inactive
- Status indicators: Custom dot with animation-pulse when needed

## Responsive Strategy
- **Desktop (lg:)**: Full sidebar + multi-column grids
- **Tablet (md:)**: Collapsible sidebar, 2-column grids
- **Mobile (base)**: Hidden sidebar (hamburger menu), single column stacks, bottom navigation for key actions

## Images
**No hero images needed** - this is a functional dashboard, not a marketing page.

**Bot/Server Avatars**: 
- Use Discord CDN URLs for actual avatars
- Fallback: Initials in rounded containers with gradient backgrounds
- Sizes: w-8 h-8 (small), w-12 h-12 (medium), w-16 h-16 (large profile)